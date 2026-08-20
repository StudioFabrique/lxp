import mongoose from "mongoose";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import { HEARTBEAT_INTERVAL_MS } from "../src/config/content-read.ts";
import { type Enrollment, enrollStudentInParcours } from "./utils/enroll-student.ts";

const prisma = new PrismaClient();

/**
 * Aller-retour complet du suivi de consultation : sans lui, l'indicateur
 * `time_on_content` reste indisponible quoi qu'il arrive.
 */
describe("Suivi de consultation des contenus", () => {
  let cookie: string[];
  let studentId: number;
  let lessonId: number;
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
    const student = await prisma.student.upsert({
      where: { idMdb: userIdMdb },
      update: {},
      create: { idMdb: userIdMdb },
    });
    studentId = student.id;

    const [course, admin, tag] = await Promise.all([
      prisma.course.findFirst({
        select: { id: true, module: { select: { parcoursId: true } } },
      }),
      prisma.admin.findFirst({ select: { id: true } }),
      prisma.tag.findFirst({ select: { id: true } }),
    ]);

    // Les contenus sont cloisonnés par parcours : sans inscription, l'apprenant
    // reçoit 404 sur la leçon qu'il est censé consulter.
    enrollment = await enrollStudentInParcours(
      userIdMdb,
      course!.module.parcoursId,
    );

    const lesson = await prisma.lesson.create({
      data: {
        title: "Leçon de suivi",
        description: "Leçon créée par les tests de suivi de consultation.",
        modalite: "async",
        order: 999,
        author: "test",
        courseId: course!.id,
        adminId: admin!.id,
        tagId: tag!.id,
      },
      select: { id: true },
    });
    lessonId = lesson.id;
  });

  afterAll(async () => {
    // On ne supprime que ce que ce fichier a créé : la fiche Student est
    // partagée avec les autres specs et référencée par leurs accomplissements.
    await prisma.lessonRead.deleteMany({ where: { lessonId } });
    await prisma.lesson.delete({ where: { id: lessonId } });
    await enrollment.cleanup();
    await prisma.$disconnect();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("ouvre le suivi d'une leçon", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/begin`)
      .set("Cookie", cookie)
      .expect(201);

    const read = await prisma.lessonRead.findUnique({
      where: { lessonId_studentId: { lessonId, studentId } },
    });

    expect(read).not.toBeNull();
    expect(read!.readTimeMs).toBe(0);
    expect(read!.finishedAt).toBeNull();
  });

  it("ne crée pas de second suivi pour la même leçon", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/begin`)
      .set("Cookie", cookie)
      .expect(201);

    expect(await prisma.lessonRead.count({ where: { lessonId } })).toBe(1);
  });

  it("crédite un temps borné à chaque battement", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonId}/heartbeat`)
      .set("Cookie", cookie)
      .expect(200);

    const read = await prisma.lessonRead.findUnique({
      where: { lessonId_studentId: { lessonId, studentId } },
    });

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

    const read = await prisma.lessonRead.findUnique({
      where: { lessonId_studentId: { lessonId, studentId } },
    });

    expect(read!.readTimeMs).toBeLessThan(HEARTBEAT_INTERVAL_MS);
  });

  it("marque la leçon comme terminée", async () => {
    await request(app)
      .put(`/v1/content-read/lesson/${lessonId}/finish`)
      .set("Cookie", cookie)
      .expect(200);

    const read = await prisma.lessonRead.findUnique({
      where: { lessonId_studentId: { lessonId, studentId } },
    });

    expect(read!.finishedAt).toBeInstanceOf(Date);
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
