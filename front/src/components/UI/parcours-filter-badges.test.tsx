import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ParcoursFilterBadges from "./parcours-filter-badges";

describe("ParcoursFilterBadges", () => {
  it.each([
    { parcours: [] },
    { parcours: ["Parcours A"] },
    { parcours: ["Parcours A", "Parcours A"] },
  ])(
    "masque les filtres avec au plus un parcours distinct : %j",
    ({ parcours }) => {
      const markup = renderToStaticMarkup(
        <ParcoursFilterBadges
          parcours={parcours}
          selectedParcours={null}
          onSelect={vi.fn()}
        />,
      );

      expect(markup).toBe("");
    },
  );

  it("affiche cinq parcours puis un badge secondaire pour voir la suite", () => {
    const markup = renderToStaticMarkup(
      <ParcoursFilterBadges
        parcours={[
          "Parcours F",
          "Parcours E",
          "Parcours D",
          "Parcours C",
          "Parcours B",
          "Parcours A",
          "Parcours A",
        ]}
        selectedParcours={null}
        onSelect={vi.fn()}
      />,
    );

    expect(markup).toContain("Tous les parcours");
    expect(markup).toContain("Parcours A");
    expect(markup).toContain("Parcours E");
    expect(markup).not.toContain("Parcours F");
    expect(markup).toContain("Afficher plus de parcours (1)");
    expect(markup).toContain("btn-secondary btn-soft btn-sm");
    expect(markup).toContain('aria-expanded="false"');
  });

  it("garde visible un parcours sélectionné au-delà des cinq premiers", () => {
    const markup = renderToStaticMarkup(
      <ParcoursFilterBadges
        parcours={[
          "Parcours A",
          "Parcours B",
          "Parcours C",
          "Parcours D",
          "Parcours E",
          "Parcours F",
        ]}
        selectedParcours="Parcours F"
        onSelect={vi.fn()}
      />,
    );

    expect(markup).toContain("Parcours F");
    expect(markup).toContain('aria-pressed="true"');
  });
});
