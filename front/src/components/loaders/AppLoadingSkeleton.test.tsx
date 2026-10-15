import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import AppLoadingSkeleton from "./AppLoadingSkeleton";

const roots: Root[] = [];

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("AppLoadingSkeleton", () => {
  it("dessine une barre du haut sur mobile et la colonne de navigation dès `md`", () => {
    window.history.pushState({}, "", "/admin/user");
    const container = document.createElement("div");
    const root = createRoot(container);
    roots.push(root);
    act(() => root.render(<AppLoadingSkeleton />));

    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("hidden");
    expect(aside?.className).toContain("md:flex");

    const topBar = container.querySelector(".md\\:hidden");
    expect(topBar).not.toBeNull();
    expect(topBar?.querySelectorAll(".skeleton")).toHaveLength(3);
  });
});
