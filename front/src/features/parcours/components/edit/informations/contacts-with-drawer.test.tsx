import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactsWithDrawer from "./contacts-with-drawer";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";

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
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const renderWithModules = async (
    modules: { id: number; contacts: typeof contact[] }[],
    loading = false,
    contacts = [contact],
    onAssignToModules = vi.fn(),
  ) => {
    mockUseParcoursQuery.mockReturnValue({
      data: { contacts, modules },
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
                    loading={loading}
                    onSubmit={vi.fn()}
                    onAssignToModules={onAssignToModules}
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

  it("indique que l'ajout est encore en cours", async () => {
    await renderWithModules([{ id: 10, contacts: [] }], true);

    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      "Enregistrement des ressources pédagogiques en cours",
    );
  });

  it("bloque la sélection et l'affectation pendant l'enregistrement puis les réactive", async () => {
    const onAssign = vi.fn();
    const modules = [{ id: 10, contacts: [] }];
    const getButton = (label: string) =>
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes(label),
      )!;

    await renderWithModules(modules, true, [contact], onAssign);

    expect(getButton("Sélectionner").disabled).toBe(true);
    expect(getButton("Affecter à plusieurs modules").disabled).toBe(true);
    act(() => {
      getButton("Sélectionner").click();
      getButton("Affecter à plusieurs modules").click();
    });
    expect(container.querySelector<HTMLInputElement>("#add-contacts")?.checked).toBe(false);
    expect(onAssign).not.toHaveBeenCalled();

    await renderWithModules(modules, false, [contact], onAssign);
    expect(getButton("Sélectionner").disabled).toBe(false);
    expect(getButton("Affecter à plusieurs modules").disabled).toBe(false);
    act(() => getButton("Affecter à plusieurs modules").click());
    expect(onAssign).toHaveBeenCalledWith(contact);
  });

  it("bloque les actions dès l'attente de l'enregistrement automatique", async () => {
    vi.useFakeTimers();
    await renderWithModules([{ id: 10, contacts: [] }], false, [
      contact,
      { ...contact, id: 2, idMdb: "contact-2" },
    ]);

    act(() => {
      container.querySelector<HTMLElement>('[aria-label="supprimer l\'objet"]')!.click();
    });

    expect(container.querySelector('[role="status"]')).not.toBeNull();
    const buttons = Array.from(container.querySelectorAll("button")).filter(
      (button) => /Sélectionner|Affecter à plusieurs modules/.test(button.textContent ?? ""),
    );
    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => button.disabled)).toBe(true);

    await act(async () => vi.advanceTimersByTime(autoSubmitTimer));
    expect(container.querySelector('[role="status"]')).toBeNull();
    expect(buttons.every((button) => !button.disabled)).toBe(true);
  });
});
