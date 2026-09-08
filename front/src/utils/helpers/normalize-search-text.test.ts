import { describe, expect, it } from "vitest";

import { normalizeSearchText } from "./normalize-search-text";

describe("normalizeSearchText", () => {
  it("ignore les accents, la casse et les espaces extérieurs", () => {
    expect(normalizeSearchText("  Développement ÉCO  ")).toBe(
      "developpement eco",
    );
  });
});

