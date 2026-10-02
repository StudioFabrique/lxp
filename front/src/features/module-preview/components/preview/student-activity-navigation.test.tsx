import { act, type ButtonHTMLAttributes } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import StudentActivityNavigation from "./student-activity-navigation";

vi.mock("../../../../components/buttons/FeedbacksButton", () => ({
  default: ({ children, disabled, onClick }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button disabled={disabled} onClick={onClick}>{children}</button>
  ),
}));

const roots: Root[] = [];
afterEach(() => roots.splice(0).forEach(root => act(() => root.unmount())));

it("affiche un cadenas et une explication tant que des activités restent non lues", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  roots.push(root);
  const onCompleteLesson = vi.fn();
  const render = (areAllActivitiesRead: boolean, isLessonCompleted = false) => root.render(
    <StudentActivityNavigation
      modalVisibility="none"
      isFirstActivitySelected
      isLastActivitySelected
      isLastLessonSelected={false}
      isLessonCompleted={isLessonCompleted}
      areAllActivitiesRead={areAllActivitiesRead}
      onPreviousActivity={vi.fn()}
      onNextActivity={vi.fn()}
      onCompleteLesson={onCompleteLesson}
    />,
  );
  act(() => render(false));
  const button = container.querySelector<HTMLButtonElement>("button")!;
  expect(button.disabled).toBe(true);
  expect(container.querySelector(".lucide-lock-keyhole")).not.toBeNull();
  expect(container.querySelector(".lucide-check")).toBeNull();
  expect(container.querySelector("[data-tip]")?.getAttribute("data-tip"))
    .toBe("Lisez toutes les activités de la leçon pour la terminer.");
  act(() => button.click());
  expect(onCompleteLesson).not.toHaveBeenCalled();

  act(() => render(true));
  expect(button.disabled).toBe(false);
  expect(container.querySelector(".lucide-lock-keyhole")).toBeNull();
  expect(container.querySelector(".lucide-check")).not.toBeNull();
  expect(container.querySelector("[data-tip]")).toBeNull();
  act(() => button.click());
  expect(onCompleteLesson).toHaveBeenCalledOnce();

  act(() => render(false, true));
  expect(button.disabled).toBe(false);
  expect(button.textContent).toContain("Leçon suivante");
});
