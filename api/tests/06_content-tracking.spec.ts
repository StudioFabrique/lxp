import { and } from "@prisma/orm-postgres/orm-client";
import { requireDatabaseRow } from "../src/utils/require-database-row.ts";
import mongoose from "mongoose";
import request from "supertest";
import { createPrismaClient } from "../src/utils/create-prisma-client.ts";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import { HEARTBEAT_INTERVAL_MS } from "../src/config/content-read.ts";
import {
  type Enrollment,
  enrollStudentInParcours,
} from "./utils/enroll-student.ts";

const prisma = createPrismaClient();

/**
 * Aller-retour complet du suivi de consultation : sans lui, l'indicateur
 * `time_on_content` reste indisponible quoi qu'il arrive.
 */
describe("Suivi de consultation des contenus", () => {
  let cookie: string[];
  let studentId: number;
  let lessonId: number;
  let coursePublication: { id: number; isPublished: boolean; visibility: boolean };
  let enrollment: Enrollment;

  beforeAll(async () => {
    await mongoConnect();

    const login = await request(app)
      .post("/v1/auth/login")
      .send({ email: "apprenant@studio.eco", password: "Abcdef@123456" })
      .expect(200);

    cookie = login.headers["set-cookie"] as unknown as string[];
    const userIdMdb = login.body._id as string;

    // Les fixtures ne créent pas de miroir PostgreSQL pour l'apprenant.
    const student = await prisma.orm.public.Student.where({
      idMdb: userIdMdb,
    }).upsert({
      create: { idMdb: userIdMdb },
      update: {},
      conflictOn: { idMdb: userIdMdb },
    });
    studentId = student.id;

    const [course, admin, tag] = await Promise.all([
      prisma.orm.public.Course.select("id", "isPublished", "visibility")
        .include("module", (related64) => related64.select("parcoursId"))
        .first(),
      prisma.orm.public.Admin.select("id").first(),
      prisma.orm.public.Tag.select("id").first(),
    ]);
    coursePublication = {
      id: course!.id,
      isPublished: course!.isPublished,
      visibility: course!.visibility,
    };
    await prisma.orm.public.Course.where({ id: course!.id })
      .update({ isPublished: true, visibility: true });

    // Les contenus sont cloisonnés par parcours : sans inscription, l'apprenant
    // reçoit 404 sur la leçon qu'il est censé consulter.
    enrollment = await enrollStudentInParcours(
      userIdMdb,
      course!.module!.parcoursId,
    );

    const lesson = await prisma.orm.public.Lesson.select("id").create({
      title: "Leçon de suivi",
      description: "Leçon créée par les tests de suivi de consultation.",
      modalite: "async",
      order: 999,
      author: "test",
      courseId: course!.id,
      adminId: admin!.id,
      tagId: tag!.id,
      visibility: true,
    });
    lessonId = lesson.id;
    await prisma.orm.public.Activity.create({
      title: "Activité de suivi",
      type: "text",
      order: 1,
      url: "",
      lessonId,
      authorId: admin!.id,
    });
  });

  afterAll(async () => {
    // On ne supprime que ce que ce fichier a créé : la fiche Student est
    // partagée avec les autres specs et référencée par leurs accomplissements.
    await prisma.orm.public.LessonRead.where({ lessonId })
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.Activity.where({ lessonId })
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.Lesson.where({ id: lessonId })
      .delete()
      .then(requireDatabaseRow);
    await prisma.orm.public.Course.where({ id: coursePublication.id })
      .update({
        isPublished: coursePublication.isPublished,
        visibility: coursePublication.visibility,
      });
    await enrollment.cleanup();
    await prisma.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("ouvre le suivi d'une leçon", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/begin`)
      .set("Cookie", cookie)
      .expect(201);

    const read = await prisma.orm.public.LessonRead.where((row) =>
      and(row.lessonId.eq(lessonId), row.studentId.eq(studentId)),
    ).first();

    expect(read).not.toBeNull();
    expect(read!.readTimeMs).toBe(0);
    expect(read!.finishedAt).toBeNull();
  });

  it("ne crée pas de second suivi pour la même leçon", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/begin`)
      .set("Cookie", cookie)
      .expect(201);

    expect(
      await prisma.orm.public.LessonRead.where({ lessonId })
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
    ).toBe(1);
  });

  it("crédite un temps borné à chaque battement", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/heartbeat`)
      .set("Cookie", cookie)
      .expect(200);

    const read = await prisma.orm.public.LessonRead.where((row) =>
      and(row.lessonId.eq(lessonId), row.studentId.eq(studentId)),
    ).first();

    // Le serveur mesure lui-même l'écart : quelques millisecondes ici, et
    // jamais plus de deux intervalles même si le client s'acharne.
    expect(read!.readTimeMs).toBeLessThanOrEqual(HEARTBEAT_INTERVAL_MS * 2);
  });

  it("plafonne le temps crédité quel que soit le nombre d'appels", async () => {
    // Un client qui rejoue ses battements ne doit pas gonfler son temps de
    // lecture : chaque appel repositionne le point de départ.
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post(`/v1/content-read/lesson/${lessonId}/heartbeat`)
        .set("Cookie", cookie)
        .expect(200);
    }

    const read = await prisma.orm.public.LessonRead.where((row) =>
      and(row.lessonId.eq(lessonId), row.studentId.eq(studentId)),
    ).first();

    expect(read!.readTimeMs).toBeLessThan(HEARTBEAT_INTERVAL_MS);
  });

  it("marque la leçon comme terminée", async () => {
    await request(app)
      .put(`/v1/content-read/lesson/${lessonId}/finish`)
      .set("Cookie", cookie)
      .expect(200);

    const read = await prisma.orm.public.LessonRead.where((row) =>
      and(row.lessonId.eq(lessonId), row.studentId.eq(studentId)),
    ).first();

    expect(Number.isNaN(new Date(read!.finishedAt!).getTime())).toBe(false);
  });

  it("refuse un type de contenu inconnu", async () => {
    await request(app)
      .post(`/v1/content-read/parcours/${lessonId}/begin`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("refuse un battement sans session", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/heartbeat`)
      .expect(401);
  });
});
