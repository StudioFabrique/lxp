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
});
