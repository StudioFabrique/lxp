import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HierarchicalListCard from "./HierarchicalListCard";

describe("HierarchicalListCard", () => {
  it("laisse les tooltips dépasser sans laisser déborder le halo", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <HierarchicalListCard
        title="Module"
        action={
          <button className="tooltip tooltip-left" data-tip="Modifier">
            Modifier
          </button>
        }
      />,
    );

    const card = container.firstElementChild;
    const glowMask = card?.firstElementChild;
    const list = card?.querySelector("ul");

    expect(card?.classList.contains("overflow-visible")).toBe(true);
    expect(card?.classList.contains("hover:z-10")).toBe(true);
    expect(glowMask?.classList.contains("overflow-hidden")).toBe(true);
    expect(list?.classList.contains("overflow-visible")).toBe(true);
  });
});
