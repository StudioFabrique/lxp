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
            { id: 10, title: "Premier module" },
            { id: 20, title: "Deuxième module" },
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
      (element) => element.textContent === "jeanne dupont",
    );

    expect(resourceName?.classList.contains("capitalize")).toBe(true);
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
});
