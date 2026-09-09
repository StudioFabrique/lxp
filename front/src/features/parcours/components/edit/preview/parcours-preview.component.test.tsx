import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext } from "../../../../../store/AuthProvider";
import type User from "../../../../../utils/interfaces/user";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import ParcoursPreview from "./parcours-preview.component";

vi.mock("./parcours-preview-infos.component", () => ({
  default: () => null,
}));
vi.mock("./parcours-preview-modules.component", () => ({
  default: () => null,
}));
vi.mock("./parcours-preview-student", () => ({ default: () => null }));
vi.mock("../../../../../components/preview/preview-objectives", () => ({
  default: () => null,
}));
vi.mock("../../../../../components/preview/preview-skills", () => ({
  default: () => null,
}));
vi.mock("../../../hooks/useValidateParcours", () => ({
  default: () => ({ validateParcours: vi.fn() }),
}));
vi.mock("../../../hooks/useParcoursQuery", () => ({
  useParcoursQuery: vi.fn(),
}));
vi.mock("../../../hooks/useParcoursSkills", () => ({
  useParcoursSkills: () => ({ skills: [] }),
}));
vi.mock("../../../hooks/useParcoursGroupsQuery", () => ({
  useParcoursGroupsQuery: () => ({ data: [] }),
}));
vi.mock("../../../hooks/useParcoursStudentsQuery", () => ({
  useParcoursStudentsQuery: () => ({ data: [] }),
}));

const renderPreview = (rank: number, isPublished: boolean) => {
  vi.mocked(useParcoursQuery).mockReturnValue({
    data: { isPublished, objectives: [] },
  } as unknown as ReturnType<typeof useParcoursQuery>);

  const auth = {
    user: { roles: [{ rank }] } as User,
  } as React.ContextType<typeof AuthContext>;

  return renderToStaticMarkup(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={["/admin/parcours/edit/12?step=7"]}>
        <Routes>
          <Route
            path="/admin/parcours/edit/:id"
            element={<ParcoursPreview onEdit={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe("ParcoursPreview", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["administrateur", 1],
    ["teacher", 2],
  ])(
    "affiche l'action de consultation d'un parcours publié pour un %s",
    (_role, rank) => {
      const markup = renderPreview(rank, true);

      expect(markup).toContain("Consulter le parcours");
      expect(markup).not.toContain("Sauvegarder comme brouillon");
    },
  );

  it("conserve l'action de publication d'un brouillon pour un administrateur", () => {
    expect(renderPreview(1, false)).toContain(">Publier</button>");
  });

  it("ne permet pas à un teacher de publier un brouillon", () => {
    const markup = renderPreview(2, false);

    expect(markup).not.toContain(">Publier</button>");
    expect(markup).not.toContain("Consulter le parcours");
  });
});
