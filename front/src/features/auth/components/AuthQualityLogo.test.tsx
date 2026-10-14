import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import AuthQualityLogo from "./AuthQualityLogo";

describe("quality logo", () => {
  it("colors every dark shape with the tile color and preserves white details", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    try {
      for (let color = 0; color < 3; color++) {
        act(() => root.render(<AuthQualityLogo color={color} />));
        const svg = container.querySelector("svg")!;
        const fills = [...svg.querySelectorAll("path")].map((path) => path.getAttribute("fill"));
        expect(svg.getAttribute("aria-label")).toBe("ANDRIA");
        expect(fills).toEqual([
          "currentColor", "currentColor", "currentColor", "#FFFFFF", "#FFFFFF",
          "#FFFFFF", "#FFFFFF", "currentColor", "currentColor",
        ]);
        expect(svg.getAttribute("style")).toContain(
          ["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)"][color],
        );
      }
    } finally { act(() => root.unmount()); }
  });
});
