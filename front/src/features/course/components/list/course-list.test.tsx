import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import CourseList from "./course-list";
import type CustomCourse from "./interfaces/custom-course";
import { AuthContext } from "../../../../store/AuthProvider";
import type User from "../../../../utils/interfaces/user";

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./course-header", () => ({
  default: () => <h1>Liste des cours</h1>,
}));

const course: CustomCourse = {
  id: 1,
  moduleId: 2,
  author: "Autrice",
  title: "Cours principal",
  module: "Module associé",
  parcours: "Parcours associé",
  updatedAt: "2026-09-02T00:00:00.000Z",
  isPublished: true,
  visibility: true,
  lessons: [
    { id: 4, title: "Première leçon", order: 0 },
    { id: 5, title: "Deuxième leçon", order: 1 },
  ],
};

describe("CourseList", () => {
  it("affiche chaque cours avec ses leçons en sous-éléments", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <CourseList coursesList={[course]} onRefreshCourses={vi.fn()} />
      </MemoryRouter>,
    );

    expect(markup).toContain("Cours principal");
    expect(markup).toContain("Première leçon");
    expect(markup).toContain("Deuxième leçon");
    expect(markup).toContain("/admin/parcours/module/2");
  });

  it("affiche les cours du formateur sur toute la largeur", () => {
    const auth = {
      user: { roles: [{ rank: 2 }] } as User,
    } as React.ContextType<typeof AuthContext>;
    const markup = renderToStaticMarkup(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <CourseList coursesList={[course]} onRefreshCourses={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("grid-cols-1");
    expect(markup).not.toContain("xl:grid-cols-3");
    expect(markup).not.toContain("min-h-52");
  });
});
