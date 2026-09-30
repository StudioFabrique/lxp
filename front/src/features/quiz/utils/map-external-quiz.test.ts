import { expect, it } from "vitest";
import { mapExternalToInternal } from "./map-external-quiz";
const base = { id: "q1", prompt: "Associez les éléments", type: "matching" };
it.each([null, undefined, [], [null], [{ left: "A" }], [{ left: "A", right: "B" }, null]])(
  "écarte les paires d'association invalides : %j", (pairs) => {
    expect(mapExternalToInternal({ ...base, pairs })).toBeNull();
  },
);
it("conserve les paires valides et normalise les explications nulles du cache", () => {
  const pairs = [{ left: "A", right: "1" }, { left: "B", right: "2" }];
  expect(mapExternalToInternal({ ...base, pairs, explanation_correct: null, explanation_wrong: null })).toEqual({
    id: "q1", question: base.prompt, type: "matching", data: { pairs }, trueExplanation: "", falseExplanation: "",
  });
});
it.each([
  { type: "mcq", choices: null, answer_key: 0 },
  { type: "mcq", choices: ["A", "B"], answer_key: 2 },
  { type: "true_false", answer_key: null },
  { type: "ordering", ordering_items: null, ordering_answer: [0, 1] },
  { type: "ordering", ordering_items: ["A", "B"], ordering_answer: [0, 0] },
])("écarte également les autres types incomplets : %j", (specific) => {
  expect(mapExternalToInternal({ ...base, ...specific })).toBeNull();
});
it("accepte les autres types valides", () => {
  for (const specific of [
    { type: "mcq", choices: ["A", "B"], answer_key: 1 },
    { type: "true_false", answer_key: false },
    { type: "ordering", ordering_items: ["A", "B"], ordering_answer: [1, 0] },
  ]) expect(mapExternalToInternal({ ...base, ...specific })?.type).toBe(specific.type);
});
