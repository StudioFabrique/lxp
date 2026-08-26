import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import ItemElement from "./item-element.component";

describe("ItemElement", () => {
  it("applique la variante Tailwind à la première lettre", () => {
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

      const label = container.querySelector("p");

      expect(label?.textContent).toBe("  élément pédagogique");
      expect(label?.classList.contains("first-letter:uppercase")).toBe(true);
    } finally {
      act(() => root.unmount());
    }
  });
});
