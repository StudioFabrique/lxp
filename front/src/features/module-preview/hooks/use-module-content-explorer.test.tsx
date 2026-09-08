import { act, useEffect, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import type Module from "../../../utils/interfaces/module";
import useModuleContentExplorer from "./use-module-content-explorer";
import { modulePreviewApi } from "../api/module-preview.api";

vi.mock("../api/module-preview.api", () => ({
  modulePreviewApi: {
    queries: { getModuleDetail: vi.fn(), getLesson: vi.fn() },
    tracking: { finish: vi.fn(), begin: vi.fn() },
    mutations: { rateLesson: vi.fn() },
  },
}));

let root: Root;
let store: ReturnType<typeof useModuleContentExplorer>;
let client: QueryClient;
function Harness() {
  const explorer = useModuleContentExplorer();
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

async function renderExplorer(rank = 3, alreadyCompleted = false) {
  const module = makeModule(alreadyCompleted);
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

  it("ne termine pas les niveaux supérieurs lorsqu'il reste des leçons", async () => {
    await renderExplorer();
    await act(async () => store.lessonActions.completeLesson(3));
    expect(store.badgeCompletion).toBeNull();
    expect(modulePreviewApi.tracking.finish).toHaveBeenCalledTimes(1);
  });
});
