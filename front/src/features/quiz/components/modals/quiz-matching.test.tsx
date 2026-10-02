import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import QuizMatching from "./quiz-matching";
import type { Quiz } from "../../interfaces/quiz";
it("ne plante pas et empêche de valider quand les paires sont nulles", async () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const onAnswer = vi.fn();
  const quiz = { id: "q1", type: "matching", question: "Associez", data: { pairs: null } } as unknown as Extract<Quiz, { type: "matching" }>;
  try {
    await act(async () => root.render(<QuizMatching quiz={quiz} onAnswer={onAnswer} onReport={vi.fn()} isAnswered={false} />));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("incomplète");
    const validate = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Valider ma réponse")!;
    expect(validate.disabled).toBe(true);
    await act(async () => validate.click());
    expect(onAnswer).not.toHaveBeenCalled();
  } finally {
    await act(async () => root.unmount());
  }
});
