import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import AuthQualityLogo from "./AuthQualityLogo";

describe("quality logo", () => {
  it("highlights each ANDRIA letter, including the two separate A letters", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    try {
      const regions = [0, 41, 84, 123, 162, 192];
      for (let quality = 0; quality < 6; quality++) {
        act(() => root.render(<AuthQualityLogo quality={quality} />));
        expect(container.querySelector("clipPath rect")?.getAttribute("x")).toBe(String(regions[quality]));
        const overlay = container.querySelector(`[data-highlight-letter="${quality}"]`)!;
        expect(overlay.querySelectorAll("path")).toHaveLength(quality < 4 ? 1 : 2);
        expect(container.querySelectorAll("svg > path")).toHaveLength(9);
        expect(container.querySelectorAll("svg > path")[1].getAttribute("fill")).toBe("#0F172A");
        expect(container.querySelector("[data-highlight-backdrop]")).toBeNull();
        expect(overlay.getAttribute("filter")).toBeNull();
        expect(overlay.getAttribute("clip-path")).toContain(container.querySelector("clipPath")!.id);
      }
    } finally { act(() => root.unmount()); }
  });
});
