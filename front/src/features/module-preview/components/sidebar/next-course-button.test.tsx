import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import type Course from "../../../../utils/interfaces/course";
import NextCourseButton from "./next-course-button";

vi.mock("../../../../components/guards/RoleRankGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

let root: Root;
afterEach(() => act(() => root.unmount()));

function render(courses: Course[]) {
  const container = document.createElement("div");
  const onSelectLesson = vi.fn();
  const onSelectAssignment = vi.fn();
  root = createRoot(container);
  act(() => root.render(<NextCourseButton courses={courses} onSelectLesson={onSelectLesson} onSelectAssignment={onSelectAssignment} />));
  return { container, onSelectLesson, onSelectAssignment };
}

function course(values: Partial<Course> = {}): Course {
  return { id: 1, title: "Introduction", isPublished: true, visibility: true, lessons: [{ id: 11 }], ...values } as Course;
}

it("ouvre la première leçon au démarrage", () => {
  const { container, onSelectLesson } = render([course()]);
  expect(container.textContent).toContain("Commencer le premier cours");
  act(() => container.querySelector("button")!.click());
  expect(onSelectLesson.mock.calls[0][0].id).toBe(11);
});

it("reprend après les leçons terminées en ignorant les contenus masqués", () => {
  const lessons = [{ id: 11, lessonsRead: [{ finishedAt: new Date() }] }, { id: 12, visibility: false }, { id: 13 }];
  const { container, onSelectLesson } = render([
    course({ isPublished: false }),
    course({ visibility: false }),
    course({ lessons: lessons as Course["lessons"] }),
  ]);
  expect(container.textContent).toContain("Reprendre le cours");
  act(() => container.querySelector("button")!.click());
  expect(onSelectLesson.mock.calls[0][0].id).toBe(13);
});

it("passe au cours suivant une fois le précédent terminé", () => {
  const { container, onSelectLesson } = render([
    course({ stats: { isCompleted: true } }),
    course({ id: 2, lessons: [{ id: 21 }] as Course["lessons"] }),
  ]);
  expect(container.textContent).toContain("Commencer le prochain cours");
  act(() => container.querySelector("button")!.click());
  expect(onSelectLesson.mock.calls[0][0].id).toBe(21);
});

it("ouvre le devoir restant après les leçons", () => {
  const { container, onSelectAssignment } = render([course({
    lessons: [],
    assignment: { submissions: [] } as unknown as Course["assignment"],
  })]);
  act(() => container.querySelector("button")!.click());
  expect(onSelectAssignment).toHaveBeenCalledWith(1);
});

it("cache le bouton lorsqu'il ne reste aucun contenu", () => {
  const { container } = render([course({ stats: { isCompleted: true } })]);
  expect(container.querySelector("button")).toBeNull();
});
