import {
  gradeAnswer,
  UngradableAnswerError,
} from "../grade-answer.ts";

/**
 * `questionData` reproduit ce que `toQuizQuestionCreateData` stocke dans
 * `QuizQuestion.data` : la charge utile du service IA moins les champs communs.
 */

describe("gradeAnswer — mcq", () => {
  const data = { choices: ["Paris", "Lyon", "Nice"], answer_key: 1 };

  it("valide l'index attendu", () => {
    expect(gradeAnswer("mcq", data, { type: "mcq", selectedIndex: 1 })).toBe(
      true,
    );
  });

  it("refuse un autre index", () => {
    expect(gradeAnswer("mcq", data, { type: "mcq", selectedIndex: 0 })).toBe(
      false,
    );
  });

  it("rejette une réponse sans index", () => {
    expect(() => gradeAnswer("mcq", data, { type: "mcq" })).toThrow(
      UngradableAnswerError,
    );
  });

  it("ne confond pas l'index 0 avec une absence de réponse", () => {
    expect(
      gradeAnswer("mcq", { ...data, answer_key: 0 }, { type: "mcq", selectedIndex: 0 }),
    ).toBe(true);
  });
});

describe("gradeAnswer — true_false", () => {
  const data = { choices: null, answer_key: false };

  it("valide le booléen attendu", () => {
    expect(
      gradeAnswer("true_false", data, { type: "true_false", selected: false }),
    ).toBe(true);
  });

  it("refuse le booléen opposé", () => {
    expect(
      gradeAnswer("true_false", data, { type: "true_false", selected: true }),
    ).toBe(false);
  });

  it("ne traite pas `false` comme une réponse manquante", () => {
    expect(() =>
      gradeAnswer("true_false", data, { type: "true_false", selected: false }),
    ).not.toThrow();
  });
});

describe("gradeAnswer — matching", () => {
  const data = {
    pairs: [
      { left: "France", right: "Paris" },
      { left: "Italie", right: "Rome" },
    ],
    answer_key: [0, 1],
  };

  it("valide toutes les paires correctes", () => {
    expect(
      gradeAnswer("matching", data, {
        type: "matching",
        answers: { 0: "Paris", 1: "Rome" },
      }),
    ).toBe(true);
  });

  it("refuse dès qu'une paire est fausse", () => {
    expect(
      gradeAnswer("matching", data, {
        type: "matching",
        answers: { 0: "Paris", 1: "Madrid" },
      }),
    ).toBe(false);
  });

  it("compte une paire non appariée comme fausse", () => {
    expect(
      gradeAnswer("matching", data, {
        type: "matching",
        answers: { 0: "Paris" },
      }),
    ).toBe(false);
  });
});

describe("gradeAnswer — ordering", () => {
  const data = {
    ordering_items: ["Naissance", "École", "Travail"],
    ordering_answer: [0, 1, 2],
  };

  it("valide l'ordre attendu", () => {
    expect(
      gradeAnswer("ordering", data, {
        type: "ordering",
        items: [
          { text: "Naissance", originalIndex: 0 },
          { text: "École", originalIndex: 1 },
          { text: "Travail", originalIndex: 2 },
        ],
      }),
    ).toBe(true);
  });

  it("refuse un ordre permuté", () => {
    expect(
      gradeAnswer("ordering", data, {
        type: "ordering",
        items: [
          { text: "École", originalIndex: 1 },
          { text: "Naissance", originalIndex: 0 },
          { text: "Travail", originalIndex: 2 },
        ],
      }),
    ).toBe(false);
  });

  it("refuse une réponse incomplète", () => {
    expect(
      gradeAnswer("ordering", data, {
        type: "ordering",
        items: [{ text: "Naissance", originalIndex: 0 }],
      }),
    ).toBe(false);
  });
});

describe("gradeAnswer — robustesse", () => {
  it("refuse un type de réponse incompatible avec la question", () => {
    expect(() =>
      gradeAnswer(
        "mcq",
        { choices: [], answer_key: 0 },
        { type: "true_false", selected: true },
      ),
    ).toThrow(/incompatible/);
  });

  it("refuse un type de question non corrigeable", () => {
    expect(() =>
      gradeAnswer("open_text", {}, { type: "open_text" }),
    ).toThrow(UngradableAnswerError);
  });

  it("refuse des données de question illisibles", () => {
    expect(() =>
      gradeAnswer("mcq", null, { type: "mcq", selectedIndex: 0 }),
    ).toThrow(UngradableAnswerError);
  });

  it("expose un statut 400 : c'est une erreur du client, pas du serveur", () => {
    try {
      gradeAnswer("mcq", {}, { type: "mcq", selectedIndex: 0 });
      throw new Error("aurait dû lever");
    } catch (error) {
      expect((error as UngradableAnswerError).statusCode).toBe(400);
    }
  });
});
