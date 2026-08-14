import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type Course from "../../../../utils/interfaces/course";
import type Lesson from "../../../../utils/interfaces/lesson";
import { OnboardingContext } from "../../../onboarding/OnboardingContext";
import SidebarCoursesList from "./sidebar-courses-list";

vi.mock("./course-item", () => ({
  default: ({
    course,
    isOpen,
    onToggle,
  }: {
    course: { id: number };
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      data-testid={`course-${course.id}`}
      data-open={isOpen}
      onClick={onToggle}
    />
  ),
}));

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../../src/components/wrappers/FadeWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const roots: Root[] = [];

const lesson = { id: 11, title: "Première leçon" } as Lesson;
const course = {
  id: 1,
  title: "Premier cours",
  lessons: [lesson],
} as Course;

const renderCourses = (container: HTMLDivElement, step: string) => {
  let root = roots[0];
  if (!root) {
    root = createRoot(container);
    roots.push(root);
  }

  act(() => {
    root.render(
      <OnboardingContext
        value={{
          status: "in_progress",
          step,
          isSaving: false,
          start: vi.fn().mockResolvedValue(undefined),
          skip: vi.fn().mockResolvedValue(undefined),
        }}
      >
        <SidebarCoursesList
          courses={[course]}
          selectedLesson={lesson}
          onSelectLesson={vi.fn()}
          onDeleteCourse={vi.fn().mockResolvedValue(undefined)}
          onEnableCourse={vi.fn().mockResolvedValue(undefined)}
          onPublishCourse={vi.fn().mockResolvedValue(undefined)}
          onUpdateCourse={vi.fn().mockResolvedValue(true)}
          onDeleteLesson={vi.fn().mockResolvedValue(undefined)}
          onCreateLesson={vi.fn().mockResolvedValue(11)}
          onUpdateLesson={vi.fn().mockResolvedValue(true)}
        >
          <span>Créer un cours</span>
          <span>Créer une activité</span>
        </SidebarCoursesList>
      </OnboardingContext>,
    );
  });
};

const getCourseButton = (container: HTMLDivElement) => {
  const button = container.querySelector<HTMLButtonElement>(
    '[data-testid="course-1"]',
  );
  if (!button) throw new Error("Le cours de test n’a pas été rendu.");
  return button;
};

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  vi.unstubAllGlobals();
});

describe("SidebarCoursesList pendant le tutoriel", () => {
  it("empêche de replier le cours à l’étape de création d’activité", () => {
    const container = document.createElement("div");
    renderCourses(container, "admin-activity-create:42");

    const button = getCourseButton(container);
    expect(button.dataset.open).toBe("true");

    act(() => button.click());

    expect(button.dataset.open).toBe("true");
  });

  it("rouvre le cours si cette étape commence après sa fermeture", () => {
    const container = document.createElement("div");
    renderCourses(container, "admin-activity-type:42");

    act(() => getCourseButton(container).click());
    expect(getCourseButton(container).dataset.open).toBe("false");

    renderCourses(container, "admin-activity-create:42");

    expect(getCourseButton(container).dataset.open).toBe("true");
  });
});
