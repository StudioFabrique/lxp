import { jest } from "@jest/globals";

const getAccessibleParcoursIds = jest.fn<() => Promise<number[]>>();
const loadSkillAchievements = jest.fn<() => Promise<Map<number, unknown>>>();

jest.unstable_mockModule("../../../helpers/skill-achievement-query.ts", () => ({
  loadSkillAchievements,
}));

jest.unstable_mockModule(
  "../../../utils/services/permissions/accessible-parcours.ts",
  () => ({ getAccessibleParcoursIds }),
);

const { default: getUserProfileSkills } =
  await import("../get-user-profile-skills.ts");

describe("badges de compétences du profil apprenant", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ne cherche aucun badge sans parcours accessible", async () => {
    getAccessibleParcoursIds.mockResolvedValue([]);

    await expect(getUserProfileSkills("student-id")).resolves.toEqual([]);
    expect(loadSkillAchievements).not.toHaveBeenCalled();
  });

  it("retourne les badges des parcours accessibles avec leur progression", async () => {
    getAccessibleParcoursIds.mockResolvedValue([4, 8]);
    loadSkillAchievements.mockResolvedValue(
      new Map([
        [
          12,
          {
            id: 12,
            description: "Collaborer",
            badge: "badge.png",
            completedModules: 1,
            totalModules: 1,
            isEarned: true,
          },
        ],
      ]),
    );

    await expect(getUserProfileSkills("student-id")).resolves.toEqual([
      expect.objectContaining({
        id: 12,
        completedModules: 1,
        totalModules: 1,
        isEarned: true,
      }),
    ]);
    expect(loadSkillAchievements).toHaveBeenCalledWith("student-id", {
      parcoursIds: [4, 8],
    });
  });
});
