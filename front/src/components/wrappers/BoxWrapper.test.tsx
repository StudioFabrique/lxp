import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BoxWrapper from "./BoxWrapper";

describe("BoxWrapper", () => {
  it("retire l'encadré lorsque la variante sans style est utilisée", () => {
    const markup = renderToStaticMarkup(
      <BoxWrapper unstyled>
        <p>Contenu vide</p>
      </BoxWrapper>,
    );

    expect(markup).toContain("Contenu vide");
    expect(markup).not.toContain("bg-secondary/20");
    expect(markup).not.toContain("rounded-lg");
    expect(markup).not.toContain("p-5");
  });

  it("fusionne className avec les styles par défaut", () => {
    const markup = renderToStaticMarkup(
      <BoxWrapper className="h-auto p-2">Contenu</BoxWrapper>,
    );

    expect(markup).toContain("h-auto");
    expect(markup).not.toContain("h-full");
    expect(markup).toContain("p-2");
    expect(markup).not.toContain("p-5");
  });
});
