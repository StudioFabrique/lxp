import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type Lesson from "../../../../utils/interfaces/lesson";
import LessonItem from "./lesson-item";

vi.mock("./edit-lesson-modal", () => ({ default: () => null }));

const roots: Root[] = [];
const lesson = { id: 12, title: "Leçon ciblée" } as Lesson;
const originalScrollIntoView = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "scrollIntoView",
);

const renderLesson = (
  container: HTMLDivElement,
  isCourseOpen: boolean,
  shouldScrollIntoView: boolean,
  onScrolledIntoView = vi.fn(),
) => {
  let root = roots[0];
  if (!root) {
    root = createRoot(container);
    roots.push(root);
  }

  act(() => {
    root.render(
      <LessonItem
        lesson={lesson}
        courseTags={[]}
        selectedLesson={lesson}
        isCourseOpen={isCourseOpen}
        shouldScrollIntoView={shouldScrollIntoView}
        onScrolledIntoView={onScrolledIntoView}
        onSelectLesson={vi.fn()}
        onOpenModal={vi.fn()}
        onUpdateLesson={vi.fn().mockResolvedValue(true)}
      />,
    );
  });
};

beforeEach(() => {
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  if (originalScrollIntoView) {
    Object.defineProperty(
      Element.prototype,
      "scrollIntoView",
      originalScrollIntoView,
    );
  } else {
    Reflect.deleteProperty(Element.prototype, "scrollIntoView");
  }
  vi.unstubAllGlobals();
});

describe("LessonItem", () => {
  it("attend l'ouverture du cours avant de défiler vers la leçon externe", () => {
    const container = document.createElement("div");
    const onScrolledIntoView = vi.fn();

    renderLesson(container, false, true, onScrolledIntoView);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    renderLesson(container, true, true, onScrolledIntoView);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
    });
    expect(onScrolledIntoView).toHaveBeenCalledWith(12);
  });

  it("ne défile pas lors d'une sélection interne", () => {
    const container = document.createElement("div");

    renderLesson(container, true, false);

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
