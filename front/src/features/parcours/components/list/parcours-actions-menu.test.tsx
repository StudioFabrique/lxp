import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AuthContext } from "../../../../store/AuthProvider";
import type User from "../../../../utils/interfaces/user";
import type ParcoursSummary from "../../../dashboard-admin/interfaces/parcours-summary";
import ParcoursActionsMenu from "./parcours-actions-menu";

vi.mock("@radix-ui/react-dropdown-menu", () => ({
  Root: ({ children }: { children: ReactNode }) => children,
  Trigger: ({ children }: { children: ReactNode }) => children,
  Portal: ({ children }: { children: ReactNode }) => children,
  Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Item: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Separator: () => <hr />,
}));

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

const parcours: ParcoursSummary = {
  id: 42,
  title: "Parcours test",
  startDate: null,
  endDate: null,
  isPublished: false,
  thumb: null,
};

const renderMenu = (
  rank: number,
  parcoursOverrides: Partial<ParcoursSummary> = {},
) => {
  const user = {
    roles: [{ rank }],
  } as User;
  const auth = {
    user,
  } as React.ContextType<typeof AuthContext>;

  return renderToStaticMarkup(
    <AuthContext.Provider value={auth}>
      <MemoryRouter>
        <ParcoursActionsMenu
          parcours={{ ...parcours, ...parcoursOverrides }}
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe("ParcoursActionsMenu", () => {
  it("masque la suppression pour un teacher", () => {
    expect(renderMenu(2)).not.toContain("Supprimer");
  });

  it("affiche la suppression pour un administrateur", () => {
    expect(renderMenu(1)).toContain("Supprimer");
  });

  it("permet d'accéder directement à l'étape de publication d'un brouillon", () => {
    const markup = renderMenu(1);

    expect(markup).toContain("Publier");
    expect(markup).toContain("/admin/parcours/edit/42?step=7");
  });

  it("masque l'action de publication pour un parcours déjà publié", () => {
    expect(renderMenu(1, { isPublished: true })).not.toContain("Publier");
  });
});
