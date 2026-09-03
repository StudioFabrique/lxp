import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { ModuleListItem } from "../../api/module.api";
import { AuthContext } from "../../../../store/AuthProvider";
import type User from "../../../../utils/interfaces/user";
import ModuleHomeList from "./module-home";

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./module-header", () => ({
  default: () => <h1>Liste des modules</h1>,
}));

const module: ModuleListItem = {
  id: 1,
  title: "Module principal",
  parcoursId: 2,
  parcours: "Parcours associé",
  formation: "Formation associée",
  courses: [
    {
      id: 4,
      title: "Premier cours",
      order: 0,
      isPublished: true,
      firstLessonId: 6,
    },
    {
      id: 5,
      title: "Deuxième cours",
      order: 1,
      isPublished: false,
    },
  ],
};

describe("ModuleHomeList", () => {
  it("affiche chaque module avec ses cours en sous-éléments", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ModuleHomeList modulesList={[module]} onDeleteModule={vi.fn()} />
      </MemoryRouter>,
    );

    expect(markup).toContain("Module principal");
    expect(markup).toContain("Premier cours");
    expect(markup).toContain("Deuxième cours");
    expect(markup).toContain("/admin/parcours/module/1");
  });

  it("indique au formateur qu'aucun module ne lui est affecté", () => {
    const auth = {
      user: { roles: [{ rank: 2 }] } as User,
    } as React.ContextType<typeof AuthContext>;
    const markup = renderToStaticMarkup(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <ModuleHomeList modulesList={[]} onDeleteModule={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("Aucun module affecté");
  });

  it("affiche les modules du formateur sur toute la largeur", () => {
    const auth = {
      user: { roles: [{ rank: 2 }] } as User,
    } as React.ContextType<typeof AuthContext>;
    const markup = renderToStaticMarkup(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <ModuleHomeList modulesList={[module]} onDeleteModule={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("grid-cols-1");
    expect(markup).not.toContain("xl:grid-cols-3");
    expect(markup).not.toContain("min-h-52");
  });
});
