import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { learningProfileApi } from "../learning-profile.api";
import type { LearningContext } from "../types";
import StudentLearningOnboarding from "./StudentLearningOnboarding";

vi.mock("../learning-profile.api", () => ({
  learningProfileKey: ["learning-profile"],
  learningProfileApi: { get: vi.fn(), update: vi.fn(), updateModule: vi.fn() },
}));
vi.mock("../../profile/api/profile.api", () => ({
  profileApi: {
    queries: { getInformation: vi.fn().mockResolvedValue({ data: {} }) },
    mutations: { updateInformation: vi.fn() },
  },
}));
vi.mock("../../profile/components/information/ProfileItemsEditor", () => ({
  default: () => null,
}));
vi.mock("../../../components/UI/OnboardingProgressPanel", () => ({
  default: ({ children, footer, currentStep, stepCount }: {
    children: ReactNode; footer: ReactNode; currentStep: number; stepCount: number;
  }) => <section data-progress={`${currentStep}/${stepCount}`}>{children}{footer}</section>,
}));

function makeContext(mode: "initial" | "additional", currentStep = ""): LearningContext {
  const modules = [
    { id: 1, title: "Module déjà évalué", courses: [], assessment: { level: "advanced" as const, updatedAt: "2026-09-01" } },
    { id: 2, title: "Nouveau module", courses: [], assessment: null },
    { id: 3, title: "Autre nouveau module", courses: [], assessment: null },
  ];
  return {
    hasAvailableContent: true,
    onboardingRequired: true,
    onboardingMode: mode,
    shouldAutoRedirect: true,
    availableFormations: [{ id: 1, title: "Formation", parcours: [{ id: 1, title: "Parcours", tags: [], modules }] }],
    groupNames: [],
    modulesToAssess: modules.slice(1),
    profile: {
      pace: "standard", preferences: ["step_by_step"], status: "in_progress",
      currentStep, version: 1, initialCompletedAt: mode === "additional" ? "2026-09-01" : null, updatedAt: null,
    },
  };
}

describe("StudentLearningOnboarding", () => {
  let container: HTMLDivElement;
  let root: Root;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  afterEach(() => {
    act(() => root.unmount());
    queryClient.clear();
    container.remove();
  });

  async function render(context: LearningContext) {
    vi.mocked(learningProfileApi.get).mockResolvedValue(context);
    vi.mocked(learningProfileApi.update).mockResolvedValue(context);
    vi.mocked(learningProfileApi.updateModule).mockResolvedValue(context);
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/student/onboarding"]}>
            <Routes>
              <Route path="/student/onboarding" element={<StudentLearningOnboarding />} />
              <Route path="/student/dashboard" element={<p>Tableau de bord</p>} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
    await vi.waitFor(() => expect(container.querySelector("form")).not.toBeNull());
  }

  async function answerModule(moduleId: number) {
    await act(async () => {
      container.querySelector<HTMLInputElement>(`input[name="level-${moduleId}"]`)!.click();
    });
    await act(async () => {
      container.querySelector<HTMLFormElement>("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
  }

  it("demande seulement les niveaux manquants et termine après le dernier module", async () => {
    // Une ancienne étape sauvegardée ne doit pas réintroduire les questions générales.
    await render(makeContext("additional", "learning"));
    expect(container.textContent).toContain("Quel est votre niveau dans Nouveau module");
    expect(container.querySelector("[data-progress]")?.getAttribute("data-progress")).toBe("1/2");
    expect(container.textContent).not.toContain("Quel rythme");
    expect(container.textContent).not.toContain("Souhaitez-vous en dire");
    expect(container.querySelector('input[name="level-1"]')).toBeNull();

    await answerModule(2);
    expect(learningProfileApi.updateModule).toHaveBeenCalledWith(2, "beginner");
    expect(container.textContent).toContain("Quel est votre niveau dans Autre nouveau module");
    expect(learningProfileApi.update).not.toHaveBeenCalledWith({ action: "confirm" });

    await answerModule(3);
    expect(learningProfileApi.updateModule).toHaveBeenCalledWith(3, "beginner");
    expect(learningProfileApi.update).toHaveBeenCalledWith({ action: "confirm" });
    expect(container.textContent).toBe("Tableau de bord");
    expect(learningProfileApi.update).not.toHaveBeenCalledWith(expect.objectContaining({ pace: expect.anything() }));
  });

  it("conserve le niveau à choisir si son enregistrement échoue", async () => {
    await render(makeContext("additional", "module:3"));
    vi.mocked(learningProfileApi.updateModule).mockRejectedValueOnce(new Error("Échec"));
    await answerModule(3);
    expect(container.textContent).toContain("Quel est votre niveau dans Autre nouveau module");
    expect(learningProfileApi.update).not.toHaveBeenCalledWith({ action: "confirm" });
    await answerModule(3);
    expect(container.textContent).toBe("Tableau de bord");
  });

  it.each([
    ["learning", "Quel rythme préférez-vous"],
    ["profile", "Souhaitez-vous en dire un peu plus"],
    ["summary", "Vérifiez vos réponses avant de commencer"],
  ])("conserve l’étape %s pour le premier onboarding", async (step, text) => {
    await render(makeContext("initial", step));
    expect(container.textContent).toContain(text);
    expect(container.querySelector("[data-progress]")?.getAttribute("data-progress")).toMatch(/\/7$/);
  });
});
