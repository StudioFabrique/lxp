import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type Module from "../../../../utils/interfaces/module";
import type { Activity } from "../../../../utils/interfaces/activity";
import MobileModuleNavigation from "./mobile-module-navigation";

const roots: Root[] = [];

const activity = { id: 31, title: "Introduction", type: "text" } as Activity;
const lessons = [
  { id: 21, title: "Première leçon", activities: [activity] },
  { id: 22, title: "Seconde leçon", activities: [] },
];
const module = {
  id: 1,
  title: "Module",
  courses: [
    {
      id: 11,
      title: "Premier cours",
      lessons,
      assignment: { submissions: [] },
      stats: { progress: 0 },
    },
  ],
} as unknown as Module;

const renderNavigation = () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  roots.push(root);
  const handlers = {
    onSelectLesson: vi.fn(),
    onSelectActivity: vi.fn(),
    onSelectAssignment: vi.fn(),
    onLessonScrolled: vi.fn(),
    onNavigated: vi.fn(),
  };
  act(() =>
    root.render(
      <MobileModuleNavigation
        module={module}
        selectedLesson={lessons[0] as Module["courses"][number]["lessons"][number]}
        {...handlers}
      />,
    ),
  );
  return { container, handlers };
};

const buttonByLabel = (container: HTMLElement, label: string) =>
  container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("MobileModuleNavigation", () => {
  it("affiche cours, leçons et activités avec leur titre", () => {
    const { container } = renderNavigation();

    expect(container.textContent).toContain("Cours 1 : Premier cours");
    expect(container.textContent).toContain("Leçon 1 : Première leçon");
    expect(container.textContent).toContain("Activité 1 : Introduction");
  });

  it("signale la fin de la navigation au choix d'une activité", () => {
    const { container, handlers } = renderNavigation();

    act(() => buttonByLabel(container, "Activité 1 : Introduction").click());

    expect(handlers.onSelectActivity).toHaveBeenCalledWith(activity);
    expect(handlers.onNavigated).toHaveBeenCalledOnce();
  });

  it("signale la fin de la navigation au choix d'un devoir", () => {
    const { container, handlers } = renderNavigation();

    const assignment = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Devoir"),
    )!;
    act(() => assignment.click());

    expect(handlers.onSelectAssignment).toHaveBeenCalledWith(11);
    expect(handlers.onNavigated).toHaveBeenCalledOnce();
  });

  it("signale aussi la fin de la navigation au choix d'une leçon", () => {
    const { container, handlers } = renderNavigation();

    act(() => buttonByLabel(container, "Leçon 2 : Seconde leçon").click());

    expect(handlers.onSelectLesson).toHaveBeenCalledWith(22);
    expect(handlers.onNavigated).toHaveBeenCalledOnce();
  });
});
