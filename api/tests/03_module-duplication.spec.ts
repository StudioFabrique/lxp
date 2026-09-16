import {
  requireDatabaseRow,
  whereFromObject,
} from "../src/utils/prisma-query.ts";
import mongoose from "mongoose";
import postDuplicateModule from "../src/models/module/post-duplicate-module.ts";
import { prisma } from "../src/utils/db.ts";
import User from "../src/utils/interfaces/db/user.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";

describe("flat module duplication", () => {
  let userId: string;
  let adminId: number;
  let formationId: number;
  let otherFormationId: number;
  let sourceParcoursId: number;
  let secondParcoursId: number;
  let otherFormationParcoursId: number;
  let sourceModuleId: number;

  beforeAll(async () => {
    await mongoConnect();
    const user = await User.findOne({ email: "admin@studio.eco" });
    if (!user) throw new Error("Admin Mongo fixture is missing");
    userId = user._id.toString();

    const admin = await prisma.orm.public.Admin.where((row) =>
      whereFromObject(row, { idMdb: userId }),
    ).first();
    const tag = await prisma.orm.public.Tag.first();
    if (!admin || !tag) throw new Error("Prisma fixtures are missing");
    adminId = admin.id;

    const suffix = Date.now().toString();
    const formation = await prisma.orm.public.Formation.create({
      title: `Formation duplication ${suffix}`,
      level: "test",
      adminId,
    });
    const otherFormation = await prisma.orm.public.Formation.create({
      title: `Autre formation duplication ${suffix}`,
      level: "test",
      adminId,
    });
    formationId = formation.id;
    otherFormationId = otherFormation.id;

    const [sourceParcours, secondParcours, otherParcours] = await Promise.all([
      prisma.orm.public.Parcours.create({
        title: `Parcours source ${suffix}`,
        author: "Test",
        adminId,
        formationId,
      }),
      prisma.orm.public.Parcours.create({
        title: `Parcours cible ${suffix}`,
        author: "Test",
        adminId,
        formationId,
      }),
      prisma.orm.public.Parcours.create({
        title: `Parcours autre formation ${suffix}`,
        author: "Test",
        adminId,
        formationId: otherFormationId,
      }),
    ]);
    sourceParcoursId = sourceParcours.id;
    secondParcoursId = secondParcours.id;
    otherFormationParcoursId = otherParcours.id;

    const source = await prisma.orm.public.Module.create({
      title: `Module source ${suffix}`,
      description: "Description source",
      quizInstructions: "Instructions",
      duration: 8,
      author: "Test",
      adminId,
      parcoursId: sourceParcoursId,
      courses: (relation) =>
        relation.create({
          title: "Cours indexé",
          description: "Cours source",
          dates: [],
          order: 1,
          author: "Test",
          adminId,
          courseSlug: "existing-rag-index",
          lessons: (relation) =>
            relation.create({
              title: "Leçon source",
              description: "Leçon copiée",
              modalite: "Présentiel",
              author: "Test",
              adminId,
              tagId: tag.id,
              order: 1,
            }),
        }),
      quizzes: (relation) =>
        relation.create({
          title: "Diagnostic",
          type: "preliminary",
          questions: (relation) =>
            relation.create({
              externalId: "external-source",
              type: "mcq",
              prompt: "Question source",
              tags: ["test"],
              data: { options: ["A", "B"], answerIndex: 0 },
              contentHash: `source-${suffix}`,
            }),
        }),
    });
    sourceModuleId = source.id;
  });

  afterAll(async () => {
    await prisma.orm.public.Parcours.where((row) =>
      whereFromObject(row, {
        id: {
          in: [sourceParcoursId, secondParcoursId, otherFormationParcoursId],
        },
      }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.orm.public.Formation.where((row) =>
      whereFromObject(row, { id: { in: [formationId, otherFormationId] } }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await prisma.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("creates an independent copy in the same parcours and disables course AI", async () => {
    const result = await postDuplicateModule(
      sourceModuleId,
      { contactsIds: [], skillsIds: [] },
      userId,
      sourceParcoursId,
    );

    expect(result.id).not.toBe(sourceModuleId);
    const copy = await prisma.orm.public.Module.where((row) =>
      whereFromObject(row, { id: result.id }),
    )
      .include("courses", (related62) => related62.include("lessons"))
      .include("quizzes", (related63) => related63.include("questions"))
      .first()
      .then(requireDatabaseRow);
    expect(copy.parcoursId).toBe(sourceParcoursId);
    expect(copy.courses).toHaveLength(1);
    expect(copy.courses[0].courseSlug).toBeNull();
    expect(copy.courses[0].lessons[0].title).toBe("leçon source");
    expect(copy.quizzes[0].questions[0].contentHash).toBeNull();
  });

  it("allows another parcours of the same formation", async () => {
    const result = await postDuplicateModule(
      sourceModuleId,
      { contactsIds: [], skillsIds: [] },
      userId,
      secondParcoursId,
    );
    const copy = await prisma.orm.public.Module.where((row) =>
      whereFromObject(row, { id: result.id }),
    )
      .first()
      .then(requireDatabaseRow);
    expect(copy.parcoursId).toBe(secondParcoursId);
  });

  it("rejects a target parcours from another formation", async () => {
    await expect(
      postDuplicateModule(
        sourceModuleId,
        { contactsIds: [], skillsIds: [] },
        userId,
        otherFormationParcoursId,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
