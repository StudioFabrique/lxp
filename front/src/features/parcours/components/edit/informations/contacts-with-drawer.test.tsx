import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactsWithDrawer from "./contacts-with-drawer";

const { mockUseParcoursQuery, mockUseParcoursContactsQuery } = vi.hoisted(() => ({
  mockUseParcoursQuery: vi.fn(),
  mockUseParcoursContactsQuery: vi.fn(),
}));

vi.mock("../../../hooks/useParcoursQuery", () => ({
  useParcoursQuery: mockUseParcoursQuery,
}));

vi.mock("../../../hooks/useParcoursContactsQuery", () => ({
  useParcoursContactsQuery: mockUseParcoursContactsQuery,
}));

const contact = {
  id: 1,
  idMdb: "contact-1",
  firstname: "Jeanne",
  lastname: "Dupont",
  role: "formatrice",
};

describe("Affectation des ressources pédagogiques aux modules", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    mockUseParcoursContactsQuery.mockReturnValue({ data: [contact] });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  const renderWithModules = async (modules: { id: number; contacts: typeof contact[] }[]) => {
    mockUseParcoursQuery.mockReturnValue({
      data: { contacts: [contact], modules },
    });

    await act(async () => {
      root.render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={["/admin/parcours/edit/42"]}>
            <Routes>
              <Route
                path="/admin/parcours/edit/:id"
                element={
                  <ContactsWithDrawer
                    loading={false}
                    onSubmit={vi.fn()}
                    onAssignToModules={vi.fn()}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });
  };

  it("masque l'action quand la ressource est affectée à tous les modules", async () => {
    await renderWithModules([
      { id: 10, contacts: [contact] },
      { id: 20, contacts: [contact] },
    ]);

    expect(container.textContent).toContain("Jeanne Dupont");
    expect(container.textContent).not.toContain("Affecter à plusieurs modules");
  });

  it("affiche l'action quand un module reste disponible", async () => {
    await renderWithModules([
      { id: 10, contacts: [contact] },
      { id: 20, contacts: [] },
    ]);

    expect(container.textContent).toContain("Affecter à plusieurs modules");
  });
});
