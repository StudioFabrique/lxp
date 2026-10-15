import { act, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import ModuleContentLayout from "./module-content-layout";

const roots: Root[] = [];

const renderLayout = (
  container: HTMLDivElement,
  isSidebarCollapsed = false,
  showSidebarOnMobile = false,
) => {
  const root = createRoot(container);
  roots.push(root);

  act(() => {
    root.render(
      <ModuleContentLayout
        header={<div>En-tête</div>}
        toolbar={<div>Actions</div>}
        sidebar={<div>Liste des cours</div>}
        isSidebarCollapsed={isSidebarCollapsed}
        showSidebarOnMobile={showSidebarOnMobile}
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

  it("n'ouvre qu'une colonne sur mobile, la navigation passant par la barre du haut", () => {
    const container = document.createElement("div");
    renderLayout(container);

    const sidebar = container.querySelector(".hidden.md\\:block");
    expect(sidebar?.textContent).toBe("Liste des cours");
    expect(container.querySelector(".grid")?.classList.contains("grid-cols-1")).toBe(true);
  });

  it("garde la colonne de gauche sur mobile quand elle sert au calendrier", () => {
    const container = document.createElement("div");
    renderLayout(container, false, true);

    expect(container.querySelector(".hidden.md\\:block")).toBeNull();
    expect(container.querySelector(".grid")?.classList.contains("grid-cols-1")).toBe(false);
  });

  it("étend le contenu à toute la largeur quand la colonne est réduite sur mobile", () => {
    const container = document.createElement("div");
    renderLayout(container, true);

    const content = container.querySelector(".min-h-\\[80vh\\]");
    expect(content?.classList.contains("col-span-1")).toBe(true);
    expect(content?.classList.contains("col-span-2")).toBe(false);
  });

  it("expose le début de la zone de contenu pour y amener le défilement", () => {
    const container = document.createElement("div");
    const startRef = createRef<HTMLDivElement>();
    const root = createRoot(container);
    roots.push(root);
    act(() => {
      root.render(
        <ModuleContentLayout
          header={<div>En-tête</div>}
          toolbar={<div>Actions</div>}
          sidebar={<div>Liste des cours</div>}
          startRef={startRef}
        >
          <div>Contenu principal</div>
        </ModuleContentLayout>,
      );
    });

    expect(startRef.current?.textContent).toBe("Actions");
    expect(startRef.current?.className).toContain("scroll-mt-4");
  });
});
