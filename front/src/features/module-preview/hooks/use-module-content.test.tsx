import { act, useEffect, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import type Module from "../../../utils/interfaces/module";
import useModuleContent from "./use-module-content";
import useContentTracking from "./use-content-tracking";
import { modulePreviewApi } from "../api/module-preview.api";

vi.mock("../api/module-preview.api", () => ({
  modulePreviewApi: {
    queries: { getModuleDetail: vi.fn(), getLesson: vi.fn() },
    tracking: { finish: vi.fn(), begin: vi.fn(), heartbeat: vi.fn().mockResolvedValue({}) },
    mutations: { rateLesson: vi.fn() },
  },
}));

let root: Root;
let store: ReturnType<typeof useModuleContent>;
let client: QueryClient;
function Harness() {
  const explorer = useModuleContent();
  useContentTracking(
    "activity",
    explorer.computed.hasStartedModule && !explorer.isActivityContentLoading
      ? explorer.state.selectedActivity?.id : undefined,
    (activityId, readId) => explorer.dispatch({ type: "mark_activity_as_read", activityId, readId }),
  );
  useEffect(() => { store = explorer; });
  return null;
}

const makeModule = (completed: boolean) => ({
  id: 1,
  parcoursId: 42,
  title: "Module",
  stats: { isCompleted: completed },
  bonusSkills: [{ id: 1, description: "Compétence", badge: "badge.png", isEarned: completed }],
  courses: [{
    id: 10,
    stats: { isCompleted: completed },
    lessons: [
      { id: 100, courseId: 10, activities: [], lessonsRead: completed ? [{ finishedAt: new Date() }] : [] },
      { id: 101, courseId: 10, activities: [], lessonsRead: [{ finishedAt: new Date() }] },
    ],
  }],
}) as unknown as Module;

async function renderExplorer(rank = 3, alreadyCompleted = false, module = makeModule(alreadyCompleted)) {
  vi.mocked(modulePreviewApi.queries.getModuleDetail).mockResolvedValue({ data: module });
  vi.mocked(modulePreviewApi.queries.getLesson).mockResolvedValue(module.courses[0].lessons[0]);
  vi.mocked(modulePreviewApi.tracking.finish).mockResolvedValue({ contentRead: { finishedAt: new Date() } });
  vi.mocked(modulePreviewApi.mutations.rateLesson).mockResolvedValue({ data: { rating: 3 } });
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  root = createRoot(document.createElement("div"));
  await act(async () => root.render(
    <QueryClientProvider client={client}>
      <AuthContext.Provider value={{ user: { roles: [{ rank }] } } as ContextType<typeof AuthContext>}>
        <MemoryRouter initialEntries={["/student/parcours/module/1"]}>
          <Routes><Route path="/student/parcours/module/:moduleId" element={<Harness />} /></Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  ));
  await act(async () => store.dispatch({ type: "select_lesson", lesson: module.courses[0].lessons[0] }));
}

afterEach(async () => {
  if (root) await act(async () => root.unmount());
  client?.clear();
  vi.clearAllMocks();
});

describe("Complétion du module", () => {
  it("termine la leçon sans envoyer de note quand l'évaluation est ignorée", async () => {
    await renderExplorer();
    await act(async () => store.lessonActions.completeLesson());
    expect(modulePreviewApi.tracking.finish).toHaveBeenCalledWith("lesson", 100);
    expect(modulePreviewApi.mutations.rateLesson).not.toHaveBeenCalled();
    expect(store.computed.isLessonCompleted).toBe(true);
  });

  it("transmet le commentaire avec la note", async () => {
    await renderExplorer();
    await act(async () => store.lessonActions.completeLesson(4, "Très utile"));
    expect(modulePreviewApi.mutations.rateLesson).toHaveBeenCalledWith(100, 4, "Très utile");
  });

  it("obtient les badges en terminant la première leçon en dernier et rafraîchit le parcours", async () => {
    await renderExplorer();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    vi.mocked(modulePreviewApi.queries.getModuleDetail).mockResolvedValue({ data: makeModule(true) });
    expect(store.computed.isLastLessonSelected).toBe(false);
    await act(async () => store.lessonActions.completeLesson(3));
    expect(store.badgeCompletion?.badges.map(({ id }) => id)).toEqual([1]);
    expect(modulePreviewApi.tracking.finish).toHaveBeenCalledWith("module", 1);
    expect(modulePreviewApi.tracking.finish).toHaveBeenCalledWith("course", 10);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["parcours", "detail", 42] });
    await act(async () => store.closeBadgeCompletion());
    await act(async () => store.lessonActions.completeLesson(3));
    expect(store.badgeCompletion).toBeNull();
  });

  it("ne déclenche rien en ouvrant un module déjà terminé", async () => {
    await renderExplorer(3, true);
    expect(store.badgeCompletion).toBeNull();
    await act(async () => store.lessonActions.completeLesson(3));
    expect(store.badgeCompletion).toBeNull();
  });

  it("réserve la célébration au rôle étudiant", async () => {
    await renderExplorer(2);
    vi.mocked(modulePreviewApi.queries.getModuleDetail).mockResolvedValue({ data: makeModule(true) });
    await act(async () => store.lessonActions.completeLesson(3));
    expect(store.badgeCompletion).toBeNull();
  });

  it.each([{ skills: [] }, { skills: [{ id: 2, description: "Badge partagé", isEarned: false }] }])(
    "ouvre la modale à la fin du module même sans nouveau badge obtenu (%j)",
    async ({ skills }) => {
      await renderExplorer();
      const module = { ...makeModule(true), bonusSkills: skills };
      vi.mocked(modulePreviewApi.queries.getModuleDetail).mockResolvedValue({ data: module });
      await act(async () => store.lessonActions.completeLesson(3));
      expect(store.badgeCompletion).not.toBeNull();
      expect(store.badgeCompletion?.badges).toEqual(module.bonusSkills);
    },
  );

  it("ne termine pas les niveaux supérieurs lorsqu'il reste des leçons", async () => {
    await renderExplorer();
    await act(async () => store.lessonActions.completeLesson(3));
    expect(store.badgeCompletion).toBeNull();
    expect(modulePreviewApi.tracking.finish).toHaveBeenCalledTimes(1);
  });
});


