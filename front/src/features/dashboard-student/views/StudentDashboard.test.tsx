import { act, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import StudentDashboard from "./StudentDashboard";

const dashboardState = vi.hoisted(() => ({ onboardingRequired: false }));

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
        onboardingRequired: dashboardState.onboardingRequired,
        shouldAutoRedirect: false,
        modulesToAssess: [],
      },
      refetch: vi.fn(),
    },
  }),
}));
vi.mock("../../../components/headers/Header", () => ({
  default: ({ title, children }: PropsWithChildren<{ title: string }>) => <header>{title}{children}</header>,
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
    dashboardState.onboardingRequired = false;
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

  it("place la reprise du questionnaire dans le bandeau de bienvenue", async () => {
    dashboardState.onboardingRequired = true;

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/student/dashboard"]}>
          <StudentDashboard />
        </MemoryRouter>,
      );
    });

    const resumeLink = container.querySelector('header a[href="/student/onboarding"]');
    expect(resumeLink?.textContent).toContain("Reprendre mon onboarding");
    expect(resumeLink?.querySelector("svg")).not.toBeNull();
    expect(container.textContent).not.toContain("Mon avancement");
    expect(container.textContent).not.toContain("Compléter mon profil d’apprentissage");
  });
});
