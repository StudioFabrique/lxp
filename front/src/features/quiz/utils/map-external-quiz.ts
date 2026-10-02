import type { Pair, Quiz } from "../interfaces/quiz";

export function isQuizPairs(value: unknown): value is Pair[] {
  return Array.isArray(value) && value.length >= 2 && value.every((pair) =>
    pair && typeof pair.left === "string" && pair.left.trim().length > 0 &&
    typeof pair.right === "string" && pair.right.trim().length > 0,
  );
}

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length >= 2 &&
  value.every((item) => typeof item === "string" && item.trim().length > 0);

/** Valide les données IA avant de les transmettre aux composants du quiz. */
export function mapExternalToInternal(value: unknown): Quiz | null {
  if (!value || typeof value !== "object") return null;
  const external = value as Record<string, unknown>;
  if (typeof external.id !== "string" || !external.id ||
      typeof external.prompt !== "string" || !external.prompt.trim()) return null;
  const base = {
    id: external.id,
    question: external.prompt,
    trueExplanation: typeof external.explanation_correct === "string" ? external.explanation_correct : "",
    falseExplanation: typeof external.explanation_wrong === "string" ? external.explanation_wrong : "",
  };
  switch (external.type) {
    case "mcq":
      if (!isStringList(external.choices) || !Number.isInteger(external.answer_key) ||
          typeof external.answer_key !== "number" || external.answer_key < 0 ||
          external.answer_key >= external.choices.length) return null;
      return { ...base, type: "mcq", data: { options: external.choices, answerIndex: external.answer_key } };
    case "true_false":
      if (typeof external.answer_key !== "boolean") return null;
      return { ...base, type: "true_false", data: { answer: external.answer_key } };
    case "matching":
      if (!isQuizPairs(external.pairs)) return null;
      return { ...base, type: "matching", data: { pairs: external.pairs } };
    case "ordering": {
      const items = external.ordering_items;
      const order = external.ordering_answer;
      if (!isStringList(items) || !Array.isArray(order) || order.length !== items.length ||
          new Set(order).size !== items.length ||
          !order.every((index) => Number.isInteger(index) && index >= 0 && index < items.length)) return null;
      return { ...base, type: "ordering", data: { items, order } };
    }
    default:
      return null;
  }
}
