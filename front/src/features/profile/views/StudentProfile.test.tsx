import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { learningProfileApi } from "../../learning-profile/learning-profile.api";
import type { LearningContext } from "../../learning-profile/types";
import StudentProfile from "./StudentProfile";

vi.mock("../../learning-profile/learning-profile.api", () => ({
  learningProfileKey: ["learning-profile"],
  learningProfileApi: {
    get: vi.fn(),
    update: vi.fn(),
    updateModule: vi.fn(),
  },
}));

const context: LearningContext = {
  hasAvailableContent: true,
  onboardingRequired: false,
  onboardingMode: null,
  shouldAutoRedirect: false,
  modulesToAssess: [],
  availableFormations: [{
    id: 1,
    title: "réceptionniste en hôtellerie",
    parcours: [{
      id: 2,
      title: "promo réceptionniste",
      tags: [],
      modules: [
        { id: 3, title: "accueil client", courses: [], assessment: { level: "beginner", updatedAt: "2026-09-23" } },
        { id: 4, title: "relation client", courses: [], assessment: { level: "advanced", updatedAt: "2026-09-23" } },
      ],
    }],
  }],
  profile: {
    pace: "standard",
    preferences: ["summary"],
    status: "completed",
    currentStep: "",
    version: 1,
    initialCompletedAt: "2026-09-23",
    updatedAt: "2026-09-23",
  },
};

describe("StudentProfile, niveaux par module", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.mocked(learningProfileApi.get).mockResolvedValue(context);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("filtre les niveaux par module et affiche les titres formatés", async () => {
    await act(async () => {
      root.render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <StudentProfile />
        </QueryClientProvider>,
      );
    });

    const levelsTab = [...container.querySelectorAll('button[role="tab"]')]
      .find((button) => button.textContent === "Niveaux par module") as HTMLButtonElement;
    act(() => levelsTab.click());

    expect(container.querySelector('section[aria-label="Niveau dans Accueil client"]')).not.toBeNull();
    expect(container.querySelectorAll('input[name^="profile-level-"]')).toHaveLength(4);
    expect(container.textContent).toContain("Réceptionniste en hôtellerie · Promo réceptionniste");

    const relationFilter = [...container.querySelectorAll('button[aria-pressed]')]
      .find((button) => button.textContent === "Relation client") as HTMLButtonElement;
    act(() => relationFilter.click());

    expect(container.querySelector('section[aria-label="Niveau dans Relation client"]')).not.toBeNull();
    expect(container.querySelectorAll('input[name="profile-level-4"]')).toHaveLength(4);
    expect(container.querySelector('input[name="profile-level-4"]:checked')?.closest("label")?.textContent).toContain("Avancé");
    expect(container.querySelector('input[name="profile-level-3"]')).toBeNull();
  });
});
