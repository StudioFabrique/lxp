import { jest } from "@jest/globals";

const moduleCount = jest.fn<() => Promise<number>>();
const deleteMany = jest.fn<() => Promise<{ count: number }>>();
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      module: { count: moduleCount },
      bonusSkillsOnModule: { deleteMany },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { $transaction: transaction },
}));

const { default: removeSkillFromModule } = await import(
  "../remove-skill-from-module.ts"
);

describe("retrait d'une compétence d'un module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("supprime uniquement l'association demandée", async () => {
    moduleCount.mockResolvedValue(1);
    deleteMany.mockResolvedValue({ count: 1 });

    await expect(
      removeSkillFromModule({ parcoursId: 9, moduleId: 3, skillId: 7 }),
    ).resolves.toEqual({ count: 1 });

    expect(deleteMany).toHaveBeenCalledWith({
      where: { moduleId: 3, bonusSkillId: 7 },
    });
  });

  it("refuse un module qui n'appartient pas au parcours", async () => {
    moduleCount.mockResolvedValue(0);

    await expect(
      removeSkillFromModule({ parcoursId: 9, moduleId: 3, skillId: 7 }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
