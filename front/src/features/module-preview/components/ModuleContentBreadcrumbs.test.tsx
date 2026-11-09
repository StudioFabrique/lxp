import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import ModuleContentBreadcrumbs from "./ModuleContentBreadcrumbs";

describe("ModuleContentBreadcrumbs", () => {
  it("propose des liens vers la liste et le parcours, et marque le module courant", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/admin/parcours/module/7"]}>
        <ModuleContentBreadcrumbs
          parcoursId={3}
          parcoursTitle="cda 2027"
          moduleTitle="Environnement de développement"
        />
      </MemoryRouter>,
    );

    expect(markup).toContain('aria-label="Fil d&#x27;Ariane"');
    expect(markup).toContain('href="/admin/parcours"');
    expect(markup).toContain('href="/admin/parcours/view/3"');
    expect(markup).toContain("Cda 2027");
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("Environnement de développement");
  });
});
