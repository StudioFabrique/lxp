import { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, it, vi } from "vitest";
import NotSelectedContacts from "./not-selected-contacts";

const renderList = (
  props: React.ComponentProps<typeof NotSelectedContacts>,
  client: QueryClient,
) => (
  <QueryClientProvider client={client}>
    <MemoryRouter initialEntries={["/admin/parcours/edit/12"]}>
      <Routes>
        <Route path="/admin/parcours/edit/:id" element={<NotSelectedContacts {...props} />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

it("sélectionne tous les contacts, conserve la sélection au tri et ajoute les bons identifiants", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const client = new QueryClient();
  const onAddItems = vi.fn();
  const onCloseDrawer = vi.fn();
  try {
    await act(async () => {
      root.render(renderList({
        list: [
          { id: 1, idMdb: "one", firstname: "Martin", lastname: "D", role: "teacher" },
          { id: 2, idMdb: "two", firstname: "Alice", lastname: "A", role: "teacher" },
        ],
        onAddItems, onCloseDrawer,
      }, client));
    });
    const boxes = () => Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    await act(async () => { boxes()[0].click(); });
    expect(boxes().every((box) => box.checked)).toBe(true);
    await act(async () => { container.querySelectorAll("th")[1].click(); });
    expect(boxes().every((box) => box.checked)).toBe(true);
    await act(async () => { boxes()[1].click(); });
    expect(boxes()[0].checked).toBe(false);
    await act(async () => { boxes()[1].click(); });
    expect(boxes()[0].checked).toBe(true);
    await act(async () => { boxes()[0].click(); });
    expect(boxes().every((box) => !box.checked)).toBe(true);
    await act(async () => { boxes()[0].click(); });
    await act(async () => {
      Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Ajouter")!.click();
    });
    expect(onAddItems).toHaveBeenCalledWith([1, 2]);
    expect(onCloseDrawer).toHaveBeenCalledWith("add-contacts");
  } finally {
    act(() => root.unmount());
    client.clear();
    container.remove();
  }
});

it("n'affiche pas de formulaire de création : le lien mène à la page de création d'utilisateur", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const client = new QueryClient();
  try {
    await act(async () => {
      root.render(renderList({ list: [] }, client));
    });
    // Le rang par défaut du contexte d'authentification ne permet pas la création.
    expect(container.querySelector("a")).toBeNull();
  } finally {
    act(() => root.unmount());
    client.clear();
    container.remove();
  }
});
