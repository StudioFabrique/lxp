import { act, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import StudentDashboard from "./StudentDashboard";

vi.mock("../hooks/use-student-dashboard", () => ({
  useStudentDashboard: () => ({
    showOnboardingWelcome: false,
    welcomeTitle: "Bonjour",
    welcomeMessage: "Bienvenue",
    lastLesson: undefined,
    remainingLessons: [],
    hasLastLessons: false,
    learningContext: {
      isLoading: false,
      isError: false,
      data: {
        hasAvailableContent: true,
        onboardingRequired: false,
        shouldAutoRedirect: false,
        formationsToAssess: [],
      },
      refetch: vi.fn(),
    },
  }),
}));
vi.mock("../../../components/headers/Header", () => ({
  default: ({ title }: { title: string }) => <header>{title}</header>,
}));
vi.mock("../../../components/wrappers/PageWrapper", () => ({
  default: ({ children }: PropsWithChildren) => <main>{children}</main>,
}));
vi.mock("../components/resume-parcours", () => ({ default: () => <div /> }));
vi.mock("../components/timeline/student-timeline", () => ({ default: () => <div /> }));
vi.mock("../components/right-side/feeling-feedback", () => ({ default: () => <div /> }));
vi.mock("../components/right-side/feedback-apprenant/student-accomplishments", () => ({ default: () => <div /> }));
vi.mock("../components/right-side/most-read-courses", () => ({ default: () => <div /> }));

describe("StudentDashboard onboarding targets", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("conserve les cibles des étapes 2 et 3 après le démarrage du tutoriel", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/student/dashboard"]}>
          <StudentDashboard />
        </MemoryRouter>,
      );
    });

    expect(
      container.querySelector('[data-onboarding="student-dashboard-header"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-onboarding="student-content"]'),
    ).not.toBeNull();
  });
});
