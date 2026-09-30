import { act, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import QuizModal from "./quiz-modal";

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

it("affiche Question suivante à 1/1 pendant la génération d'une question supplémentaire", async () => {
  await render();
  expect(nextButton().textContent).toBe("Question suivante");
  await act(async () => nextButton().click());
  expect(props.onNext).toHaveBeenCalledOnce();
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
