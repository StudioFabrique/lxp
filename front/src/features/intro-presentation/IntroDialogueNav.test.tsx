import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import IntroDialogueNav from "./IntroDialogueNav";

let container: HTMLDivElement;
let root: Root;
const labels = (): string[] => Array.from(container.querySelectorAll("button"), (button) => button.textContent ?? "");

beforeEach(() => {
  container = document.createElement("div");
  root = createRoot(container);
});
afterEach(() => act(() => root.unmount()));

describe("IntroDialogueNav", () => {
  it("place « Précédent » à gauche et « Suivant » à droite", () => {
    act(() => root.render(<IntroDialogueNav previous={vi.fn()} next={vi.fn()} />));
    expect(labels()).toEqual(["Précédent", "Suivant"]);
  });

  it("laisse l'action de fin prendre l'emplacement de « Suivant » au dernier message", () => {
    const onClick = vi.fn();
    act(() => root.render(<IntroDialogueNav previous={vi.fn()} additionalAction={{ label: "Continuer", onClick }} />));
    expect(labels()).toEqual(["Précédent", "Continuer"]);
    act(() => container.querySelectorAll("button")[1].click());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("garde « Suivant » tant qu'il reste des messages, même avec une action de fin", () => {
    act(() => root.render(<IntroDialogueNav next={vi.fn()} additionalAction={{ label: "Continuer", onClick: vi.fn() }} />));
    expect(labels()).toEqual(["Suivant"]);
  });

  it("n'affiche rien sans navigation ni action", () => {
    act(() => root.render(<IntroDialogueNav />));
    expect(container.innerHTML).toBe("");
  });
});
