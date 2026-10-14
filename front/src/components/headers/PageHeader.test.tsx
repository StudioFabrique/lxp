import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it("affiche le titre, la description et les actions", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/admin/tags"]}>
        <PageHeader title="Liste des tags" description="Gérez vos tags">
          <button type="button">Créer un tag</button>
        </PageHeader>
      </MemoryRouter>,
    );

    expect(markup).toContain("Gérez vos tags");
    expect(markup).toContain("Créer un tag");
    expect(markup).not.toContain("Lancer le tutoriel");
  });
});
