import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type Module from "../../../../../utils/interfaces/module";
import Contenu from "./contenu";

vi.mock("../../../hooks/useParcoursQuery", () => ({
  useParcoursQuery: () => ({ data: { canManage: false } }),
}));

vi.mock("./contenu-item", () => ({
  default: ({ module }: { module: Module }) => (
    <div data-testid="module-row">{module.title}</div>
  ),
}));

vi.mock("./contenu-detail/contenu-detail", () => ({
  default: () => null,
}));

vi.mock("./contenu-detail/contenu-detail-header", () => ({
  default: () => null,
}));

const modules = Array.from({ length: 7 }, (_, index) =>
  ({
    id: index + 1,
    title: `Module ${index + 1}`,
    description: "",
    duration: 1,
    contacts: [],
    bonusSkills: [],
    parcours: {},
    courses: [],
    tags: [],
  }) as unknown as Module,
);

describe("Contenu du parcours", () => {
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

  it("affiche cinq modules avant la demande d'extension", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/admin/parcours/view/42"]}>
          <Routes>
            <Route
              path="/admin/parcours/view/:id"
              element={<Contenu modules={modules} />}
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    expect(
      container.querySelectorAll('[data-testid="module-row"]'),
    ).toHaveLength(5);

    const showMore = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Afficher plus"),
    );
    expect(showMore).toBeDefined();

    await act(async () => showMore?.click());
    expect(
      container.querySelectorAll('[data-testid="module-row"]'),
    ).toHaveLength(7);
    expect(container.textContent).toContain("Afficher moins");
  });
});
