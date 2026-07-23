import mongoose from "mongoose";
import postDuplicateModule from "../src/models/module/post-duplicate-module";
import { prisma } from "../src/utils/db";
import User from "../src/utils/interfaces/db/user";
import mongoConnect from "../src/utils/services/db/mongo-connect";

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

    const admin = await prisma.admin.findFirst({ where: { idMdb: userId } });
    const tag = await prisma.tag.findFirst();
    if (!admin || !tag) throw new Error("Prisma fixtures are missing");
    adminId = admin.id;

    const suffix = Date.now().toString();
    const formation = await prisma.formation.create({
      data: {
        title: `Formation duplication ${suffix}`,
        level: "test",
        adminId,
      },
    });
    const otherFormation = await prisma.formation.create({
      data: {
        title: `Autre formation duplication ${suffix}`,
        level: "test",
        adminId,
      },
    });
    formationId = formation.id;
    otherFormationId = otherFormation.id;

    const [sourceParcours, secondParcours, otherParcours] = await Promise.all([
      prisma.parcours.create({
        data: {
          title: `Parcours source ${suffix}`,
          author: "Test",
          adminId,
          formationId,
        },
      }),
      prisma.parcours.create({
        data: {
          title: `Parcours cible ${suffix}`,
          author: "Test",
          adminId,
          formationId,
        },
      }),
      prisma.parcours.create({
        data: {
          title: `Parcours autre formation ${suffix}`,
          author: "Test",
          adminId,
          formationId: otherFormationId,
        },
      }),
    ]);
    sourceParcoursId = sourceParcours.id;
    secondParcoursId = secondParcours.id;
    otherFormationParcoursId = otherParcours.id;

    const source = await prisma.module.create({
      data: {
        title: `Module source ${suffix}`,
        description: "Description source",
        quizInstructions: "Instructions",
        duration: 8,
        author: "Test",
        adminId,
        parcoursId: sourceParcoursId,
        courses: {
          create: {
            title: "Cours indexé",
            description: "Cours source",
            dates: [],
            order: 1,
            author: "Test",
            adminId,
            courseSlug: "existing-rag-index",
            lessons: {
              create: {
                title: "Leçon source",
                description: "Leçon copiée",
                modalite: "Présentiel",
                author: "Test",
                adminId,
                tagId: tag.id,
                order: 1,
              },
            },
          },
        },
        quizzes: {
          create: {
            title: "Diagnostic",
            type: "preliminary",
            questions: {
              create: {
                externalId: "external-source",
                type: "mcq",
                prompt: "Question source",
                tags: ["test"],
                data: { options: ["A", "B"], answerIndex: 0 },
                contentHash: `source-${suffix}`,
              },
            },
          },
        },
      },
    });
    sourceModuleId = source.id;
  });

  afterAll(async () => {
    await prisma.parcours.deleteMany({
      where: {
        id: {
          in: [
            sourceParcoursId,
            secondParcoursId,
            otherFormationParcoursId,
          ],
        },
      },
    });
    await prisma.formation.deleteMany({
      where: { id: { in: [formationId, otherFormationId] } },
    });
    await prisma.$disconnect();
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
    const copy = await prisma.module.findUniqueOrThrow({
      where: { id: result.id },
      include: {
        courses: { include: { lessons: true } },
        quizzes: { include: { questions: true } },
      },
    });
    expect(copy.parcoursId).toBe(sourceParcoursId);
    expect(copy.courses).toHaveLength(1);
    expect(copy.courses[0].courseSlug).toBeNull();
    expect(copy.courses[0].lessons[0].title).toBe("Leçon source");
    expect(copy.quizzes[0].questions[0].contentHash).toBeNull();
  });

  it("allows another parcours of the same formation", async () => {
    const result = await postDuplicateModule(
      sourceModuleId,
      { contactsIds: [], skillsIds: [] },
      userId,
      secondParcoursId,
    );
    const copy = await prisma.module.findUniqueOrThrow({
      where: { id: result.id },
    });
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
