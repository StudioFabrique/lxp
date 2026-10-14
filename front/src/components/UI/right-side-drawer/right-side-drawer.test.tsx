import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import RightSideDrawer from "./right-side-drawer";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
});

describe("RightSideDrawer", () => {
  it.each(["Retour", "Fermer le panneau"])(
    "ferme par %s une seule fois et peut être rouvert",
    (closeButtonLabel) => {
      const container = document.createElement("div");
      root = createRoot(container);
      const onCloseDrawer = vi.fn((id: string) => {
        container.querySelector<HTMLInputElement>(`input[id="${id}"]`)?.click();
      });

      act(() =>
        root?.render(
          <RightSideDrawer
            id="test-drawer"
            title="Test"
            buttonTitle="Ouvrir"
            onCloseDrawer={onCloseDrawer}
          >
            Contenu
          </RightSideDrawer>,
        ),
      );

      const checkbox = container.querySelector<HTMLInputElement>("input.drawer-toggle");
      const openButton = container.querySelector<HTMLLabelElement>("label.drawer-button");
      const closeButton = container.querySelector<HTMLButtonElement>(
        `button[aria-label="${closeButtonLabel}"]`,
      );

      act(() => openButton?.click());
      expect(checkbox?.checked).toBe(true);

      act(() => closeButton?.click());
      expect(onCloseDrawer).toHaveBeenCalledOnce();
      expect(checkbox?.checked).toBe(false);

      act(() => openButton?.click());
      expect(checkbox?.checked).toBe(true);
    },
  );

  it("ferme un drawer piloté par isOpen depuis l'arrière-plan", () => {
    const container = document.createElement("div");
    root = createRoot(container);
    const onCloseDrawer = vi.fn();

    act(() =>
      root?.render(
        <RightSideDrawer id="controlled-drawer" title="Test" visible={false} isOpen onCloseDrawer={onCloseDrawer}>
          Contenu
        </RightSideDrawer>,
      ),
    );

    expect(container.querySelector<HTMLInputElement>("input.drawer-toggle")?.checked).toBe(true);
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Fermer le panneau"]')?.click());
    expect(onCloseDrawer).toHaveBeenCalledOnce();

    act(() =>
      root?.render(
        <RightSideDrawer id="controlled-drawer" title="Test" visible={false} isOpen={false} onCloseDrawer={onCloseDrawer}>
          Contenu
        </RightSideDrawer>,
      ),
    );
    expect(container.querySelector<HTMLInputElement>("input.drawer-toggle")?.checked).toBe(false);
  });

  it("place le focus sur le premier champ à l'ouverture", async () => {
    vi.useFakeTimers();
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() =>
      root?.render(
        <RightSideDrawer id="focus-drawer" title="Test" buttonTitle="Ouvrir">
          <input type="checkbox" aria-label="Case" />
          <textarea aria-label="Objectif" />
        </RightSideDrawer>,
      ),
    );
    act(() =>
      container.querySelector<HTMLLabelElement>("label.drawer-button")?.click(),
    );
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(document.activeElement).toBe(
      container.querySelector("textarea[aria-label='Objectif']"),
    );
    vi.useRealTimers();
    container.remove();
  });
});
