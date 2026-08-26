import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import ItemElement from "./item-element.component";

describe("ItemElement", () => {
  it("met en majuscule la première lettre même après des espaces", () => {
    const container = document.createElement("div");
    const root: Root = createRoot(container);

    try {
      act(() => {
        root.render(
          <ItemElement
            item={{ id: 1, description: "  élément pédagogique" }}
            property="description"
            onRemoveItem={vi.fn()}
          />,
        );
      });

      expect(container.querySelector("p")?.textContent).toBe(
        "  Élément pédagogique",
      );
    } finally {
      act(() => root.unmount());
    }
  });
});
