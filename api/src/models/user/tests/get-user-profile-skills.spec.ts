import { jest } from "@jest/globals";

const findMany = jest.fn<() => Promise<unknown[]>>();
const getAccessibleParcoursIds = jest.fn<() => Promise<number[]>>();

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { bonusSkill: { findMany } },
}));

jest.unstable_mockModule(
  "../../../utils/services/permissions/accessible-parcours.ts",
  () => ({ getAccessibleParcoursIds }),
);

const { default: getUserProfileSkills } = await import(
  "../get-user-profile-skills.ts"
);

describe("badges de compétences du profil apprenant", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ne cherche aucun badge sans parcours accessible", async () => {
    getAccessibleParcoursIds.mockResolvedValue([]);

    await expect(getUserProfileSkills("student-id")).resolves.toEqual([]);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("retourne les badges des parcours accessibles avec leur progression", async () => {
    getAccessibleParcoursIds.mockResolvedValue([4, 8]);
    findMany.mockResolvedValue([
      {
        id: 12,
        description: "Collaborer",
        badge: "badge.png",
        modules: [
          {
            module: {
              id: 5,
              title: "Travail en équipe",
              courses: [
                {
                  lessons: [
                    { lessonsRead: [{ finishedAt: new Date() }] },
                  ],
                },
              ],
            },
          },
        ],
      },
    ]);

    await expect(getUserProfileSkills("student-id")).resolves.toEqual([
      expect.objectContaining({
        id: 12,
        completedModules: 1,
        totalModules: 1,
        isEarned: true,
      }),
    ]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { parcoursId: { in: [4, 8] } },
      }),
    );
  });
});
