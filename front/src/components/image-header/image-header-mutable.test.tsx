import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ImageHeaderMutable from "./image-header-mutable";

describe("ImageHeaderMutable", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("garde le contenu du bandeau sous les modales", () => {
    act(() => {
      root.render(
        <ImageHeaderMutable
          defaultImage="/images/parcours-default.webp"
          title="Parcours test"
          parentTitle="Formation test"
          onUpdateImage={vi.fn()}
        >
          <span aria-hidden="true" />
        </ImageHeaderMutable>,
      );
    });

    const headerContent = container.querySelector("h1")?.closest(".absolute");

    expect(headerContent?.classList.contains("z-5")).toBe(true);
    expect(headerContent?.classList.contains("z-50")).toBe(false);
  });

  it("affiche une majuscule initiale pour la formation et le parcours", () => {
    act(() => {
      root.render(
        <ImageHeaderMutable
          defaultImage="/images/parcours-default.webp"
          title="promo réceptionniste 2026 - 2027"
          parentTitle="réceptionniste en hôtellerie"
          onUpdateImage={vi.fn()}
          isPublished
        >
          <span aria-hidden="true" />
        </ImageHeaderMutable>,
      );
    });

    expect(container.querySelector("h1")?.textContent).toBe("Réceptionniste en hôtellerie ");
    expect(container.querySelector("h3")?.textContent).toBe("Promo réceptionniste 2026 - 2027");
  });
});
