import { and } from "@prisma/orm-postgres/orm-client";

import mongoose from "mongoose";
import request from "supertest";
import { createPrismaClient } from "../src/utils/create-prisma-client.ts";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import Group from "../src/utils/interfaces/db/group.ts";
import Role from "../src/utils/interfaces/db/role.ts";
import User from "../src/utils/interfaces/db/user.ts";

const prisma = createPrismaClient();

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
  let cookieFormateur: string[];

  // Contenus du parcours auquel l'apprenant est inscrit.
  const inscrit = {
    parcoursId: 0,
    moduleId: 0,
    courseId: 0,
    lessonId: 0,
    activityId: 0,
  };
  // Contenus d'un parcours auquel il ne l'est pas.
  const etranger = {
    parcoursId: 0,
    moduleId: 0,
    courseId: 0,
    lessonId: 0,
    activityId: 0,
  };
  let moduleVisibleMaisVerrouille = 0;
  let teacherContactId = 0;
  let sharedFormationId = 0;
  let referenceTagId = 0;
  let teacherTagId = 0;
  let adminTagId = 0;
  let teacherUserId = "";

  let mongoGroupId: string;
  let pgGroupId: number;

  async function creerArborescence(
    titre: string,
    cible: typeof inscrit,
    adminId: number,
    formationId: number,
    tagId: number,
  ) {
    const parcours = await prisma.orm.public.Parcours.select("id").create({
      title: titre,
      author: "test",
      adminId,
      formationId,
      isPublished: true,
      visibility: true,
    });
    const module = await prisma.orm.public.Module.select("id").create({
      title: `${titre} module`,
      author: "test",
      adminId,
      parcoursId: parcours.id,
    });
    const course = await prisma.orm.public.Course.select("id").create({
      title: `${titre} cours`,
      author: "test",
      adminId,
      moduleId: module.id,
      order: 1,
      dates: [],
      isPublished: true,
      visibility: true,
    });
    const lesson = await prisma.orm.public.Lesson.select("id").create({
      title: `${titre} leçon`,
      description: "leçon de test",
      modalite: "async",
      order: 1,
      author: "test",
      adminId,
      courseId: course.id,
      tagId,
      visibility: true,
    });
    const activity = await prisma.orm.public.Activity.select("id").create({
      title: `${titre} activité`,
      type: "text",
      order: 1,
      url: "",
      lessonId: lesson.id,
      authorId: adminId,
    });

    cible.parcoursId = parcours.id;
    cible.moduleId = module.id;
    cible.courseId = course.id;
    cible.lessonId = lesson.id;
    cible.activityId = activity.id;
  }

  beforeAll(async () => {
    await mongoConnect();

    const [connexionApprenant, connexionAdmin, connexionFormateur] =
      await Promise.all([
        request(app)
          .post("/v1/auth/login")
          .send({ email: "apprenant@studio.eco", password: "Abcdef@123456" })
          .expect(200),
        request(app)
          .post("/v1/auth/login")
          .send({ email: "admin@studio.eco", password: "Abcdef@123456" })
          .expect(200),
        request(app)
          .post("/v1/auth/login")
          .send({ email: "formateur@studio.eco", password: "Abcdef@123456" })
          .expect(200),
      ]);
    cookieApprenant = connexionApprenant.headers[
      "set-cookie"
    ] as unknown as string[];
    cookieAdmin = connexionAdmin.headers["set-cookie"] as unknown as string[];
    cookieFormateur = connexionFormateur.headers[
      "set-cookie"
    ] as unknown as string[];

    const [admin, formation, tag] = await Promise.all([
      prisma.orm.public.Admin.select("id").first(),
      prisma.orm.public.Formation.select("id").first(),
      prisma.orm.public.Tag.select("id").first(),
    ]);
    if (!admin || !formation || !tag)
      throw new Error("Fixtures PostgreSQL incomplètes");
    sharedFormationId = formation.id;
    referenceTagId = tag.id;

    await creerArborescence(
      "Acces inscrit",
      inscrit,
      admin.id,
      formation.id,
      tag.id,
    );
    await creerArborescence(
      "Acces etranger",
      etranger,
      admin.id,
      formation.id,
      tag.id,
    );

    const teacher = await User.findOne({ email: "formateur@studio.eco" });
    if (!teacher) throw new Error("Fixture formateur absente");
    teacherUserId = teacher.id;
    const teacherContact = await prisma.orm.public.Contact.where({
      idMdb: teacher.id,
    })
      .select("id")
      .upsert({
        create: { idMdb: teacher.id, role: "teacher", email: teacher.email },
        update: {},
        conflictOn: { idMdb: teacher.id },
      });
    teacherContactId = teacherContact.id;
    await prisma.orm.public.ContactsOnModule.create({
      contactId: teacherContact.id,
      moduleId: inscrit.moduleId,
    });
    // Une affectation au cours ne doit plus ouvrir son module ou son parcours.
    await prisma.orm.public.ContactsOnCourse.create({
      contactId: teacherContact.id,
      courseId: etranger.courseId,
    });
    moduleVisibleMaisVerrouille = (
      await prisma.orm.public.Module.select("id").create({
        title: "Module visible mais verrouillé",
        author: "test",
        adminId: admin.id,
        parcoursId: inscrit.parcoursId,
      })
    ).id;

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

    const groupePg = await prisma.orm.public.Group.select("id").create({
      idMdb: mongoGroupId,
    });
    pgGroupId = groupePg.id;
    await prisma.orm.public.GroupsOnParcours.create({
      groupId: pgGroupId,
      parcoursId: inscrit.parcoursId,
    });
  });

  afterAll(async () => {
    const temporaryTagIds = [teacherTagId, adminTagId].filter(Boolean);
    if (temporaryTagIds.length > 0) {
      await prisma.orm.public.TagsOnParcours.where((row) =>
        row.tagId.in(temporaryTagIds),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.TagsOnFormation.where((row) =>
        row.tagId.in(temporaryTagIds),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.Tag.where((row) => row.id.in(temporaryTagIds))
        .deleteAndCount()
        .then((count) => ({ count }));
    }
    await prisma.orm.public.ContactsOnParcours.where((row) =>
      and(
        row.contactId.eq(teacherContactId),
        row.parcoursId.in([inscrit.parcoursId, etranger.parcoursId]),
      ),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.ContactsOnCourse.where({
      contactId: teacherContactId,
      courseId: etranger.courseId,
    })
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.ContactsOnModule.where({
      contactId: teacherContactId,
      moduleId: inscrit.moduleId,
    })
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.Module.where({ id: moduleVisibleMaisVerrouille })
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.GroupsOnParcours.where({ groupId: pgGroupId })
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.Group.where({ id: pgGroupId })
      .deleteAndCount()
      .then((count) => ({ count }));
    await Group.deleteOne({ _id: mongoGroupId });
    for (const cible of [inscrit, etranger]) {
      await prisma.orm.public.Activity.where({ id: cible.activityId })
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.Lesson.where({ id: cible.lessonId })
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.Course.where({ id: cible.courseId })
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.Module.where({ id: cible.moduleId })
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.TagsOnParcours.where({
        parcoursId: cible.parcoursId,
      })
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.Parcours.where({ id: cible.parcoursId })
        .deleteAndCount()
        .then((count) => ({ count }));
    }
    await prisma.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  describe("un apprenant atteint les contenus de son parcours", () => {
    it("la leçon", async () => {
      await request(app)
        .get(`/v1/lesson/${inscrit.lessonId}`)
        .set("Cookie", cookieApprenant)
        .expect(200);
    });

    it("les activités, servies avec le détail de la leçon", async () => {
      // Un apprenant n'a pas `read:activity` : il ne consomme jamais
      // `/v1/activity/:id` directement, les activités lui arrivent incluses
      // dans la réponse de la leçon.
      const reponse = await request(app)
        .get(`/v1/lesson/${inscrit.lessonId}`)
        .set("Cookie", cookieApprenant)
        .expect(200);

      expect(
        reponse.body.activities.map((a: { id: number }) => a.id),
      ).toContain(inscrit.activityId);
    });

    it("le module", async () => {
      await request(app)
        .get(`/v1/modules/detail/limited/${inscrit.moduleId}`)
        .set("Cookie", cookieApprenant)
        .expect(200);
    });

    it("refuse le contenu dès qu'une leçon de la chaîne est masquée", async () => {
      await prisma.orm.public.Lesson.where({ id: inscrit.lessonId }).update({
        visibility: false,
      });
      try {
        await request(app)
          .get(`/v1/lesson/${inscrit.lessonId}`)
          .set("Cookie", cookieApprenant)
          .expect(404);
      } finally {
        await prisma.orm.public.Lesson.where({ id: inscrit.lessonId }).update({
          visibility: true,
        });
      }
    });

    it("refuse le contenu dès que son parcours est masqué", async () => {
      await prisma.orm.public.Parcours.where({ id: inscrit.parcoursId }).update({
        visibility: false,
      });
      try {
        await request(app)
          .get(`/v1/lesson/${inscrit.lessonId}`)
          .set("Cookie", cookieApprenant)
          .expect(404);
      } finally {
        await prisma.orm.public.Parcours.where({ id: inscrit.parcoursId }).update({
          visibility: true,
        });
      }
    });
  });

  describe("un apprenant ne peut pas atteindre les contenus d'un autre parcours", () => {
    it("la leçon répond 404 plutôt que 403, pour ne pas confirmer l'existence de l'identifiant", async () => {
      await request(app)
        .get(`/v1/lesson/${etranger.lessonId}`)
        .set("Cookie", cookieApprenant)
        .expect(404);
    });

    it("l'accès direct à une activité reste fermé aux apprenants", async () => {
      // Refus au niveau de la permission, avant même le cloisonnement : la
      // garde d'appartenance posée sur cette route couvre le cas d'un rôle
      // personnalisé auquel `read:activity` aurait été accordé.
      await request(app)
        .get(`/v1/activity/${etranger.activityId}`)
        .set("Cookie", cookieApprenant)
        .expect(403);
    });

    it("le module", async () => {
      await request(app)
        .get(`/v1/modules/detail/limited/${etranger.moduleId}`)
        .set("Cookie", cookieApprenant)
        .expect(404);
    });

    it("les modules listés par parcours", async () => {
      await request(app)
        .get(`/v1/modules/${etranger.parcoursId}`)
        .set("Cookie", cookieApprenant)
        .expect(404);
    });

    it("le suivi de consultation ne peut pas être ouvert", async () => {
      await request(app)
        .post(`/v1/content-read/lesson/${etranger.lessonId}/begin`)
        .set("Cookie", cookieApprenant)
        .expect(404);
    });
  });

  describe("un encadrant n'est pas restreint", () => {
    it("l'administrateur atteint la leçon d'un parcours où il n'est pas inscrit", async () => {
      await request(app)
        .get(`/v1/lesson/${etranger.lessonId}`)
        .set("Cookie", cookieAdmin)
        .expect(200);
    });
  });

  describe("un formateur est borné à ses affectations directes aux parcours", () => {
    it("ne peut ni créer ni modifier une formation, ni créer un parcours", async () => {
      await request(app)
        .post("/v1/formation")
        .set("Cookie", cookieFormateur)
        .send({})
        .expect(403);
      await request(app)
        .put(`/v1/formation/${sharedFormationId}`)
        .set("Cookie", cookieFormateur)
        .send({})
        .expect(403);
      await request(app)
        .post("/v1/parcours")
        .set("Cookie", cookieFormateur)
        .send({})
        .expect(403);
    });

    it("ne peut pas gérer la publication d'un parcours", async () => {
      await request(app)
        .put(`/v1/parcours/publish/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .send({ isPublished: false })
        .expect(403);
    });

    it("une affectation au module seule n'affiche jamais son parcours", async () => {
      const liste = await request(app)
        .get("/v1/parcours")
        .set("Cookie", cookieFormateur)
        .expect(200);

      expect(
        liste.body.map((parcours: { id: number }) => parcours.id),
      ).not.toContain(inscrit.parcoursId);

      const dashboard = await request(app)
        .get("/v1/parcours/root-parcours")
        .set("Cookie", cookieFormateur)
        .expect(200);
      expect(
        dashboard.body.flatMap(
          (formation: { parcours: Array<{ id: number }> }) =>
            formation.parcours.map(({ id }) => id),
        ),
      ).not.toContain(inscrit.parcoursId);
    });

    it("ne peut pas ouvrir le parcours parent de son module", async () => {
      await request(app)
        .get(`/v1/parcours/parcours-by-id/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .expect(404);

      await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .send({ description: "Modification interdite" })
        .expect(404);
    });

    it("ne peut pas contourner l'affectation au parcours via le module", async () => {
      await request(app)
        .get(`/v1/modules/detail/${inscrit.moduleId}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
      await request(app)
        .get(`/v1/course/${inscrit.moduleId}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
    });

    it("ne peut ni ouvrir ni modifier un module seulement visible", async () => {
      await request(app)
        .get(`/v1/modules/detail/${moduleVisibleMaisVerrouille}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
      await request(app)
        .delete(`/v1/modules/${moduleVisibleMaisVerrouille}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
    });

    it("une affectation directe au cours n'ouvre pas le parcours ni le module", async () => {
      await request(app)
        .get(`/v1/parcours/parcours-by-id/${etranger.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
      await request(app)
        .get(`/v1/course/${etranger.moduleId}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
    });

    it("l'affectation au parcours n'ouvre que les modules affectés, puis sa suppression révoque tout accès", async () => {
      await prisma.orm.public.ContactsOnParcours.create({
        contactId: teacherContactId,
        parcoursId: inscrit.parcoursId,
      });

      const listeAvantSuppression = await request(app)
        .get("/v1/parcours")
        .set("Cookie", cookieFormateur)
        .expect(200);
      expect(
        listeAvantSuppression.body.map(
          (parcours: { id: number }) => parcours.id,
        ),
      ).toContain(inscrit.parcoursId);

      const modulesDuParcours = await request(app)
        .get(`/v1/modules/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .expect(200);
      const moduleIds = modulesDuParcours.body.modules.map(
        (module: { id: number }) => module.id,
      );
      expect(moduleIds).toContain(inscrit.moduleId);
      expect(moduleIds).not.toContain(moduleVisibleMaisVerrouille);

      const creationTag = await request(app)
        .post("/v1/tag")
        .set("Cookie", cookieFormateur)
        .send({
          tags: [
            {
              name: `Tag formateur parcours ${inscrit.parcoursId}`,
              color: "rgba(18, 52, 86, 0.5)",
            },
          ],
        })
        .expect(201);
      teacherTagId = creationTag.body[0].id;

      await expect(
        prisma.orm.public.Tag.where({ id: teacherTagId })
          .select("createdBy")
          .first(),
      ).resolves.toEqual({ createdBy: teacherUserId });

      await request(app)
        .put(`/v1/tag/${teacherTagId}`)
        .set("Cookie", cookieFormateur)
        .send({ name: `Tag formateur modifie ${inscrit.parcoursId}` })
        .expect(201);

      await request(app)
        .put(`/v1/tag/${teacherTagId}`)
        .set("Cookie", cookieAdmin)
        .send({ name: `Tag formateur corrige ${inscrit.parcoursId}` })
        .expect(201);

      await expect(
        prisma.orm.public.Tag.where({ id: teacherTagId })
          .select("createdBy")
          .first(),
      ).resolves.toEqual({ createdBy: teacherUserId });

      await request(app)
        .put(`/v1/tag/${referenceTagId}`)
        .set("Cookie", cookieFormateur)
        .send({ name: "Modification tag administrateur interdite" })
        .expect(403);

      const creationTagAdmin = await request(app)
        .post("/v1/tag")
        .set("Cookie", cookieAdmin)
        .send({
          tags: [
            {
              name: `Tag administrateur parcours ${inscrit.parcoursId}`,
              color: "rgba(86, 52, 18, 0.5)",
            },
          ],
        })
        .expect(201);
      adminTagId = creationTagAdmin.body[0].id;

      await expect(
        prisma.orm.public.Tag.where({ id: adminTagId })
          .select("createdBy")
          .first(),
      ).resolves.toEqual({ createdBy: null });

      await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieAdmin)
        .send({ tagIds: [referenceTagId] })
        .expect(200);

      await prisma.orm.public.TagsOnParcours.create({
        parcoursId: inscrit.parcoursId,
        tagId: adminTagId,
        addedBy: "other-teacher-id",
      });

      const associationParFormateur = await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .send({ tagIds: [referenceTagId, teacherTagId, adminTagId] })
        .expect(200);

      const tagsParId = new Map<number, { id: number; canUnassign: boolean }>(
        associationParFormateur.body.parcours.tags.map(
          (tag: {
            id: number;
            canUnassign: boolean;
          }): [number, { id: number; canUnassign: boolean }] => [tag.id, tag],
        ),
      );
      expect(tagsParId.get(referenceTagId)?.canUnassign).toBe(false);
      expect(tagsParId.get(adminTagId)?.canUnassign).toBe(false);
      expect(tagsParId.get(teacherTagId)?.canUnassign).toBe(true);

      await expect(
        prisma.orm.public.TagsOnParcours.where((row) =>
          and(
            row.parcoursId.eq(inscrit.parcoursId),
            row.tagId.in([referenceTagId, teacherTagId, adminTagId]),
          ),
        )
          .aggregate((aggregate) => ({ total: aggregate.count() }))
          .then(({ total }) => total),
      ).resolves.toBe(3);

      await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .send({ tagIds: [teacherTagId] })
        .expect(403);

      await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .send({ tagIds: [referenceTagId, adminTagId] })
        .expect(200);

      await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .send({ description: "Modification interdite" })
        .expect(403);

      await request(app)
        .get(`/v1/modules/detail/${inscrit.moduleId}`)
        .set("Cookie", cookieFormateur)
        .expect(200);
      await request(app)
        .get(`/v1/modules/detail/${moduleVisibleMaisVerrouille}`)
        .set("Cookie", cookieFormateur)
        .expect(404);

      await request(app)
        .patch(`/v1/parcours/${inscrit.parcoursId}`)
        .set("Cookie", cookieAdmin)
        .send({ contactIds: [] })
        .expect(200);

      await expect(
        prisma.orm.public.ContactsOnModule.where((row) =>
          and(
            row.contactId.eq(teacherContactId),
            row.moduleId.eq(inscrit.moduleId),
          ),
        ).first(),
      ).resolves.toBeNull();

      // Simule une donnée incohérente laissée par un bug ou une ancienne
      // version : ce rattachement orphelin ne doit jamais rouvrir le parcours.
      await prisma.orm.public.ContactsOnModule.create({
        contactId: teacherContactId,
        moduleId: inscrit.moduleId,
      });

      const liste = await request(app)
        .get("/v1/parcours")
        .set("Cookie", cookieFormateur)
        .expect(200);
      expect(
        liste.body.map((parcours: { id: number }) => parcours.id),
      ).not.toContain(inscrit.parcoursId);

      const dashboard = await request(app)
        .get("/v1/parcours/root-parcours")
        .set("Cookie", cookieFormateur)
        .expect(200);
      expect(
        dashboard.body.flatMap(
          (formation: { parcours: Array<{ id: number }> }) =>
            formation.parcours.map(({ id }) => id),
        ),
      ).not.toContain(inscrit.parcoursId);

      await request(app)
        .get(`/v1/parcours/parcours-by-id/${inscrit.parcoursId}`)
        .set("Cookie", cookieFormateur)
        .expect(404);
    });
  });
});
