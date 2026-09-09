import { act, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type Lesson from "../../../utils/interfaces/lesson";
import ModuleContentExplorerWrapper from "./module-content-explorer-wrapper";

const roots: Root[] = [];

const renderWrapper = (
  container: HTMLDivElement,
  selectedLesson?: Lesson,
  onPublishAll = vi.fn(),
  showPublishAll = true,
  calendar = false,
) => {
  const root = createRoot(container);
  roots.push(root);

  act(() => {
    root.render(
      <ModuleContentExplorerWrapper
        calendarAction={calendar ? <button aria-label="Calendrier" /> : undefined}
        calendarContent={calendar ? <div>Planification</div> : undefined}
        selectedLesson={selectedLesson}
        onTogglePanel={vi.fn()}
        onCloseAll={vi.fn()}
        showPublishAll={showPublishAll}
        publishAllAction={
          <button type="button" aria-label="Tout publier" onClick={onPublishAll} />
        }
        scrollTopRef={createRef<HTMLDivElement>()}
        header={null}
        progressionSide={<div>Liste des cours</div>}
        topProgressBar={null}
        previewLesson={<div>Activité sélectionnée</div>}
        moduleData={<div>Données du module</div>}
      />,
    );
  });
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("ModuleContentExplorerWrapper", () => {
  it("place l'action Tout publier à gauche de Tout réduire", () => {
    const container = document.createElement("div");
    const onPublishAll = vi.fn();
    renderWrapper(container, { id: 1 } as Lesson, onPublishAll);

    const publishButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Tout publier"]',
    );
    const collapseButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Tout réduire"]',
    );

    expect(publishButton).toBeTruthy();
    expect(collapseButton).toBeTruthy();
    expect(
      publishButton!.compareDocumentPosition(collapseButton!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    act(() => publishButton?.click());
    expect(onPublishAll).toHaveBeenCalledOnce();
  });

  it("conserve Tout publier lorsqu'aucune leçon n'est ouverte", () => {
    const container = document.createElement("div");
    renderWrapper(container);

    expect(
      container.querySelector('button[aria-label="Tout publier"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('button[aria-label="Tout réduire"]'),
    ).toBeNull();
  });

  it("masque Tout publier lorsque tous les cours sont publiés", () => {
    const container = document.createElement("div");
    renderWrapper(container, undefined, vi.fn(), false);

    expect(
      container.querySelector('button[aria-label="Tout publier"]'),
    ).toBeNull();
  });
});


it("place Calendrier en dernier et remplace le panneau droit avec ou sans leçon sélectionnée", () => {
  for (const lesson of [undefined, { id: 1 } as Lesson]) {
    const container = document.createElement("div");
    renderWrapper(container, lesson, vi.fn(), true, true);
    const buttons = container.querySelectorAll("button");
    expect(buttons[buttons.length - 1].getAttribute("aria-label")).toBe("Calendrier");
    expect(container.textContent).toContain("Planification");
    expect(container.textContent).toContain("Liste des cours");
    expect(container.textContent).not.toContain("Activité sélectionnée");
    expect(container.textContent).not.toContain("Données du module");
  }
});
