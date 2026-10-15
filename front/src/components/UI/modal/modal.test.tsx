import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import Modal from "./modal";

const roots: Root[] = [];

const renderModal = (onRightClick: () => void | Promise<unknown>) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <Modal title="Suppression" leftLabel="Annuler" rightLabel="Confirmer" onLeftClick={vi.fn()} onRightClick={onRightClick}>
        <p>Contenu</p>
      </Modal>,
    ),
  );
  return container;
};

const buttons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>("dialog button"));

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("Modal", () => {
  it("affiche un loader et désactive les boutons le temps d'une action asynchrone", async () => {
    let finish: () => void = () => undefined;
    const action = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    const container = renderModal(action);

    act(() => buttons(container).find((button) => button.textContent === "Confirmer")!.click());

    expect(action).toHaveBeenCalledOnce();
    expect(buttons(container).every((button) => button.disabled)).toBe(true);
    expect(container.querySelector(".animate-spin")).not.toBeNull();

    await act(async () => finish());

    expect(buttons(container).some((button) => button.disabled)).toBe(false);
    expect(container.querySelector(".animate-spin")).toBeNull();
  });

  it("rend la main après un échec de l'action", async () => {
    const action = vi.fn(() => Promise.reject(new Error("échec")));
    const container = renderModal(action);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await act(async () => {
      buttons(container).find((button) => button.textContent === "Confirmer")!.click();
      await Promise.resolve();
    });

    expect(buttons(container).some((button) => button.disabled)).toBe(false);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("n'affiche pas de chargement pour une action synchrone", () => {
    const action = vi.fn();
    const container = renderModal(action);

    act(() => buttons(container).find((button) => button.textContent === "Confirmer")!.click());

    expect(action).toHaveBeenCalledOnce();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(buttons(container).some((button) => button.disabled)).toBe(false);
  });
});
