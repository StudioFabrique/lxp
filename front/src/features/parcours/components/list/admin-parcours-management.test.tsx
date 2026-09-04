import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../../../../store/AuthProvider";
import type User from "../../../../utils/interfaces/user";
import type { FormationParcoursSummary } from "../../../dashboard-admin/interfaces/parcours-summary";
import AdminParcoursManagement from "./admin-parcours-management";

const formation: FormationParcoursSummary = {
  id: 1,
  title: "Formation test",
  level: "5",
  parcours: [
    {
      id: 11,
      title: "Parcours test",
      startDate: null,
      endDate: null,
      isPublished: false,
      thumb: null,
    },
  ],
};

const renderPage = (
  layout: "admin" | "student",
  rank?: number,
  formations: FormationParcoursSummary[] = [],
) => {
  const queryClient = new QueryClient();
  const auth = {
    user: rank === undefined ? null : ({ roles: [{ rank }] } as User),
  } as React.ContextType<typeof AuthContext>;

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <AdminParcoursManagement formations={formations} layout={layout} />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
};

describe("AdminParcoursManagement", () => {
  it("utilise l'état vide partagé sur la page Gestion des parcours", () => {
    expect(renderPage("admin")).toContain("Aucun parcours disponible");
  });

  it("utilise aussi l'état vide partagé sur la page étudiante", () => {
    const markup = renderPage("student");

    expect(markup).toContain("Aucun parcours disponible");
    expect(markup).toContain("min-h-[50vh]");
  });

  it("affiche les parcours du formateur sur toute la largeur", () => {
    const markup = renderPage("admin", 2, [formation]);

    expect(markup).toContain("grid-cols-1");
    expect(markup).not.toContain("xl:grid-cols-3");
    expect(markup).not.toContain("min-h-52");
  });

  it("conserve la grille de cartes pour un administrateur", () => {
    const markup = renderPage("admin", 1, [formation]);

    expect(markup).toContain("xl:grid-cols-3");
    expect(markup).toContain("min-h-52");
  });
});
