import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import FeedbacksButton from "./FeedbacksButton";

it("affiche les particules hors de la modale depuis le bouton cliqué", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onClick = vi.fn();
  const frame = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

  try {
    act(() => root.render(
      <div className="modal-box">
        <FeedbacksButton feedbackType="stars" elementCount={3} showFeedback onClick={onClick}>
          Première évaluation
        </FeedbacksButton>
        <FeedbacksButton feedbackType="stars" elementCount={4} showFeedback onClick={onClick}>
          Deuxième évaluation
        </FeedbacksButton>
      </div>,
    ));
    const buttons = container.querySelectorAll("button");
    vi.spyOn(buttons[1], "getBoundingClientRect").mockReturnValue({
      left: 100, top: 200, width: 80, height: 32,
      right: 180, bottom: 232, x: 100, y: 200, toJSON: () => ({}),
    });

    act(() => buttons[1].click());

    expect(onClick).toHaveBeenCalledOnce();
    expect(container.querySelectorAll("span")).toHaveLength(0);
    const layers = document.body.querySelectorAll<HTMLDivElement>('[aria-hidden="true"]');
    expect(layers).toHaveLength(2);
    expect(layers[0].querySelector("span")?.children).toHaveLength(0);
    const origin = layers[1].querySelector("span")!;
    expect(origin.children).toHaveLength(12);
    expect(origin.style.left).toBe("140px");
    expect(origin.style.top).toBe("200px");
    expect((origin.firstElementChild as HTMLElement).style.position).toBe("absolute");
    expect(layers[1].parentElement).toBe(document.body);
    expect(layers[1].classList.contains("overflow-hidden")).toBe(true);
  } finally {
    act(() => root.unmount());
    container.remove();
    frame.mockRestore();
  }
});
