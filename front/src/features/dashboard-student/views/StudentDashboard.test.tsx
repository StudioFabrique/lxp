import { act, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../../store/DemoContext";

import StudentDashboard from "./StudentDashboard";

const dashboardState = vi.hoisted(() => ({ onboardingRequired: false, shouldAutoRedirect: false }));

vi.mock("../hooks/use-student-dashboard", () => ({
  useStudentDashboard: () => ({
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
        shouldAutoRedirect: dashboardState.shouldAutoRedirect,
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

describe("StudentDashboard", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    dashboardState.onboardingRequired = false;
    dashboardState.shouldAutoRedirect = false;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
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

  it("affiche le tableau de bord étudiant en démo sans relancer le questionnaire", async () => {
    dashboardState.onboardingRequired = true;
    dashboardState.shouldAutoRedirect = true;

    await act(async () => {
      root.render(
        <DemoContext value={{ ...DEFAULT_DEMO_CONFIG, demoMode: true, isConfigLoaded: true }}>
          <MemoryRouter initialEntries={["/student/dashboard"]}>
            <StudentDashboard />
          </MemoryRouter>
        </DemoContext>,
      );
    });

    expect(container.querySelector(".grid")).not.toBeNull();
    expect(container.querySelector('a[href="/student/onboarding"]')).toBeNull();
  });
});
