import mongoose from "mongoose";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import Group from "../src/utils/interfaces/db/group.ts";
import Role from "../src/utils/interfaces/db/role.ts";
import User from "../src/utils/interfaces/db/user.ts";

const prisma = new PrismaClient();

/**
 * Cloisonnement des contenus entre parcours.
 *
 * Les permissions CASL répondent « cet utilisateur peut-il lire des leçons ? »,
 * jamais « peut-il lire *cette* leçon ? ». Sans cloisonnement, un apprenant
 * muni d'une session valide parcourt tout le catalogue en incrémentant
 * l'identifiant de l'URL. Ces cas verrouillent ce comportement.
 */
describe("Cloisonnement des contenus par parcours", () => {
  let cookieApprenant: string[];
  let cookieAdmin: string[];

  // Contenus du parcours auquel l'apprenant est inscrit.
  const inscrit = { parcoursId: 0, moduleId: 0, courseId: 0, lessonId: 0, activityId: 0 };
  // Contenus d'un parcours auquel il ne l'est pas.
  const etranger = { parcoursId: 0, moduleId: 0, courseId: 0, lessonId: 0, activityId: 0 };

  let mongoGroupId: string;
  let pgGroupId: number;

  async function creerArborescence(
    titre: string,
    cible: typeof inscrit,
    adminId: number,
    formationId: number,
    tagId: number,
  ) {
    const parcours = await prisma.parcours.create({
      data: { title: titre, author: "test", adminId, formationId, isPublished: true },
      select: { id: true },
    });
    const module = await prisma.module.create({
      data: { title: `${titre} module`, author: "test", adminId, parcoursId: parcours.id },
      select: { id: true },
    });
    const course = await prisma.course.create({
      data: {
        title: `${titre} cours`, author: "test", adminId, moduleId: module.id,
        order: 1, dates: [],
      },
      select: { id: true },
    });
    const lesson = await prisma.lesson.create({
      data: {
        title: `${titre} leçon`, description: "leçon de test", modalite: "async",
        order: 1, author: "test", adminId, courseId: course.id, tagId,
      },
      select: { id: true },
    });
    const activity = await prisma.activity.create({
      data: { title: `${titre} activité`, type: "text", order: 1, url: "", lessonId: lesson.id, authorId: adminId },
      select: { id: true },
    });

    cible.parcoursId = parcours.id;
    cible.moduleId = module.id;
    cible.courseId = course.id;
    cible.lessonId = lesson.id;
    cible.activityId = activity.id;
  }

  beforeAll(async () => {
    await mongoConnect();

    const [connexionApprenant, connexionAdmin] = await Promise.all([
      request(app).post("/v1/auth/login")
        .send({ email: "apprenant@studio.eco", password: "Abcdef@123456" }).expect(200),
      request(app).post("/v1/auth/login")
        .send({ email: "admin@studio.eco", password: "Abcdef@123456" }).expect(200),
    ]);
    cookieApprenant = connexionApprenant.headers["set-cookie"] as unknown as string[];
    cookieAdmin = connexionAdmin.headers["set-cookie"] as unknown as string[];

    const [admin, formation, tag] = await Promise.all([
      prisma.admin.findFirst({ select: { id: true } }),
      prisma.formation.findFirst({ select: { id: true } }),
      prisma.tag.findFirst({ select: { id: true } }),
    ]);
    if (!admin || !formation || !tag) throw new Error("Fixtures PostgreSQL incomplètes");

    await creerArborescence("Acces inscrit", inscrit, admin.id, formation.id, tag.id);
    await creerArborescence("Acces etranger", etranger, admin.id, formation.id, tag.id);

    // Rattachement de l'apprenant au seul premier parcours : groupe côté Mongo
    // (appartenance des utilisateurs) puis miroir côté PostgreSQL (rattachement
    // au parcours), les deux reliés par `idMdb`.
    const roleEtudiant = await Role.findOne({ role: "student" });
    const groupe = await Group.create({
      name: "Groupe test cloisonnement",
      users: [(await User.findOne({ email: "apprenant@studio.eco" }))!._id],
      roles: [roleEtudiant!._id],
      isActive: true,
    });
    mongoGroupId = groupe.id as string;

    const groupePg = await prisma.group.create({
      data: { idMdb: mongoGroupId },
      select: { id: true },
    });
    pgGroupId = groupePg.id;
    await prisma.groupsOnParcours.create({
      data: { groupId: pgGroupId, parcoursId: inscrit.parcoursId },
    });
  });

  afterAll(async () => {
    await prisma.groupsOnParcours.deleteMany({ where: { groupId: pgGroupId } });
    await prisma.group.deleteMany({ where: { id: pgGroupId } });
    await Group.deleteOne({ _id: mongoGroupId });
    for (const cible of [inscrit, etranger]) {
      await prisma.activity.deleteMany({ where: { id: cible.activityId } });
      await prisma.lesson.deleteMany({ where: { id: cible.lessonId } });
      await prisma.course.deleteMany({ where: { id: cible.courseId } });
      await prisma.module.deleteMany({ where: { id: cible.moduleId } });
      await prisma.parcours.deleteMany({ where: { id: cible.parcoursId } });
    }
    await prisma.$disconnect();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  describe("un apprenant atteint les contenus de son parcours", () => {
    it("la leçon", async () => {
      await request(app).get(`/v1/lesson/${inscrit.lessonId}`)
        .set("Cookie", cookieApprenant).expect(200);
    });

    it("les activités, servies avec le détail de la leçon", async () => {
      // Un apprenant n'a pas `read:activity` : il ne consomme jamais
      // `/v1/activity/:id` directement, les activités lui arrivent incluses
      // dans la réponse de la leçon.
      const reponse = await request(app).get(`/v1/lesson/${inscrit.lessonId}`)
        .set("Cookie", cookieApprenant).expect(200);

      expect(reponse.body.activities.map((a: { id: number }) => a.id))
        .toContain(inscrit.activityId);
    });

    it("le module", async () => {
      await request(app).get(`/v1/modules/detail/limited/${inscrit.moduleId}`)
        .set("Cookie", cookieApprenant).expect(200);
    });
  });

  describe("un apprenant ne peut pas atteindre les contenus d'un autre parcours", () => {
    it("la leçon répond 404 plutôt que 403, pour ne pas confirmer l'existence de l'identifiant", async () => {
      await request(app).get(`/v1/lesson/${etranger.lessonId}`)
        .set("Cookie", cookieApprenant).expect(404);
    });

    it("l'accès direct à une activité reste fermé aux apprenants", async () => {
      // Refus au niveau de la permission, avant même le cloisonnement : la
      // garde d'appartenance posée sur cette route couvre le cas d'un rôle
      // personnalisé auquel `read:activity` aurait été accordé.
      await request(app).get(`/v1/activity/${etranger.activityId}`)
        .set("Cookie", cookieApprenant).expect(403);
    });

    it("le module", async () => {
      await request(app).get(`/v1/modules/detail/limited/${etranger.moduleId}`)
        .set("Cookie", cookieApprenant).expect(404);
    });

    it("les modules listés par parcours", async () => {
      await request(app).get(`/v1/modules/${etranger.parcoursId}`)
        .set("Cookie", cookieApprenant).expect(404);
    });

    it("le suivi de consultation ne peut pas être ouvert", async () => {
      await request(app).post(`/v1/content-read/lesson/${etranger.lessonId}/begin`)
        .set("Cookie", cookieApprenant).expect(404);
    });
  });

  describe("la liste des leçons est bornée au périmètre de l'appelant", () => {
    it("l'apprenant ne voit que les leçons de ses parcours", async () => {
      const reponse = await request(app).get("/v1/lesson")
        .set("Cookie", cookieApprenant).expect(200);

      const identifiants = reponse.body.lessons.map((lesson: { id: number }) => lesson.id);
      expect(identifiants).toContain(inscrit.lessonId);
      expect(identifiants).not.toContain(etranger.lessonId);
    });

    it("un administrateur voit l'ensemble du catalogue", async () => {
      const reponse = await request(app).get("/v1/lesson")
        .set("Cookie", cookieAdmin).expect(200);

      const identifiants = reponse.body.lessons.map((lesson: { id: number }) => lesson.id);
      expect(identifiants).toContain(inscrit.lessonId);
      expect(identifiants).toContain(etranger.lessonId);
    });
  });

  describe("un encadrant n'est pas restreint", () => {
    it("l'administrateur atteint la leçon d'un parcours où il n'est pas inscrit", async () => {
      await request(app).get(`/v1/lesson/${etranger.lessonId}`)
        .set("Cookie", cookieAdmin).expect(200);
    });
  });
});
