import { describe, expect, it } from "vitest";

import { buildExampleIntroCards, INTRO_EXAMPLE_FORMATIONS } from "./intro-example-formations";
import { buildIntroCards } from "./intro-content";

describe("formations de démonstration", () => {
  it.each(INTRO_EXAMPLE_FORMATIONS)("décrit une branche complète de $title sans titres génériques", ({ id, title }) => {
    const cards = buildExampleIntroCards(id, {});
    expect(cards).toHaveLength(7);
    expect(cards[1].title).toBe(title);
    expect(cards.slice(1).every((card) => card.isPlaceholder)).toBe(true);
    expect(cards.slice(1).every((card) => card.rows.length > 0)).toBe(true);
    for (const card of cards) {
      expect(card.title).not.toMatch(/\(exemple\)|^(Module|Cours|Leçon) \d/i);
      expect(card.rows.some((row) => /\(exemple\)|^(Module|Cours|Leçon) \d/i.test(row.title))).toBe(false);
    }
  });

  it("suit le module puis le cours sélectionnés dans la formation hôtelière", () => {
    const cards = buildExampleIntroCards("hotel", {
      module: { title: "Relation client", isPlaceholder: true },
      cours: { title: "Traiter une réclamation", isPlaceholder: true },
    });
    expect(cards[3].title).toBe("Relation client");
    expect(cards[4].title).toBe("Traiter une réclamation");
    expect(cards[5].title).toBe("Écouter et reformuler");
    expect(cards[5].rows[0].title).toBe("Lire : Écouter et reformuler");
  });

  it("ne complète pas une formation réelle dépourvue de parcours", () => {
    const cards = buildIntroCards({ includeExamples: false, formationTitles: ["Formation réelle"] });
    expect(cards).toHaveLength(2);
    expect(cards[1]).toMatchObject({ title: "Formation réelle", rows: [], details: [], isPlaceholder: false });
  });
});
