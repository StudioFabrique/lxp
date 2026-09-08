import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PageWrapper from "./PageWrapper";

describe("PageWrapper", () => {
  it("uniformise l'espacement vertical des pages", () => {
    const markup = renderToStaticMarkup(
      <PageWrapper className="items-center">
        <div>En-tête</div>
        <div>Contenu</div>
      </PageWrapper>,
    );

    expect(markup).toContain("flex w-full flex-col gap-4 items-center");
  });

  it("conserve l'élément sémantique demandé", () => {
    const markup = renderToStaticMarkup(
      <PageWrapper as="form" aria-label="Formulaire de page" />,
    );

    expect(markup).toContain("<form");
    expect(markup).toContain('aria-label="Formulaire de page"');
  });
});
