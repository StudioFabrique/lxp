import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../../../store/AuthProvider";
import type User from "../../../utils/interfaces/user";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import LastParcours from "./last-parcours";

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

const renderDashboardList = (rank: number) => {
  const auth = {
    user: { roles: [{ rank }] } as User,
  } as React.ContextType<typeof AuthContext>;

  return renderToStaticMarkup(
    <AuthContext.Provider value={auth}>
      <MemoryRouter>
        <LastParcours parcours={[formation]} isLoading={false} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe("LastParcours", () => {
  it("affiche l’état vide partagé sur le dashboard formateur", () => {
    const auth = {
      user: { roles: [{ rank: 2 }] } as User,
    } as React.ContextType<typeof AuthContext>;
    const markup = renderToStaticMarkup(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <LastParcours parcours={[]} isLoading={false} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("Aucun parcours disponible");
  });

  it("affiche la liste du formateur sur toute la largeur", () => {
    const markup = renderDashboardList(2);

    expect(markup).toContain("grid-cols-1");
    expect(markup).not.toContain("xl:grid-cols-3");
    expect(markup).not.toContain("min-h-52");
  });

  it("conserve la grille du dashboard administrateur", () => {
    const markup = renderDashboardList(1);

    expect(markup).toContain("xl:grid-cols-3");
    expect(markup).toContain("min-h-52");
  });
});
