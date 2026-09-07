import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Contacts from "./contacts";

const { mockUseParcoursQuery } = vi.hoisted(() => ({
  mockUseParcoursQuery: vi.fn(),
}));

vi.mock("../../hooks/useParcoursQuery", () => ({
  useParcoursQuery: mockUseParcoursQuery,
}));

const createContacts = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    idMdb: `contact-${index + 1}`,
    firstname: `Ressource ${index + 1}`,
    lastname: "Pédagogique",
    role: "formateur",
    email: `ressource-${index + 1}@example.com`,
    phone: "",
  }));

describe("Ressources pédagogiques du parcours", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  const renderContacts = async (count: number) => {
    mockUseParcoursQuery.mockReturnValue({
      data: { contacts: createContacts(count) },
    });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/parcours/42"]}>
          <Routes>
            <Route path="/parcours/:id" element={<Contacts />} />
          </Routes>
        </MemoryRouter>,
      );
    });
  };

  it("reste dépliée avec deux ressources", async () => {
    await renderContacts(2);

    expect(container.querySelector("details")?.open).toBe(true);
  });

  it("est repliée avec plus de deux ressources", async () => {
    await renderContacts(3);

    expect(container.querySelector("details")?.open).toBe(false);
  });
});
