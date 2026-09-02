import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type Course from "../../../../../../utils/interfaces/course";
import ContenuDetail from "./contenu-detail";
import { parcoursApi } from "../../../../api/parcours.api";

vi.mock("../../../../api/parcours.api", () => ({
  parcoursApi: {
    queries: { getCoursesByModule: vi.fn() },
    mutations: { publishCourse: vi.fn() },
  },
}));

const getCoursesByModule = vi.mocked(
  parcoursApi.queries.getCoursesByModule,
);

const courses = Array.from({ length: 3 }, (_, index) =>
  ({
    id: index + 1,
    title: `Cours test ${index + 1}`,
    lessons: [],
    isPublished: true,
    visibility: true,
  }) as unknown as Course,
);

describe("Contenu du module dans l'aperçu du parcours", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    getCoursesByModule.mockResolvedValue({ response: courses } as never);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("limite la liste à deux cours et renvoie vers l'aperçu complet du module", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/admin/parcours/view/42"]}>
          <Routes>
            <Route
              path="/admin/parcours/view/:id"
              element={
                <ContenuDetail parcoursId={42} moduleId={12} canEdit={false} />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Cours test 1");
    expect(container.textContent).toContain("Cours test 2");
    expect(container.textContent).not.toContain("Cours test 3");

    const fullContentLink = Array.from(container.querySelectorAll("a")).find(
      (link) => link.textContent?.includes("Afficher tout le contenu"),
    );
    expect(fullContentLink?.getAttribute("href")).toBe(
      "/admin/parcours/module/12",
    );
  });
});
