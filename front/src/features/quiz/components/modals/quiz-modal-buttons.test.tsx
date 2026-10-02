import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import QuizModalButtons from "./quiz-modal-buttons";
it("conserve le signalement quand une action suivante est fournie", async () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const onNext = vi.fn();
  try {
    await act(async () => root.render(<QuizModalButtons externalId="q1" isValid={false} isAnswered onValidate={vi.fn()} onReport={vi.fn()} nextAction={{ label: "Continuer", onClick: onNext }} />));
    const buttons = Array.from(container.querySelectorAll("button"));
    expect(buttons.map((button) => button.textContent)).toEqual(["Signaler un problème", "Continuer"]);
    await act(async () => buttons[1].click());
    expect(onNext).toHaveBeenCalledOnce();
    await act(async () => buttons[0].click());
    expect(container.querySelector("textarea")).not.toBeNull();
  } finally {
    await act(async () => root.unmount());
  }
});
