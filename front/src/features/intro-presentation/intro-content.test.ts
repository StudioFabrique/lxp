import { describe, expect, it } from "vitest";

import { buildIntroCards, INTRO_ROW_COUNT } from "./intro-content";
import { INTRO_LEVELS } from "./intro-levels";

describe("buildIntroCards", () => {
  it("ne produit que des exemples sans contenu réel", () => {
    const cards = buildIntroCards();

    expect(cards).toHaveLength(INTRO_LEVELS.length);
    expect(cards.map((card) => card.levelId)).toEqual(
      INTRO_LEVELS.map((level) => level.id),
    );
    expect(cards.every((card) => card.isPlaceholder)).toBe(true);
    // Les types d'activités du dernier niveau sont réels, pas des exemples.
    cards.slice(0, -1).forEach((card) => {
      expect(card.rows).toHaveLength(INTRO_ROW_COUNT);
      expect(card.rows.every((row) => row.isPlaceholder)).toBe(true);
    });
    expect(cards[cards.length - 1].rows.every((row) => !row.isPlaceholder)).toBe(true);
  });

  it("utilise le contenu réel et complète par des exemples", () => {
    const cards = buildIntroCards({
      organisationName: "Mon école",
      formationTitles: ["Formation A"],
      parcoursTitles: ["Parcours A", "Parcours B"],
      moduleTitles: ["Module A"],
    });

    expect(cards[0]).toMatchObject({ title: "Mon école", isPlaceholder: false });
    expect(cards[1]).toMatchObject({ title: "Formation A", isPlaceholder: false });
    expect(cards[2].title).toBe("Parcours A");
    expect(cards[1].rows.map((row) => row.title)).toEqual([
      "Parcours A",
      "Parcours B",
      "Parcours 3 (exemple)",
    ]);
    expect(cards[1].rows.map((row) => row.isPlaceholder)).toEqual([
      false,
      false,
      true,
    ]);
    expect(cards[3]).toMatchObject({ title: "Module A", isPlaceholder: false });
    expect(cards[4].isPlaceholder).toBe(true);
  });

  it("nomme les activités par leur titre puis par leur type", () => {
    const cards = buildIntroCards({
      lessonTitles: ["Leçon A"],
      activities: [{ title: "  Lire le cours ", type: "text" }, { type: "video" }],
    });

    expect(cards[5].rows.map((row) => row.title)).toEqual([
      "Lire le cours",
      "Vidéo",
      "Activité 3 (exemple)",
    ]);
    expect(cards[6].title).toBe("Lire le cours");
  });

  it("ignore les titres vides et limite le nombre de lignes", () => {
    const cards = buildIntroCards({
      parcoursTitles: ["  ", "A", "B", "C", "D"],
    });

    expect(cards[1].rows.map((row) => row.title)).toEqual(["A", "B", "C"]);
    expect(cards[2].title).toBe("A");
  });

  it("donne à chaque niveau ses composants, réels quand ils sont connus", () => {
    const cards = buildIntroCards({
      details: { "parcours.tags": ["  Web ", ""] },
    });

    const tags = cards[2].details.find((detail) => detail.id === "parcours.tags");
    expect(tags).toMatchObject({ isPlaceholder: false });
    expect(tags?.items.map((item) => item.title)).toEqual(["Web"]);
    const groups = cards[2].details.find((detail) => detail.id === "parcours.groupes");
    expect(groups?.isPlaceholder).toBe(true);
    expect(groups?.items.every((item) => item.isPlaceholder)).toBe(true);
    // L'organisme n'a que son titre : pas de composants.
    expect(cards[0].details).toEqual([]);
    // Le dernier niveau n'a que ses types d'activités.
    expect(cards[6].details).toEqual([]);
    cards.slice(1, -1).forEach((card) => expect(card.details.length).toBeGreaterThan(0));
  });
});
