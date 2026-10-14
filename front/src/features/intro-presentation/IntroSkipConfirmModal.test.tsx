import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import IntroSkipConfirmModal from "./IntroSkipConfirmModal";

let container: HTMLDivElement;
let root: Root;
const button = (label: string): HTMLButtonElement => {
  const found = Array.from(container.querySelectorAll("button")).find((entry) => entry.textContent?.trim() === label);
  if (!found) throw new Error(`Bouton introuvable : ${label}`);
  return found;
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("IntroSkipConfirmModal", () => {
  it("prévient que la présentation ne sera plus proposée et laisse la reprendre", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    act(() => root.render(<IntroSkipConfirmModal isSaving={false} onCancel={onCancel} onConfirm={onConfirm} />));
    expect(container.textContent).toContain("Revoir la présentation");
    act(() => button("Continuer la présentation").click());
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    act(() => button("Passer").click());
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("bloque les deux boutons pendant l'enregistrement", () => {
    act(() => root.render(<IntroSkipConfirmModal isSaving onCancel={vi.fn()} onConfirm={vi.fn()} />));
    expect(button("Continuer la présentation").disabled).toBe(true);
    expect(button("Passer").disabled).toBe(true);
  });
});
