/**
 * Correction des réponses de quiz, côté serveur.
 *
 * Jusqu'ici la justesse était calculée dans le navigateur et jamais transmise :
 * la reprendre ici est ce qui rend l'indicateur `correct_answer_rate` fiable.
 * Le client n'envoie que la réponse brute de l'apprenant.
 *
 * `questionData` est le JSON stocké dans `QuizQuestion.data`, c'est-à-dire la
 * charge utile renvoyée par le service IA moins les champs communs
 * (cf. `toQuizQuestionCreateData`).
 */

export type UserAnswer =
  | { type: "mcq"; selectedIndex: number }
  | { type: "true_false"; selected: boolean }
  | { type: "matching"; answers: Record<string, string> }
  | { type: "ordering"; items: Array<{ text: string; originalIndex: number }> };

export class UngradableAnswerError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "UngradableAnswerError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new UngradableAnswerError("Données de question illisibles.");
  }
  return value as Record<string, unknown>;
}

function gradeMcq(data: Record<string, unknown>, answer: unknown): boolean {
  const { selectedIndex } = asRecord(answer);
  if (typeof selectedIndex !== "number") {
    throw new UngradableAnswerError("`selectedIndex` manquant ou invalide.");
  }
  if (typeof data.answer_key !== "number") {
    throw new UngradableAnswerError("Question mcq sans `answer_key` numérique.");
  }
  return selectedIndex === data.answer_key;
}

function gradeTrueFalse(
  data: Record<string, unknown>,
  answer: unknown,
): boolean {
  const { selected } = asRecord(answer);
  if (typeof selected !== "boolean") {
    throw new UngradableAnswerError("`selected` manquant ou invalide.");
  }
  if (typeof data.answer_key !== "boolean") {
    throw new UngradableAnswerError(
      "Question true_false sans `answer_key` booléen.",
    );
  }
  return selected === data.answer_key;
}

function gradeMatching(
  data: Record<string, unknown>,
  answer: unknown,
): boolean {
  const { answers } = asRecord(answer);
  const submitted = asRecord(answers);

  if (!Array.isArray(data.pairs)) {
    throw new UngradableAnswerError("Question matching sans `pairs`.");
  }

  // Une paire non appariée compte comme fausse, elle n'invalide pas la réponse.
  return data.pairs.every((pair, index) => {
    const expected = asRecord(pair).right;
    return submitted[String(index)] === expected;
  });
}

function gradeOrdering(
  data: Record<string, unknown>,
  answer: unknown,
): boolean {
  const { items } = asRecord(answer);
  if (!Array.isArray(items)) {
    throw new UngradableAnswerError("`items` manquant ou invalide.");
  }

  const expected = data.ordering_answer;
  if (!Array.isArray(expected)) {
    throw new UngradableAnswerError(
      "Question ordering sans `ordering_answer`.",
    );
  }
  if (items.length !== expected.length) return false;

  return items.every(
    (item, index) => asRecord(item).originalIndex === expected[index],
  );
}

export function gradeAnswer(
  questionType: string,
  questionData: unknown,
  userAnswer: unknown,
): boolean {
  const data = asRecord(questionData);
  const { type } = asRecord(userAnswer);

  if (type !== questionType) {
    throw new UngradableAnswerError(
      `Type de réponse "${String(type)}" incompatible avec la question "${questionType}".`,
    );
  }

  switch (questionType) {
    case "mcq":
      return gradeMcq(data, userAnswer);
    case "true_false":
      return gradeTrueFalse(data, userAnswer);
    case "matching":
      return gradeMatching(data, userAnswer);
    case "ordering":
      return gradeOrdering(data, userAnswer);
    default:
      throw new UngradableAnswerError(
        `Type de question non corrigeable : "${questionType}".`,
      );
  }
}
