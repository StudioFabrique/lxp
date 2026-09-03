import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import CourseList from "./course-list";
import type CustomCourse from "./interfaces/custom-course";

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

const courseWithFourLessons: CustomCourse = {
  ...course,
  lessons: [
    ...course.lessons,
    { id: 6, title: "Troisième leçon", order: 2 },
    { id: 7, title: "Quatrième leçon", order: 3 },
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

  it("affiche les cours dans la grille de cartes de l'admin", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <CourseList coursesList={[course]} onRefreshCourses={vi.fn()} />
      </MemoryRouter>,
    );

    expect(markup).toContain("lg:grid-cols-2");
    expect(markup).toContain("xl:grid-cols-3");
    expect(markup).toContain("min-h-52");
  });

  it("affiche au maximum trois leçons dans une carte", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <CourseList
          coursesList={[courseWithFourLessons]}
          onRefreshCourses={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain("Troisième leçon");
    expect(markup).not.toContain("Quatrième leçon");
    expect(markup).toContain("Afficher plus de leçons (1)");
  });
});
