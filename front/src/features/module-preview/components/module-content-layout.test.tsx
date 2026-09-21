import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import ModuleContentLayout from "./module-content-layout";

const roots: Root[] = [];

const renderLayout = (container: HTMLDivElement, isSidebarCollapsed = false) => {
  const root = createRoot(container);
  roots.push(root);

  act(() => {
    root.render(
      <ModuleContentLayout
        header={<div>En-tête</div>}
        toolbar={<div>Actions</div>}
        sidebar={<div>Liste des cours</div>}
        isSidebarCollapsed={isSidebarCollapsed}
      >
        <div>Contenu principal</div>
      </ModuleContentLayout>,
    );
  });
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("ModuleContentLayout", () => {
  it("rend les zones structurelles dans leur ordre", () => {
    const container = document.createElement("div");
    renderLayout(container);

    expect(container.textContent).toBe(
      "En-têteActionsListe des coursContenu principal",
    );
  });

  it("masque uniquement la sidebar lorsqu'elle est réduite", () => {
    const container = document.createElement("div");
    renderLayout(container, true);

    expect(container.textContent).not.toContain("Liste des cours");
    expect(container.textContent).toContain("Contenu principal");
  });
});
