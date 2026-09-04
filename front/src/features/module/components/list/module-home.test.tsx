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

vi.mock("@radix-ui/react-dropdown-menu", () => ({
  Root: ({ children }: { children: React.ReactNode }) => children,
  Trigger: ({ children }: { children: React.ReactNode }) => children,
  Portal: ({ children }: { children: React.ReactNode }) => children,
  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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
      visibility: true,
      firstLessonId: 6,
    },
    {
      id: 5,
      title: "Deuxième cours",
      order: 1,
      isPublished: false,
      visibility: false,
    },
  ],
};

const moduleWithFourCourses: ModuleListItem = {
  ...module,
  courses: [
    ...module.courses,
    {
      id: 6,
      title: "Troisième cours",
      order: 2,
      isPublished: true,
      visibility: true,
    },
    {
      id: 7,
      title: "Quatrième cours",
      order: 3,
      isPublished: true,
      visibility: true,
    },
  ],
};

describe("ModuleHomeList", () => {
  it("affiche chaque module avec ses cours en sous-éléments", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ModuleHomeList
          modulesList={[module]}
          onDeleteModule={vi.fn()}
          onDeleteCourse={vi.fn()}
        />
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
          <ModuleHomeList
            modulesList={[]}
            onDeleteModule={vi.fn()}
            onDeleteCourse={vi.fn()}
          />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("Aucun module affecté");
  });

  it("affiche au maximum trois cours dans une carte", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ModuleHomeList
          modulesList={[moduleWithFourCourses]}
          onDeleteModule={vi.fn()}
          onDeleteCourse={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain("Troisième cours");
    expect(markup).not.toContain("Quatrième cours");
    expect(markup).toContain("Afficher plus de cours (1)");
  });

  it("affiche aussi les modules du formateur dans la grille de cartes", () => {
    const auth = {
      user: { roles: [{ rank: 2 }] } as User,
    } as React.ContextType<typeof AuthContext>;
    const markup = renderToStaticMarkup(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <ModuleHomeList
            modulesList={[module]}
            onDeleteModule={vi.fn()}
            onDeleteCourse={vi.fn()}
          />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("lg:grid-cols-2");
    expect(markup).toContain("xl:grid-cols-3");
    expect(markup).toContain("min-h-52");
  });

  it("signale les cours invisibles et affiche leurs menus d'actions", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ModuleHomeList
          modulesList={[module]}
          onDeleteModule={vi.fn()}
          onDeleteCourse={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain('aria-label="Cours invisible"');
    expect(markup).not.toContain('data-tip="Cours invisible"');
    expect(markup).toContain('aria-label="Actions pour Premier cours"');
    expect(markup).toContain('aria-label="Actions pour Deuxième cours"');
    expect(markup).toContain('data-actions-count="3"');
    expect(markup).toContain("Accéder au cours");
    expect(markup).toContain("Modifier le cours");
    expect(markup).toContain("Supprimer le cours");
    expect(markup).toContain("ml-auto self-center justify-self-end");
  });
});
