import { jest } from "@jest/globals";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";

const moduleCount = jest.fn<() => Promise<{ total: number }>>();
const deleteMany = jest.fn<() => Promise<number>>();
const moduleModel = createModelMock(
  { aggregate: moduleCount },
  { evaluateWhere: true },
);
const associationModel = createModelMock(
  { deleteAndCount: deleteMany },
  { evaluateWhere: true },
);
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      orm: {
        public: {
          Module: moduleModel,
          BonusSkillsOnModule: associationModel,
        },
      },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { transaction },
}));

const { default: removeSkillFromModule } =
  await import("../remove-skill-from-module.ts");

describe("retrait d'une compétence d'un module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("supprime uniquement l'association demandée", async () => {
    moduleCount.mockResolvedValue({ total: 1 });
    deleteMany.mockResolvedValue(1);

    await expect(
      removeSkillFromModule({ parcoursId: 9, moduleId: 3, skillId: 7 }),
    ).resolves.toEqual({ count: 1 });
  });

  it("refuse un module qui n'appartient pas au parcours", async () => {
    moduleCount.mockResolvedValue({ total: 0 });

    await expect(
      removeSkillFromModule({ parcoursId: 9, moduleId: 3, skillId: 7 }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
