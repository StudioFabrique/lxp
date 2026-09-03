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
) => {
  const root = createRoot(container);
  roots.push(root);

  act(() => {
    root.render(
      <ModuleContentExplorerWrapper
        selectedLesson={selectedLesson}
        onTogglePanel={vi.fn()}
        onCloseAll={vi.fn()}
        publishAllAction={
          <button type="button" aria-label="Tout publier" onClick={onPublishAll} />
        }
        scrollTopRef={createRef<HTMLDivElement>()}
        header={null}
        progressionSide={null}
        topProgressBar={null}
        previewLesson={null}
        moduleData={null}
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
      publishButton?.compareDocumentPosition(collapseButton!) &
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
});
