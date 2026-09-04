import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import LastParcoursItem from "./last-parcours-item";

vi.mock("../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../../parcours/components/list/parcours-actions-menu", () => ({
  default: ({ parcours }: { parcours: { id: number } }) => (
    <span data-testid={`parcours-actions-${parcours.id}`} />
  ),
}));

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

const renderCard = (
  props: Partial<React.ComponentProps<typeof LastParcoursItem>> = {},
) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <LastParcoursItem formation={formation} {...props} />
    </MemoryRouter>,
  );

describe("LastParcoursItem", () => {
  it("affiche le menu d'actions dans la gestion administrateur", () => {
    const markup = renderCard({
      isManagementView: true,
      baseRoute: "admin",
      onDeleteParcours: vi.fn(),
    });

    expect(markup).toContain('data-testid="parcours-actions-11"');
  });

  it("conserve la prévisualisation simple sur le dashboard", () => {
    const markup = renderCard({ baseRoute: "admin" });

    expect(markup).not.toContain("parcours-actions-11");
    expect(markup).toContain("Prévisualiser le parcours Parcours test");
    expect(markup).toContain("min-h-52");
  });

  it("n'ajoute pas de tooltip aux sous-éléments", () => {
    const markup = renderCard();

    expect(markup).not.toContain("tooltip");
    expect(markup).not.toContain('data-tip="Parcours test"');
  });

  it("ne montre pas le menu d'administration dans la vue étudiante", () => {
    const markup = renderCard({
      isManagementView: true,
      baseRoute: "student",
      onDeleteParcours: vi.fn(),
    });

    expect(markup).not.toContain("parcours-actions-11");
    expect(markup).toContain("/student/parcours/view/11");
    expect(markup).not.toContain("min-h-52");
    expect(markup).not.toContain('data-tip="Parcours test"');
  });

  it("utilise aussi la pleine largeur dans l'espace formateur", () => {
    const markup = renderCard({ baseRoute: "admin", fullWidth: true });

    expect(markup).toContain("/admin/parcours/view/11");
    expect(markup).not.toContain("min-h-52");
    expect(markup).not.toContain("Ajouter un parcours");
    expect(markup).not.toContain('data-tip="Parcours test"');
  });
});
