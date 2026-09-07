import { jest } from "@jest/globals";

const moduleCount = jest.fn<() => Promise<number>>();
const skillCount = jest.fn<() => Promise<number>>();
const createMany = jest.fn<() => Promise<{ count: number }>>();
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      module: { count: moduleCount },
      bonusSkill: { count: skillCount },
      bonusSkillsOnModule: { createMany },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { $transaction: transaction },
}));

const { default: assignSkillsToModules } = await import(
  "../assign-skills-to-modules.ts"
);

describe("affectation rapide des compétences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ajoute toutes les associations demandées sans doublons", async () => {
    moduleCount.mockResolvedValue(2);
    skillCount.mockResolvedValue(2);
    createMany.mockResolvedValue({ count: 4 });

    await expect(
      assignSkillsToModules({
        parcoursId: 9,
        moduleIds: [3, 4, 4],
        skillIds: [7, 8, 8],
      }),
    ).resolves.toEqual({ count: 4 });

    expect(createMany).toHaveBeenCalledWith({
      data: [
        { moduleId: 3, bonusSkillId: 7 },
        { moduleId: 3, bonusSkillId: 8 },
        { moduleId: 4, bonusSkillId: 7 },
        { moduleId: 4, bonusSkillId: 8 },
      ],
      skipDuplicates: true,
    });
  });

  it("refuse une compétence qui n'appartient pas au parcours", async () => {
    moduleCount.mockResolvedValue(1);
    skillCount.mockResolvedValue(0);

    await expect(
      assignSkillsToModules({
        parcoursId: 9,
        moduleIds: [3],
        skillIds: [7],
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(createMany).not.toHaveBeenCalled();
  });

  it("borne les modules au périmètre du formateur", async () => {
    moduleCount.mockResolvedValue(1);
    skillCount.mockResolvedValue(1);
    createMany.mockResolvedValue({ count: 1 });

    await assignSkillsToModules(
      { parcoursId: 9, moduleIds: [3], skillIds: [7] },
      {
        kind: "teacher",
        parcoursIds: [9],
        directParcoursIds: [9],
        moduleIds: [3],
      },
    );

    expect(moduleCount).toHaveBeenCalledWith({
      where: {
        id: { in: [3] },
        parcoursId: 9,
        AND: [{ id: { in: [3] } }],
      },
    });
  });
});
