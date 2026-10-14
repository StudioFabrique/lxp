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
    await vi.waitFor(() => expect(container.querySelector("h1")).not.toBeNull());
  }

  async function beginAdditional() {
    await act(async () => {
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent?.includes("Découvrir"))!.click();
    });
  }

  it("présente le nouveau parcours avant de démarrer le questionnaire", async () => {
    const context = makeContext("additional");
    context.groupNames = ["groupe design"];
    context.availableFormations.push({
      id: 2, title: "Ancienne formation", parcours: [{
        id: 2, title: "Ancien parcours", tags: [],
        modules: [context.availableFormations[0].parcours[0].modules[0]],
      }],
    });
    context.availableFormations[0].parcours[0].modules = context.availableFormations[0].parcours[0].modules.slice(1);
    await render(context);
    expect(document.body.textContent).toContain("Vous avez été ajouté à un nouveau parcours");
    expect(Array.from(container.querySelectorAll("dl dt"), (item) => item.textContent))
      .toEqual(["Formation", "Parcours", "Groupe"]);
    expect(Array.from(container.querySelectorAll("dl dd"), (item) => item.textContent))
      .toEqual(["Formation", "Parcours", "Groupe design"]);
    expect(container.querySelector("dl ul")).toBeNull();
    expect(container.textContent).toContain("Groupe design");
    expect(container.textContent).not.toContain("Ancien parcours");
    expect(container.querySelector("[data-progress]")).toBeNull();
    expect(container.querySelector("form")).toBeNull();
    expect(learningProfileApi.update).not.toHaveBeenCalled();

    await beginAdditional();
    expect(learningProfileApi.update).toHaveBeenCalledWith({ action: "start", currentStep: "module:2" });
    expect(container.textContent).toContain("Quel est votre niveau dans Nouveau module");
    await act(async () => {
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent === "Précédent")!.click();
    });
    expect(container.textContent).toContain("Un nouveau parcours vous attend");
    expect(container.querySelector("[data-progress]")).toBeNull();
  });

  it("affiche les parcours puis les groupes sans répéter les groupes partagés", async () => {
    const context = makeContext("additional");
    context.groupNames = ["groupe design", "groupe accueil", "groupe réception"];
    context.availableFormations[0].parcours[0].groupNames = ["groupe design"];
    context.availableFormations[0].parcours.push({
      id: 3, title: "Autre parcours design", tags: [], groupNames: ["groupe design", "groupe création"],
      modules: [{ id: 5, title: "Création", courses: [], assessment: null }],
    });
    context.availableFormations.push({
      id: 2, title: "Hôtellerie", parcours: [{
        id: 2, title: "Réception", tags: [],
        groupNames: ["groupe accueil", "groupe réception"],
        modules: [{ id: 4, title: "Accueil", courses: [], assessment: null }],
      }],
    });
    await render(context);
    expect(Array.from(container.querySelectorAll("dl dt"), (item) => item.textContent))
      .toEqual(["Vos parcours", "Vos groupes"]);
    expect(Array.from(container.querySelectorAll('ul[aria-label="Vos parcours"] li'), (item) => item.querySelector("span.break-words")?.textContent))
      .toEqual(["Parcours", "Autre parcours design", "Réception"]);
    expect(Array.from(container.querySelectorAll('ul[aria-label="Vos groupes"] li'), (item) => item.querySelector("span.break-words")?.textContent))
      .toEqual(["Groupe design", "Groupe création", "Groupe accueil", "Groupe réception"]);
  });

  it.each([1, 2])("annonce %i module(s) ajouté(s) à un parcours déjà évalué", async (count) => {
    const context = makeContext("additional");
    context.availableFormations[0].parcours[0].modules = context.availableFormations[0].parcours[0].modules.slice(0, count + 1);
    await render(context);
    expect(document.body.textContent).toContain(count === 1
      ? "Un nouveau module a été ajouté à votre parcours."
      : "De nouveaux modules ont été ajoutés à vos parcours.");
    expect(container.textContent).not.toContain("Vous avez été ajouté à un nouveau parcours");
    expect(container.querySelector("[data-progress]")).toBeNull();
    await beginAdditional();
    expect(container.textContent).toContain("Quel est votre niveau dans Nouveau module");
    expect(container.querySelector('input[name="level-1"]')).toBeNull();
  });

  it("annonce à la fois les nouveaux parcours et les ajouts de modules", async () => {
    const context = makeContext("additional");
    context.availableFormations[0].parcours.push({
      id: 2, title: "Nouveau parcours", tags: [], modules: [{
        id: 4, title: "Module du nouveau parcours", courses: [], assessment: null,
      }],
    });
    await render(context);
    expect(container.textContent).toContain("De nouveaux contenus vous attendent");
    expect(document.body.textContent).toContain("de nouveaux modules sont disponibles dans vos parcours actuels");
    expect(container.textContent).toContain("Nouveau parcours");
  });

  it("reste sur l’accueil si le démarrage échoue", async () => {
    await render(makeContext("additional"));
    vi.mocked(learningProfileApi.update).mockRejectedValueOnce(new Error("Échec"));
    await beginAdditional();
    expect(container.querySelector("form")).toBeNull();
    await beginAdditional();
    expect(container.textContent).toContain("Quel est votre niveau dans Nouveau module");
  });

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
    await beginAdditional();
    expect(container.textContent).toContain("Quel est votre niveau dans Nouveau module");
    expect(container.querySelector("[data-progress]")?.getAttribute("data-progress")).toBe("1/2");
    expect(container.textContent).not.toContain("Quel rythme");
    expect(container.textContent).not.toContain("Souhaitez-vous en dire");
    expect(container.querySelector('input[name="level-1"]')).toBeNull();
    expect(container.querySelector("form > header")).toBeNull();

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

  it("actualise les parcours déjà en cache avant de revenir au dashboard", async () => {
    const previousParcours = [{ id: 1, title: "Ancien parcours" }];
    const availableParcours = [...previousParcours, { id: 2, title: "Nouveau parcours" }];
    const keys = [["parcours-as-student"], ["parcours", { asStudent: true }]];
    const fetchParcours = vi.fn().mockResolvedValue(previousParcours);
    for (const queryKey of keys) {
      await queryClient.fetchQuery({ queryKey, queryFn: fetchParcours, staleTime: Infinity });
    }
    queryClient.setQueryData(["parcours", { asStudent: false }], previousParcours);
    await render(makeContext("additional", "module:3"));
    fetchParcours.mockClear();
    fetchParcours.mockResolvedValue(availableParcours);

    await answerModule(3);

    expect(container.textContent).toBe("Tableau de bord");
    expect(fetchParcours).toHaveBeenCalledTimes(2);
    for (const queryKey of keys) {
      expect(queryClient.getQueryData(queryKey)).toEqual(availableParcours);
      expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(false);
    }
    expect(queryClient.getQueryData(["parcours", { asStudent: false }])).toEqual(previousParcours);
    expect(queryClient.getQueryState(["parcours", { asStudent: false }])?.isInvalidated).toBe(false);
  });

  it("valide et enregistre séparément le rythme puis les méthodes", async () => {
    const context = makeContext("initial", "pace");
    context.profile.pace = null;
    context.profile.preferences = [];
    await render(context);
    const continueButton = () => Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Continuer")!;
    const submit = async () => {
      await act(async () => {
        container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });
    };
    expect(continueButton().disabled).toBe(true);
    expect(container.textContent).not.toContain("Quelles méthodes");
    await act(async () => { container.querySelector<HTMLInputElement>('input[name="pace"]')!.click(); });
    expect(continueButton().disabled).toBe(false);
    await submit();
    expect(learningProfileApi.update).toHaveBeenCalledWith({ pace: "progressive" });
    expect(learningProfileApi.update).toHaveBeenCalledWith({ currentStep: "preferences" });
    expect(container.textContent).toContain("Quelles méthodes vous aident à apprendre");
    expect(container.textContent).not.toContain("Quel rythme");
    expect(continueButton().disabled).toBe(true);
    await act(async () => { container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click(); });
    await act(async () => {
      Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Précédent")!.click();
    });
    expect(container.querySelector<HTMLInputElement>('input[name="pace"]')!.checked).toBe(true);
    await submit();
    expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked).toBe(true);
    await submit();
    expect(learningProfileApi.update).toHaveBeenCalledWith({ preferences: ["concrete_examples"] });
    expect(container.textContent).toContain("Quel est votre niveau");
  });

  it("termine le premier onboarding depuis l’étape facultative sans aperçu", async () => {
    await render(makeContext("initial", "profile"));
    expect(container.textContent).not.toContain("Vérifiez vos réponses");
    expect(container.querySelector("[data-progress]")?.getAttribute("data-progress")).toBe("7/7");
    const finish = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Terminer")!;
    expect(finish.disabled).toBe(false);
    await act(async () => { finish.click(); });
    expect(learningProfileApi.update).toHaveBeenCalledWith({ action: "confirm" });
    expect(container.textContent).toBe("Tableau de bord");
  });

  it.each([
    ["learning", "Quel rythme préférez-vous"],
    ["pace", "Quel rythme préférez-vous"],
    ["preferences", "Quelles méthodes vous aident à apprendre"],
    ["profile", "Souhaitez-vous en dire un peu plus"],
    ["summary", "Souhaitez-vous en dire un peu plus"],
  ])("conserve l’étape %s pour le premier onboarding", async (step, text) => {
    await render(makeContext("initial", step));
    expect(container.textContent).toContain(text);
    expect(container.querySelector("[data-progress]")?.getAttribute("data-progress")).toMatch(/\/7$/);
    await vi.waitFor(() => {
      expect(container.querySelector("form > header") !== null).toBe(["learning", "pace", "preferences"].includes(step));
    });
  });
});
