import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AssignContactsToModulesModal from "./assign-contacts-to-modules-modal";

describe("AssignContactsToModulesModal", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <AssignContactsToModulesModal
          contacts={[
            {
              id: 1,
              idMdb: "contact-1",
              firstname: "jeanne",
              lastname: "dupont",
              role: "formatrice",
            },
          ]}
          modules={[
            { id: 10, title: "Premier module", contacts: [] },
            { id: 20, title: "Deuxième module", contacts: [] },
          ]}
          isSubmitting={false}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("capitalise le prénom et le nom de la ressource", () => {
    const resourceName = Array.from(container.querySelectorAll("span")).find(
      (element) => element.textContent === "Jeanne Dupont",
    );

    expect(resourceName).toBeDefined();
  });

  it("bloque la fermeture et les choix pendant l'affectation puis les réactive", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const render = (isSubmitting: boolean) => {
      act(() => {
        root.render(
          <AssignContactsToModulesModal
            contacts={[{ id: 1, idMdb: "contact-1", firstname: "jeanne", lastname: "dupont", role: "formatrice" }]}
            modules={[{ id: 10, title: "Premier module", contacts: [] }]}
            isSubmitting={isSubmitting}
            onClose={onClose}
            onSubmit={onSubmit}
          />,
        );
      });
    };

    render(true);
    const buttons = Array.from(container.querySelectorAll("button"));
    const checkboxes = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    expect(buttons.every((button) => button.disabled)).toBe(true);
    expect(checkboxes.every((checkbox) => checkbox.disabled)).toBe(true);
    act(() => {
      buttons.forEach((button) => button.click());
      checkboxes.forEach((checkbox) => checkbox.click());
    });
    expect(onClose).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(checkboxes.every((checkbox) => checkbox.checked)).toBe(true);

    render(false);
    expect(buttons.every((button) => !button.disabled)).toBe(true);
    expect(checkboxes.every((checkbox) => !checkbox.disabled)).toBe(true);
    act(() => buttons.find((button) => button.textContent === "Plus tard")!.click());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("permet de désélectionner puis sélectionner tous les modules", () => {
    const getCheckboxes = () =>
      Array.from(
        container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
      );

    expect(getCheckboxes()).toHaveLength(3);
    expect(getCheckboxes().every(({ checked }) => checked)).toBe(true);
    expect(container.textContent).toContain("Tout désélectionner");

    act(() => getCheckboxes()[0].click());

    expect(getCheckboxes().every(({ checked }) => !checked)).toBe(true);
    expect(container.textContent).toContain("Tout sélectionner");

    act(() => getCheckboxes()[0].click());

    expect(getCheckboxes().every(({ checked }) => checked)).toBe(true);
    expect(container.textContent).toContain("Tout désélectionner");
  });

  it("masque les modules auxquels la ressource est déjà affectée", () => {
    act(() => {
      root.render(
        <AssignContactsToModulesModal
          contacts={[
            {
              id: 1,
              idMdb: "contact-1",
              firstname: "jeanne",
              lastname: "dupont",
              role: "formatrice",
            },
          ]}
          modules={[
            {
              id: 10,
              title: "Module déjà affecté",
              contacts: [
                {
                  id: 1,
                  idMdb: "contact-1",
                  firstname: "jeanne",
                  lastname: "dupont",
                  role: "formatrice",
                },
              ],
            },
            { id: 20, title: "Module disponible", contacts: [] },
          ]}
          isSubmitting={false}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );
    });

    expect(container.textContent).not.toContain("Module déjà affecté");
    expect(container.textContent).toContain("Module disponible");
  });
});
