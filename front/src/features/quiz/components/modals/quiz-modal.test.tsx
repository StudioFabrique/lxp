import { act, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import QuizModal from "./quiz-modal";
import type { Quiz } from "../../interfaces/quiz";

let root: Root;
let container: HTMLDivElement;
let props: ComponentProps<typeof QuizModal>;
beforeEach(() => {
  container = document.createElement("div");
  root = createRoot(container);
  props = {
    isOpen: true,
    quiz: { id: "q1", type: "true_false", question: "Une question", data: { answer: true }, trueExplanation: "Correct", falseExplanation: "Incorrect" },
    currentIndex: 0, totalQuizzes: 1, isAnswered: true, isCorrect: false,
    isStreaming: true, isReplacing: false, showResults: false, attempts: [], score: 0,
    onClose: vi.fn(), onAnswer: vi.fn(), onReport: vi.fn(async () => {}), onNext: vi.fn(),
  };
});
afterEach(async () => { await act(async () => root.unmount()); });
async function render(changes: Partial<typeof props> = {}) {
  props = { ...props, ...changes };
  await act(async () => root.render(<QuizModal {...props} />));
}
function nextButton() { return container.querySelector<HTMLButtonElement>(".modal-action button")!; }

it("attend la question supplémentaire avant de permettre de continuer", async () => {
  await render();
  expect(nextButton().textContent).toBe("Question suivante");
  await act(async () => nextButton().click());
  expect(nextButton().disabled).toBe(true);
  expect(props.onNext).not.toHaveBeenCalled();
});
it("conserve Question suivante une fois la question supplémentaire reçue", async () => {
  await render();
  await render({ isStreaming: false, totalQuizzes: 2 });
  expect(nextButton().textContent).toBe("Question suivante");
});
it("affiche Terminer uniquement à la dernière question quand la génération est finie", async () => {
  await render();
  await render({ isStreaming: false });
  expect(nextButton().textContent).toBe("Terminer");
});

it.each([
  { type: "true_false" as const, data: { answer: true } },
  { type: "mcq" as const, data: { options: ["A", "B"], answerIndex: 0 } },
  { type: "matching" as const, data: { pairs: [{ left: "A", right: "1" }, { left: "B", right: "2" }] } },
  { type: "ordering" as const, data: { items: ["A", "B"], order: [0, 1] } },
])("permet de signaler après la réponse pour $type", async (specific) => {
  await render({ quiz: { id: "q1", question: "Question", trueExplanation: "Oui", falseExplanation: "Non", ...specific } });
  const report = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Signaler un problème")!;
  expect(report).toBeDefined();
  expect(container.textContent).not.toContain("Valider ma réponse");
  await act(async () => report.click());
  expect(container.querySelector("textarea")).not.toBeNull();
  expect(container.textContent).toContain("Pourquoi cette question est-elle incorrecte ?");
});

const correctionQuizzes: Quiz[] = [
  { id: "mcq", type: "mcq", question: "Choisir", data: { options: ["Incorrect", "Correct"], answerIndex: 1 }, trueExplanation: "Oui", falseExplanation: "Non" },
  { id: "true-false", type: "true_false", question: "Choisir", data: { answer: false }, trueExplanation: "Oui", falseExplanation: "Non" },
  { id: "ordering", type: "ordering", question: "Ordonner", data: { items: ["Deuxième", "Troisième", "Premier"], order: [2, 0, 1] }, trueExplanation: "Oui", falseExplanation: "Non" },
  { id: "matching", type: "matching", question: "Associer", data: { pairs: [{ left: "France", right: "Paris" }, { left: "Italie", right: "Rome" }] }, trueExplanation: "Oui", falseExplanation: "Non" },
];

it.each([
  { quiz: correctionQuizzes[0], choice: "Incorrect", isCorrect: false },
  { quiz: correctionQuizzes[0], choice: "Correct", isCorrect: true },
  { quiz: correctionQuizzes[1], choice: "VRAI", isCorrect: false },
  { quiz: correctionQuizzes[1], choice: "FAUX", isCorrect: true },
])("surligne seulement le choix incorrect sélectionné : $choice", async ({ quiz, choice, isCorrect }) => {
  await render({ quiz, isAnswered: false });
  const selected = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === choice)!;
  await act(async () => selected.click());
  expect(container.querySelector("button.border-error")).toBeNull();
  const validate = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Valider ma réponse")!;
  await act(async () => validate.click());
  expect(props.onAnswer).toHaveBeenCalledWith(isCorrect, quiz.type === "mcq"
    ? { type: "mcq", selectedIndex: isCorrect ? 1 : 0 }
    : { type: "true_false", selected: !isCorrect });
  await render({ isAnswered: true, isCorrect });
  const wrong = container.querySelector<HTMLButtonElement>("button.border-error");
  if (isCorrect) {
    expect(wrong).toBeNull();
  } else {
    expect(wrong).toBe(selected);
    expect(wrong?.disabled).toBe(true);
    expect(wrong?.textContent).toBe(`${choice}Votre réponse`);
    expect(wrong?.classList.contains("disabled:bg-error/10")).toBe(true);
  }
  expect(container.querySelector("button.border-success")?.textContent).toContain("Bonne réponse");
});

it.each(correctionQuizzes)("masque la correction avant validation pour $type", async (quiz) => {
  await render({ quiz, isAnswered: false });
  expect(container.textContent).not.toContain("Bonne réponse");
  expect(container.querySelector('[aria-label="Ordre correct"]')).toBeNull();
  expect(container.querySelector('[aria-label="Associations correctes"]')).toBeNull();
});

it.each(correctionQuizzes.flatMap((quiz) => [
  { quiz, type: quiz.type, isCorrect: true },
  { quiz, type: quiz.type, isCorrect: false },
]))("affiche la correction pour $type avec isCorrect=$isCorrect", async ({ quiz, isCorrect }) => {
  await render({ quiz, isAnswered: true, isCorrect });
  if (quiz.type === "mcq" || quiz.type === "true_false") {
    const correct = container.querySelector<HTMLButtonElement>("button.border-success")!;
    expect(correct).not.toBeNull();
    expect(correct.disabled).toBe(true);
    expect(correct.classList.contains("disabled:border-success")).toBe(true);
    expect(correct.textContent).toBe(`${quiz.type === "mcq" ? "Correct" : "FAUX"}Bonne réponse`);
    expect(container.querySelectorAll("button.border-success")).toHaveLength(1);
  } else if (quiz.type === "ordering") {
    const solution = container.querySelector('[aria-label="Ordre correct"]')!;
    expect(Array.from(solution.querySelectorAll("li"), (item) => item.textContent)).toEqual(["Premier", "Deuxième", "Troisième"]);
  } else {
    const solution = container.querySelector('[aria-label="Associations correctes"]')!;
    expect(Array.from(solution.querySelectorAll("dt"), (item) => item.textContent)).toEqual(["France", "Italie"]);
    expect(Array.from(solution.querySelectorAll("dd"), (item) => item.textContent)).toEqual(["Paris", "Rome"]);
  }
});
