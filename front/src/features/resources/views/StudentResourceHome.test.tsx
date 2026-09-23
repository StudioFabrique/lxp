import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import StudentResourceHome from "./StudentResourceHome";
import useStudentResources from "../hooks/useStudentResources";

vi.mock("../hooks/useStudentResources", () => ({ default: vi.fn() }));

const render = (state: Partial<ReturnType<typeof useStudentResources>>) => {
  vi.mocked(useStudentResources).mockReturnValue({
    page: 1,
    totalPages: 0,
    dataList: [],
    setPage: vi.fn(),
    perPage: 15,
    setPerPage: vi.fn(),
    handleOnChangeValue: vi.fn(),
    searchTerm: "",
    searchError: null,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    ...state,
  });
  return renderToStaticMarkup(
    <MemoryRouter>
      <StudentResourceHome />
    </MemoryRouter>,
  );
};

describe("Ressources supplémentaires", () => {
  it("montre les cartes skeleton pendant le chargement sans afficher l'état vide", () => {
    const markup = render({ isLoading: true });
    expect(markup).toContain('aria-label="Chargement des ressources supplémentaires"');
    expect(markup).toContain("skeleton");
    expect(markup).not.toContain("Aucune ressource disponible");
  });

  it("affiche l'état vide après une réponse sans ressources", () => {
    const markup = render({});
    expect(markup).toContain("Aucune ressource disponible");
    expect(markup).not.toContain('aria-label="Chargement des ressources supplémentaires"');
  });

  it("propose de réessayer après une erreur", () => {
    const markup = render({ isError: true });
    expect(markup).toContain("Impossible de charger les ressources supplémentaires.");
    expect(markup).toContain("Réessayer");
    expect(markup).not.toContain("Aucune ressource disponible");
  });
});
