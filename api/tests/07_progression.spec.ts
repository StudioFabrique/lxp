import mongoose from "mongoose";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import { type Enrollment, enrollStudentInParcours } from "./utils/enroll-student.ts";

const prisma = new PrismaClient();

/**
 * La progression est calculée à un seul endroit
 * (`src/helpers/calculate-module-progress.ts`) et transportée par les payloads
 * que le front consomme déjà. Ce test verrouille ce contrat : sans lui, rien
 * n'empêche une vue de se remettre à calculer son propre pourcentage.
 */
describe("Progression servie par l'API", () => {
  let cookie: string[];
  let moduleId: number;
  let courseId: number;
  let lessonIds: number[] = [];
  let enrollment: Enrollment;

  // Le contrôleur enveloppe la charge utile dans `data`, comme le lit le front.
  const fetchModule = async () => {
    const response = await request(app)
      .get(`/v1/modules/detail/limited/${moduleId}`)
      .set("Cookie", cookie)
      .expect(200);

    return response.body.data;
  };

  beforeAll(async () => {
    await mongoConnect();

    const login = await request(app)
      .post("/v1/auth/login")
      .send({ email: "apprenant@studio.eco", password: "Abcdef@123456" })
      .expect(200);

    cookie = login.headers["set-cookie"] as unknown as string[];
    const userIdMdb = login.body._id as string;

    await prisma.student.upsert({
      where: { idMdb: userIdMdb },
      update: {},
      create: { idMdb: userIdMdb },
    });

    const [module, admin, tag] = await Promise.all([
      prisma.module.findFirst({ select: { id: true, parcoursId: true } }),
      prisma.admin.findFirst({ select: { id: true } }),
      prisma.tag.findFirst({ select: { id: true } }),
    ]);
    moduleId = module!.id;

    // Les contenus sont cloisonnés par parcours : sans inscription, l'apprenant
    // reçoit 404 sur son propre module.
    enrollment = await enrollStudentInParcours(userIdMdb, module!.parcoursId);

    const course = await prisma.course.create({
      data: {
        title: "Cours de progression",
        order: 999,
        author: "test",
        adminId: admin!.id,
        moduleId,
        isPublished: true,
        visibility: true,
      },
      select: { id: true },
    });
    courseId = course.id;

    // Quatre leçons : un quart terminé doit donner 25 %, pas un arrondi flou.
    for (let index = 0; index < 4; index++) {
      const lesson = await prisma.lesson.create({
        data: {
          title: `Leçon ${index + 1}`,
          description: "Leçon créée par les tests de progression.",
          modalite: "async",
          order: index,
          author: "test",
          courseId,
          adminId: admin!.id,
          tagId: tag!.id,
          isPublished: true,
          visibility: true,
        },
        select: { id: true },
      });
      lessonIds.push(lesson.id);
    }
  });

  afterAll(async () => {
    await prisma.lessonRead.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
    await prisma.course.delete({ where: { id: courseId } });
    await enrollment.cleanup();
    await prisma.$disconnect();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("expose la progression du module et de chaque cours", async () => {
    const module = await fetchModule();

    expect(typeof module.stats?.progress).toBe("number");
    for (const course of module.courses) {
      expect(typeof course.stats?.progress).toBe("number");
    }
  });

  it("part de zéro tant qu'aucune leçon n'est terminée", async () => {
    const module = await fetchModule();
    const course = module.courses.find((item: any) => item.id === courseId);

    expect(course.stats.progress).toBe(0);
  });

  it("reflète une leçon terminée sur les quatre", async () => {
    await request(app)
      .post(`/v1/content-read/lesson/${lessonIds[0]}/begin`)
      .set("Cookie", cookie)
      .expect(201);

    await request(app)
      .put(`/v1/content-read/lesson/${lessonIds[0]}/finish`)
      .set("Cookie", cookie)
      .expect(200);

    const module = await fetchModule();
    const course = module.courses.find((item: any) => item.id === courseId);

    expect(course.stats.progress).toBe(25);
  });

  it("atteint 100 % quand toutes les leçons du cours sont terminées", async () => {
    for (const lessonId of lessonIds.slice(1)) {
      await request(app)
        .post(`/v1/content-read/lesson/${lessonId}/begin`)
        .set("Cookie", cookie)
        .expect(201);
      await request(app)
        .put(`/v1/content-read/lesson/${lessonId}/finish`)
        .set("Cookie", cookie)
        .expect(200);
    }

    const module = await fetchModule();
    const course = module.courses.find((item: any) => item.id === courseId);

    expect(course.stats.progress).toBe(100);
  });

  it("pondère la progression du module par leçon et non par cours", async () => {
    // Le cours créé ici est intégralement terminé. Si le module valait la
    // moyenne des cours, un module n'ayant que ce cours publié afficherait
    // 100 % alors que ses autres leçons restent à faire.
    const module = await fetchModule();
    const courses = module.courses as Array<{
      lessons: Array<{ lessonsRead: Array<{ finishedAt: string | null }> }>;
    }>;

    const total = courses.reduce((sum, course) => sum + course.lessons.length, 0);
    const completed = courses.reduce(
      (sum, course) =>
        sum +
        course.lessons.filter((lesson) =>
          lesson.lessonsRead?.some((read) => read.finishedAt),
        ).length,
      0,
    );

    expect(module.stats.progress).toBe(
      Math.round((completed / total) * 100),
    );
  });
});
