import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it("affiche le déclencheur du tutoriel à droite du contenu", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/admin/tags"]}>
        <PageHeader title="Liste des tags">
          <button type="button">Créer un tag</button>
        </PageHeader>
      </MemoryRouter>,
    );

    expect(markup).toContain('data-page-tour="header-actions"');
    expect(markup.indexOf("Créer un tag")).toBeLessThan(
      markup.indexOf("Lancer le tutoriel : Liste des tags"),
    );
    expect(markup).toContain('data-tip="Découvrir cette page"');
  });
});
