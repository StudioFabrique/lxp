import { describe, expect, it } from "vitest";
import { formatAccomplishmentDescription } from "./format-accomplishment-description";

describe("formatAccomplishmentDescription", () => {
  it("ajoute le sujet manquant et met le titre de la leçon en majuscule", () => {
    expect(formatAccomplishmentDescription("vient de terminer la leçon variables et types")).toBe(
      "Vous venez de terminer la leçon Variables et types",
    );
  });

  it("laisse intacte une description qui a déjà un sujet", () => {
    expect(formatAccomplishmentDescription("Vous avez terminé la leçon JavaScript")).toBe(
      "Vous avez terminé la leçon JavaScript",
    );
  });
});
