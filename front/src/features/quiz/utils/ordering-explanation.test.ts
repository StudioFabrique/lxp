import { describe, expect, it } from "vitest";
import { Quiz } from "../interfaces/quiz";
import { getQuizExplanation } from "./ordering-explanation";

const ordering = (falseExplanation: string): Quiz =>
  ({
    id: "1",
    type: "ordering",
    question: "q",
    trueExplanation: "ok",
    falseExplanation,
    data: { items: ["a", "b"], order: [0, 1] },
  }) as Quiz;

describe("getQuizExplanation", () => {
  it("garde la règle et retire la liste numérotée", () => {
    const text = "- (1) A — x.\n- (2) B — y. Règle : on ne peut pas B avant A.";
    expect(getQuizExplanation(ordering(text), false)).toBe("Règle : on ne peut pas B avant A.");
  });
  it("retire les lignes de liste sans règle", () => {
    expect(getQuizExplanation(ordering("Intro.\n- (1) A\n- (2) B"), false)).toBe("Intro.");
  });
  it("renvoie l'explication de réussite telle quelle", () => {
    expect(getQuizExplanation(ordering("x"), true)).toBe("ok");
  });
});
