import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import MobileActivityNavigation from "./mobile-activity-navigation";

describe("MobileActivityNavigation", () => {
  it("affiche la position de l'activité à gauche des boutons, au milieu de l'espace libre de la barre", () => {
    const markup = renderToStaticMarkup(
      <MobileActivityNavigation
        isFirstActivitySelected={false}
        position={{ current: 2, total: 5 }}
        next={{ label: "Activité suivante", onClick: vi.fn() }}
        onPreviousActivity={vi.fn()}
      />,
    );

    expect(markup).toContain("2/5");
    expect(markup).toContain('aria-label="Activité 2 sur 5"');
    expect(markup).toContain("flex-1");
    expect(markup.indexOf("2/5")).toBeLessThan(
      markup.indexOf("Activité précédente"),
    );
  });
});
