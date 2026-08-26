import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import NotSelectedContacts from "../../../../components/shared/inherited-items/not-selected-contacts";
import NotSelectedSkills from "./not-selected-skills";

const renderedRoots: Array<{ container: HTMLDivElement; root: Root }> = [];

const render = (element: React.ReactNode) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  renderedRoots.push({ container, root });

  act(() => root.render(element));

  return container;
};

afterEach(() => {
  renderedRoots.forEach(({ root }) => act(() => root.unmount()));
  renderedRoots.length = 0;
});

describe("listes de sélection de ModuleToParcours", () => {
  it("affiche toutes les ressources pédagogiques disponibles", () => {
    const contacts = Array.from({ length: 18 }, (_, index) => ({
      id: index + 1,
      idMdb: `contact-${index + 1}`,
      name: `Contact ${index + 1}`,
      role: "Formateur",
    }));

    const container = render(
      <NotSelectedContacts
        list={contacts}
        onAddItems={vi.fn()}
        onCloseDrawer={vi.fn()}
      />,
    );

    expect(container.querySelectorAll("tbody tr")).toHaveLength(18);
  });

  it("affiche toutes les compétences disponibles", () => {
    const skills = Array.from({ length: 18 }, (_, index) => ({
      id: index + 1,
      description: `Compétence ${index + 1}`,
    }));

    const container = render(
      <NotSelectedSkills
        list={skills}
        onAddItems={vi.fn()}
        onCloseDrawer={vi.fn()}
      />,
    );

    expect(container.querySelectorAll("tbody tr")).toHaveLength(18);
  });
});
