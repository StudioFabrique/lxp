import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type Lesson from "../../../../utils/interfaces/lesson";
import LessonItem from "./lesson-item";

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const roots: Root[] = [];
const lesson = { id: 11, title: "Première leçon" } as Lesson;

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("LessonItem en mode calendrier", () => {
  it.each(["Enter", " "])(
    "déplie au clic et replie avec %j sans naviguer ni montrer les actions",
    (key) => {
      const container = document.createElement("div");
      const root = createRoot(container);
      roots.push(root);
      const onSelect = vi.fn();

      act(() => root.render(
        <LessonItem
          calendarMode
          lesson={lesson}
          courseTags={[]}
          selectedLesson={undefined}
          canEditLesson
          onSelectLesson={onSelect}
          onOpenModal={vi.fn()}
          onUpdateLesson={vi.fn().mockResolvedValue(true)}
        >
          <span>Activités de la leçon</span>
        </LessonItem>,
      ));

      const header = container.querySelector<HTMLElement>('[role="button"]')!;
      expect(header.getAttribute("aria-expanded")).toBe("false");
      act(() => header.click());
      expect(header.getAttribute("aria-expanded")).toBe("true");
      expect(container.textContent).toContain("Activités de la leçon");
      expect(container.querySelector("button")).toBeNull();

      act(() => header.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })));
      expect(header.getAttribute("aria-expanded")).toBe("false");
      expect(container.textContent).not.toContain("Activités de la leçon");
      expect(onSelect).not.toHaveBeenCalled();
    },
  );
});

describe("visibilité d'une leçon dans la sidebar", () => {
  it("n'affiche aucun indicateur quand la leçon est visible", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    roots.push(root);
    const visibleLesson = { ...lesson, visibility: true } as Lesson;

    act(() =>
      root.render(
        <LessonItem
          lesson={visibleLesson}
          courseTags={[]}
          selectedLesson={visibleLesson}
          canEditLesson
          onSelectLesson={vi.fn()}
          onOpenModal={vi.fn()}
          onUpdateLesson={vi.fn().mockResolvedValue(true)}
        />,
      ),
    );

    expect(container.querySelector('[aria-label="Leçon visible"]')).toBeNull();
    expect(container.querySelector('[aria-label="Leçon invisible"]')).toBeNull();
  });
});
