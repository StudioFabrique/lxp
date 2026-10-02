import { describe, expect, it } from "vitest";
import type { Quiz } from "../interfaces/quiz";
import { buildDiagnosticProgress } from "./diagnostic-progress";

const quizzes: Quiz[] = ["premiere", "deuxieme", "troisieme"].map((id) => ({
  id,
  type: "true_false",
  question: id,
  trueExplanation: "",
  falseExplanation: "",
  data: { answer: true },
}));

describe("reprise du diagnostic", () => {
  it("reprend à la première question sans réponse et restaure le score", () => {
    const progress = buildDiagnosticProgress(quizzes, [
      { externalId: "premiere", isCorrect: true, userAnswer: { type: "true_false", selected: true } },
      { externalId: "troisieme", isCorrect: false, userAnswer: { type: "true_false", selected: false } },
    ]);

    expect(progress.currentIndex).toBe(1);
    expect(progress.score).toBe(1);
    expect(progress.attempts.map((attempt) => attempt.quiz.id)).toEqual(["premiere", "troisieme"]);
    expect(progress.isComplete).toBe(false);
  });

  it("affiche les résultats si toutes les questions ont une réponse", () => {
    const progress = buildDiagnosticProgress(quizzes, quizzes.map((quiz) => ({
      externalId: quiz.id,
      isCorrect: true,
      userAnswer: { type: "true_false" as const, selected: true },
    })));

    expect(progress.isComplete).toBe(true);
    expect(progress.score).toBe(3);
  });
});
