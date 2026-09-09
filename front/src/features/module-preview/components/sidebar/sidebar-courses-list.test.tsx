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

const renderCourses = (
  container: HTMLDivElement,
  step: string,
  disableCourseCreationFloating = false,
  calendarMode = false,
  orphanIds: number[] = [],
  onAddCalendarCourse = vi.fn(),
  calendarAdding = calendarMode,
  onSelectCalendarCourse = vi.fn(),
) => {
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
          canStart: true,
          start: vi.fn().mockResolvedValue(undefined),
          skip: vi.fn().mockResolvedValue(undefined),
        }}
      >
        <SidebarCoursesList
          calendarMode={calendarMode}
          calendarAdding={calendarAdding}
          calendarSelectedCourseId={calendarMode ? 1 : undefined}
          calendarOrphanIds={orphanIds}
          onAddCalendarCourse={onAddCalendarCourse}
          onSelectCalendarCourse={onSelectCalendarCourse}
          courses={[course]}
          moduleProgress={0}
          selectedLesson={lesson}
          onSelectLesson={vi.fn()}
          onDeleteCourse={vi.fn().mockResolvedValue(undefined)}
          onEnableCourse={vi.fn().mockResolvedValue(undefined)}
          onPublishCourse={vi.fn().mockResolvedValue(undefined)}
          onUpdateCourse={vi.fn().mockResolvedValue(true)}
          onDeleteLesson={vi.fn().mockResolvedValue(undefined)}
          onCreateLesson={vi.fn().mockResolvedValue(11)}
          onUpdateLesson={vi.fn().mockResolvedValue(true)}
          disableCourseCreationFloating={disableCourseCreationFloating}
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
  if (!button) throw new Error("Le cours de test n'a pas été rendu.");
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
  it("empêche de replier le cours à l'étape de création d'activité", () => {
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

describe("SidebarCoursesList pendant l'édition d'une activité texte", () => {
  it("ne fait pas flotter le bouton de création de cours", () => {
    const container = document.createElement("div");
    renderCourses(container, "admin-activity-create:42", true);

    const createCourseButton = Array.from(
      container.querySelectorAll("span"),
    ).find((element) => element.textContent === "Créer un cours");
    const actionsContainer = createCourseButton?.parentElement;

    expect(actionsContainer).toBeTruthy();
    expect(actionsContainer?.classList.contains("sticky")).toBe(false);
    expect(actionsContainer?.classList.contains("backdrop-blur")).toBe(false);
  });
});


describe("sidebar en mode calendrier", () => {
  it("sélectionne le cours du calendrier au clic tout en conservant son dépliage", () => {
    const container = document.createElement("div");
    const select = vi.fn();
    renderCourses(container, "", false, true, [], vi.fn(), false, select);
    const button = getCourseButton(container);
    act(() => button.click());
    expect(select).toHaveBeenCalledWith(1);
    expect(button.dataset.open).toBe("false");
    act(() => button.click());
    expect(select).toHaveBeenCalledTimes(2);
    expect(button.dataset.open).toBe("true");
    renderCourses(container, "", false, true, [], vi.fn(), true, select);
    act(() => button.click());
    expect(select).toHaveBeenCalledTimes(2);
    renderCourses(container, "", false, false, [], vi.fn(), false, select);
    act(() => button.click());
    expect(select).toHaveBeenCalledTimes(2);
  });
  it("bloque le dépliage pendant l'ajout et indique où sélectionner un cours", () => {
    const container = document.createElement("div");
    renderCourses(container, "", false, true);
    const button = getCourseButton(container);
    expect(button.closest("[inert]")).toBeTruthy();
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Cliquez sur un cours disponible ci-dessous");
    act(() => button.click());
    expect(button.dataset.open).toBe("true");
    expect(button.closest(".ring-primary")).toBeTruthy();
    expect(container.querySelector('[aria-label="Ajouter Premier cours au calendrier"]')).toBeNull();
    expect(button.closest(".opacity-30")).toBeTruthy();
  });
  it("permet seulement de sélectionner les cours orphelins pendant l'ajout", () => {
    const container = document.createElement("div");
    const onAdd = vi.fn();
    renderCourses(container, "", false, true, [1], onAdd);
    const add = container.querySelector<HTMLButtonElement>('[aria-label="Ajouter Premier cours au calendrier"]');
    expect(add).toBeTruthy();
    expect(add?.closest("[inert]")).toBeNull();
    act(() => add?.click());
    expect(onAdd).toHaveBeenCalledWith(1);
  });
});


it("permet le dépliage en mode calendrier hors ajout, même pendant le tutoriel", () => {
  const container = document.createElement("div");
  renderCourses(container, "admin-activity-create:42", false, true, [], vi.fn(), false);
  const button = getCourseButton(container);
  expect(button.closest("[inert]")).toBeNull();
  expect(container.querySelector('[role="status"]')).toBeNull();
  act(() => button.click());
  expect(button.dataset.open).toBe("false");
  act(() => button.click());
  expect(button.dataset.open).toBe("true");
});
