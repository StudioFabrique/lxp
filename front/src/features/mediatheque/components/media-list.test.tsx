import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import MediaList, { MediaPreview } from "./media-list";
import type Media from "../interfaces/media";

const media: Media = {
  id: 7,
  name: "illustration.png",
  url: "illustration-7.png",
  type: "image",
  size: 2048,
  used: 2,
  createdAt: "2026-09-08T10:00:00.000Z",
  associatedActivities: [
    {
      id: 12,
      title: "Découvrir le sujet",
      type: "image",
      order: 0,
      parent: "lesson",
      parentTitle: "Introduction",
      lessonId: 4,
      courseTitle: "Les bases",
      moduleTitle: "Module 1",
      moduleId: 3,
    },
  ],
};

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

describe("Liste de la médiathèque", () => {
  it("affiche les informations dans une ligne et expose ses deux actions", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const onPreview = vi.fn();
    const onShowActivities = vi.fn();

    act(() => {
      root?.render(
        <MediaList
          medias={[media]}
          onPreview={onPreview}
          onShowActivities={onShowActivities}
        />,
      );
    });

    expect(container.textContent).toContain("illustration.png");
    expect(container.textContent).not.toContain("2 utilisations");

    const previewButton = container.querySelector(
      'button[aria-label="Afficher un aperçu de illustration.png"]',
    );
    const activitiesButton = container.querySelector(
      'button[aria-label="Voir les activités associées à illustration.png"]',
    );
    expect(activitiesButton?.textContent).toBe("1");

    act(() =>
      previewButton?.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
    act(() =>
      activitiesButton?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      ),
    );

    expect(onPreview).toHaveBeenCalledWith(media);
    expect(onShowActivities).toHaveBeenCalledWith(media);
  });

  it("produit un aperçu adapté au type de média", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(<MediaPreview media={media} />);
    });

    const image = container.querySelector("img");
    expect(image?.getAttribute("alt")).toBe("illustration.png");
    expect(image?.getAttribute("src")).toContain(
      "activities/images/illustration-7.png",
    );
  });
});
