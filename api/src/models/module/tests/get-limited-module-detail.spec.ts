import { jest } from "@jest/globals";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";

const moduleFirst = jest.fn<() => Promise<unknown>>();
const quizFirst = jest.fn<() => Promise<{ id: number } | null>>();
const quizModel = createModelMock({ first: quizFirst });

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { orm: { public: {
    Admin: createModelMock({ first: jest.fn<() => Promise<null>>().mockResolvedValue(null) }),
    Module: createModelMock({ first: moduleFirst }),
    Quiz: quizModel,
  } } },
}));
jest.unstable_mockModule("../../../helpers/enrich-contacts-with-names.ts", () => ({
  enrichContactsWithNames: jest.fn<() => Promise<unknown[]>>().mockResolvedValue([]),
}));
jest.unstable_mockModule("../../../helpers/skill-achievement-query.ts", () => ({
  loadSkillAchievements: jest.fn<() => Promise<Map<number, unknown>>>().mockResolvedValue(new Map()),
}));

const { default: getLimitedModuleDetail } = await import("../get-limited-module-detail.ts");

describe("disponibilité du diagnostic dans le détail du module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    moduleFirst.mockResolvedValue({
      id: 19, title: "Module", description: "Description", quizInstructions: "",
      parcours: { id: 1, title: "Parcours", tags: [] }, bonusSkills: [], contacts: [],
      courses: [{ id: 23, courseSlug: null, lessons: [{ id: 1, lessonsRead: [] }], contacts: [], tags: [] }],
    });
  });

  it("annonce un quiz enregistré sans consignes ni cours indexé", async () => {
    quizFirst.mockResolvedValue({ id: 9 });
    const result = await getLimitedModuleDetail(19, "student");
    expect(result.hasPreliminaryQuiz).toBe(true);
    expect(result.quizInstructions).toBe("");
    expect(result.courses[0].aiIndexed).toBe(false);
    expect(quizModel.select).toHaveBeenCalledWith("id");
    expect(result).not.toHaveProperty("questions");
  });

  it("n'annonce pas de quiz si aucun diagnostic avec questions n'existe", async () => {
    quizFirst.mockResolvedValue(null);
    expect((await getLimitedModuleDetail(19, "student")).hasPreliminaryQuiz).toBe(false);
  });
});
