import { jest } from "@jest/globals";

const findAnyEndingQuiz = jest.fn<() => Promise<unknown>>();
const findStudentByMongoId = jest.fn<() => Promise<unknown>>();
const postStream = jest.fn<() => Promise<unknown>>();

jest.unstable_mockModule("../quiz-repository.ts", () => ({
  quizRepository: { findAnyEndingQuiz, findStudentByMongoId },
}));
jest.unstable_mockModule("../../../services/ai/ai-api-client.ts", () => ({
  aiApiClient: { postStream, postJson: jest.fn() },
}));
jest.unstable_mockModule("../../course/get-course-by-id.ts", () => ({
  default: jest.fn(),
}));
jest.unstable_mockModule("../../stats/trackTokens.ts", () => ({
  trackTokens: jest.fn(),
}));
jest.unstable_mockModule("../../../services/ai/student-profile-adapter.ts", () => ({
  buildStudentProfile: jest.fn(),
}));
jest.unstable_mockModule("../../../utils/db.ts", () => ({ prisma: {} }));

const { prepareEndingQuizGeneration } = await import("../quiz-generation.ts");

describe("quiz de fin en démonstration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DEMO_MODE = "true";
  });
  afterAll(() => {
    delete process.env.DEMO_MODE;
  });

  it("rejoue un quiz déjà généré sans appeler l'IA", async () => {
    const questions = [{ id: 1, type: "mcq" }];
    findAnyEndingQuiz.mockResolvedValue({ questions });

    const result = await prepareEndingQuizGeneration(15, "visiteur");

    expect(result).toEqual({ kind: "cached", questions });
    expect(postStream).not.toHaveBeenCalled();
    expect(findStudentByMongoId).not.toHaveBeenCalled();
  });

  it("refuse proprement quand aucun quiz n'est fourni, sans générer", async () => {
    findAnyEndingQuiz.mockResolvedValue(null);

    await expect(prepareEndingQuizGeneration(99, "visiteur")).rejects.toMatchObject({
      statusCode: 404,
      code: "DEMO_QUIZ_UNAVAILABLE",
    });
    expect(postStream).not.toHaveBeenCalled();
  });
});
