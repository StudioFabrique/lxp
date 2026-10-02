import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
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

const courses = Array.from({ length: 4 }, (_, index) =>
  ({
    id: index + 1,
    title: `Cours test ${index + 1}`,
    lessons: [],
    isPublished: true,
    visibility: true,
    stats: { progress: (index + 1) * 25 },
  }) as unknown as Course,
);

const NavigationTarget = () => {
  const { state } = useLocation();
  return <div data-testid="selected-lesson">{String(state?.lessonId)}</div>;
};

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

  it("limite la liste à trois cours et renvoie vers l'aperçu complet du module", async () => {
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
    expect(container.textContent).toContain("Cours test 3");
    expect(container.textContent).not.toContain("Cours test 4");
    expect(container.querySelector('[role="progressbar"]')).toBeNull();

    const fullContentLink = Array.from(container.querySelectorAll("a")).find(
      (link) => link.textContent?.includes("Afficher tout le contenu"),
    );
    expect(fullContentLink?.getAttribute("href")).toBe(
      "/admin/parcours/module/12",
    );
  });

  it("affiche la progression API de chaque cours pour l'étudiant", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/student/parcours/view/42"]}>
          <ContenuDetail parcoursId={42} moduleId={12} isStudent />
        </MemoryRouter>,
      );
      await Promise.resolve();
    });

    const progressBars = container.querySelectorAll('[role="progressbar"]');
    expect(progressBars).toHaveLength(3);
    expect(Array.from(progressBars, (bar) => bar.getAttribute("aria-valuenow")))
      .toEqual(["25", "50", "75"]);
  });

  it.each([
    { isStudent: true, completed: [true, false, false], expected: 102 },
    { isStudent: true, completed: [false, false, false], expected: 101 },
    { isStudent: true, completed: [true, true, false], expected: 103 },
    { isStudent: true, completed: [true, true, true], expected: 101 },
    { isStudent: true, completed: [], expected: null },
    { isStudent: false, completed: [true, false, false], expected: 101 },
  ])(
    "ouvre la leçon $expected (étudiant : $isStudent, leçons terminées : $completed)",
    async ({ isStudent, completed, expected }) => {
      getCoursesByModule.mockResolvedValue({
        response: [{
          ...courses[0],
          lessons: completed.map((finished, index) => ({
            id: 101 + index,
            lessonsRead: finished ? [{ finishedAt: "2026-09-30T10:00:00Z" }] : [],
          })),
        }],
      } as never);

      const area = isStudent ? "student" : "admin";
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={[`/${area}/parcours/view/42`]}>
            <Routes>
              <Route
                path="/:area/parcours/view/:id"
                element={<ContenuDetail parcoursId={42} moduleId={12} isStudent={isStudent} />}
              />
              <Route path="/:area/parcours/module/:moduleId" element={<NavigationTarget />} />
            </Routes>
          </MemoryRouter>,
        );
        await Promise.resolve();
      });

      await act(async () => {
        container.querySelector<HTMLElement>(".cursor-pointer")?.click();
      });
      expect(container.querySelector('[data-testid="selected-lesson"]')?.textContent)
        .toBe(String(expected));
    },
  );
});
