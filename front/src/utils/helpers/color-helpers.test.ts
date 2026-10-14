import { describe, expect, it } from "vitest";

import { readableTextColor } from "./color-helpers";

describe("readableTextColor", () => {
  it("choisit un texte sombre sur un fond clair et clair sur un fond sombre", () => {
    expect(readableTextColor("#ffffff")).toBe("#1a1a1a");
    expect(readableTextColor("#fc0")).toBe("#1a1a1a");
    expect(readableTextColor("#102235")).toBe("#ffffff");
    expect(readableTextColor("rgb(20, 30, 40)")).toBe("#ffffff");
  });

  it("ne devine pas une couleur qu'il ne reconnaît pas", () => {
    expect(readableTextColor("")).toBeUndefined();
    expect(readableTextColor("var(--color-primary)")).toBeUndefined();
  });
});