describe("Lecture des activités avant complétion", () => {
  it("confirme la lecture dès le démarrage du premier cours sans recharger la page", async () => {
    const module = makeModule(false);
    module.courses[0].lessons = [{
      ...module.courses[0].lessons[0],
      lessonsRead: [],
      activities: [{
        id: 201, type: "image", title: "Objectif", activitiesRead: [],
        url: "objectif.png", order: 0, createdAt: "2026-09-30", updatedAt: "2026-09-30",
      }],
    }];
    await renderExplorer(3, false, module);
    expect(store.computed.hasStartedModule).toBe(false);
    expect(modulePreviewApi.tracking.begin).not.toHaveBeenCalledWith("activity", 201);

    const startedModule = {
      ...module,
      courses: [{ ...module.courses[0], lessons: [{
        ...module.courses[0].lessons[0], lessonsRead: [{ id: 301 }],
      }] }],
    };
    vi.mocked(modulePreviewApi.queries.getModuleDetail).mockResolvedValue({ data: startedModule });
    vi.mocked(modulePreviewApi.tracking.begin).mockImplementation(async (type) => ({ id: type === "lesson" ? 301 : 401 }));

    await act(async () => store.moduleActions.onFinishInitialQuiz());
    expect(store.computed.hasStartedModule).toBe(true);
    expect(modulePreviewApi.tracking.begin).toHaveBeenCalledWith("activity", 201);
    expect(store.state.selectedActivity?.activitiesRead).toEqual([{ id: 401 }]);
    expect(store.computed.areAllActivitiesRead).toBe(true);
  });

  it("bloque la complétion jusqu'à la confirmation de lecture de chaque activité", async () => {
    await renderExplorer();
    const lesson = {
      ...store.state.selectedLesson!,
      activities: [
        { id: 201, type: "image", title: "Première activité", activitiesRead: [{ id: 1 }] },
        { id: 202, type: "image", title: "Deuxième activité" },
      ],
    } as typeof store.state.selectedLesson;
    await act(async () => store.dispatch({ type: "select_lesson", lesson }));
    expect(store.computed.areAllActivitiesRead).toBe(false);
    await act(async () => store.lessonActions.completeLesson());
    expect(modulePreviewApi.tracking.finish).not.toHaveBeenCalled();
    await act(async () => store.dispatch({ type: "mark_activity_as_read", activityId: 202, readId: 2 }));
    expect(store.computed.areAllActivitiesRead).toBe(true);
    await act(async () => store.lessonActions.completeLesson());
    expect(modulePreviewApi.tracking.finish).toHaveBeenCalledWith("lesson", 100);
  });
});
