import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import TooltipLayer from "./tooltip-layer";

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

function renderTooltip() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<TooltipLayer />));

  const button = document.createElement("button");
  button.className = "tooltip";
  button.dataset.tip = "Revenir à aujourd'hui";
  container.append(button);
  return button;
}

function hover(button: HTMLButtonElement) {
  act(() => button.dispatchEvent(new Event("pointerover", { bubbles: true })));
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
}

describe("TooltipLayer", () => {
  it("ferme l'info-bulle quand un clic supprime son bouton", () => {
    const button = renderTooltip();
    hover(button);

    button.addEventListener("click", () => button.remove());
    act(() => button.click());

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("ferme l'info-bulle lorsque le pointeur se déplace après la suppression du bouton", () => {
    const button = renderTooltip();
    hover(button);

    button.remove();
    act(() => document.body.dispatchEvent(new Event("pointermove", { bubbles: true })));

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("ferme l'info-bulle dès que son bouton est supprimé", async () => {
    const button = renderTooltip();
    hover(button);

    await act(async () => button.remove());

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });
});
