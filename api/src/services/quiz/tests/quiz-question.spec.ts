import {
  createQuizGenerationKey,
  toQuizApiQuestion,
  toQuizQuestionCreateData,
} from "../quiz-question.ts";

describe("quiz question mapping", () => {
  it("sépare les champs communs des données propres au type de question", () => {
    expect(
      toQuizQuestionCreateData({
        id: 42,
        type: "mcq",
        prompt: "Quelle réponse ?",
        difficulty: null,
        explanation_correct: "Exact",
        explanation_wrong: "Réessaie",
        tags: ["typescript"],
        choices: ["A", "B"],
        answer_key: "A",
        tokens: { total_tokens: 12 },
      }),
    ).toEqual({
      externalId: "42",
      type: "mcq",
      prompt: "Quelle réponse ?",
      difficulty: "medium",
      explanationTrue: "Exact",
      explanationWrong: "Réessaie",
      tags: ["typescript"],
      data: {
        choices: ["A", "B"],
        answer_key: "A",
      },
    });
  });

  it("reconstruit le contrat attendu par le client", () => {
    expect(
      toQuizApiQuestion({
        externalId: "question-1",
        type: "true_false",
        prompt: "Vrai ou faux ?",
        difficulty: "easy",
        explanationTrue: null,
        explanationWrong: null,
        tags: [],
        data: { answer_key: true },
      }),
    ).toEqual({
      id: "question-1",
      type: "true_false",
      prompt: "Vrai ou faux ?",
      difficulty: "easy",
      explanation_correct: null,
      explanation_wrong: null,
      tags: [],
      answer_key: true,
    });
  });

  it("produit une clé de génération unique", () => {
    const firstKey = createQuizGenerationKey();
    const secondKey = createQuizGenerationKey();

    expect(firstKey).toMatch(/^[a-f0-9]{32}$/);
    expect(secondKey).not.toBe(firstKey);
  });
});
