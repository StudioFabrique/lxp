import { describe, expect, it } from "vitest";
import { formatTitle, toTitleCase } from "./text-helpers";

describe("display casing", () => {
  it("capitalizes compound names including accents and apostrophes", () => {
    expect(toTitleCase("ÉLODIE JEAN-PIERRE d’arc")).toBe("Élodie Jean-Pierre D’Arc");
    expect(toTitleCase("")).toBe("");
  });
  it("uses an initial capital for headings and preserves acronyms", () => {
    expect(formatTitle("les bases du numérique")).toBe("Les bases du numérique");
    expect(formatTitle("découvrir JavaScript et les API")).toBe("Découvrir JavaScript et les API");
    expect(formatTitle(null)).toBe("");
  });
});
