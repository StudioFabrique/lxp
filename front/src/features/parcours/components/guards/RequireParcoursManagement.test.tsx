import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RequireParcoursManagement from "./RequireParcoursManagement";

const queryState = vi.hoisted(() => ({ canManage: false }));

vi.mock("../../hooks/useParcoursQuery", () => ({
  useParcoursQuery: () => ({
    data: { canManage: queryState.canManage },
    isLoading: false,
    isError: false,
  }),
}));

describe("RequireParcoursManagement", () => {
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
  });

  const renderRoute = async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/admin/parcours/edit/42"]}>
          <Routes>
            <Route
              path="/admin/parcours/edit/:id"
              element={<RequireParcoursManagement />}
            >
              <Route index element={<p>éditeur du parcours</p>} />
            </Route>
            <Route path="/access-denied" element={<p>accès refusé</p>} />
          </Routes>
        </MemoryRouter>,
      );
    });
  };

  it("refuse l'éditeur pour un parcours seulement consultable", async () => {
    queryState.canManage = false;
    await renderRoute();
    expect(container.textContent).toContain("accès refusé");
  });

  it("ouvre l'éditeur pour un parcours gérable", async () => {
    queryState.canManage = true;
    await renderRoute();
    expect(container.textContent).toContain("éditeur du parcours");
  });
});
