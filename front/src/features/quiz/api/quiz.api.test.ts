import { beforeEach, expect, it, vi } from "vitest";
import apiClient from "../../../lib/axios";
import { quizApi } from "./quiz.api";
vi.mock("../../../lib/axios", () => ({ default: { post: vi.fn(async () => ({ data: {} })) } }));
beforeEach(() => vi.clearAllMocks());
it("omet la tentative nulle lors du premier quiz rapide", async () => {
  await quizApi.queries.requestRandomQuestion("Contenu pédagogique", { courseId: 5, attemptId: null });
  expect(apiClient.post).toHaveBeenCalledWith("/quiz/random", { content: "Contenu pédagogique", courseId: 5 });
});
it("conserve la tentative pour les questions supplémentaires", async () => {
  await quizApi.queries.requestRandomQuestion("Contenu pédagogique", { courseId: 5, attemptId: 10 });
  expect(apiClient.post).toHaveBeenCalledWith("/quiz/random", { content: "Contenu pédagogique", courseId: 5, attemptId: 10 });
});
