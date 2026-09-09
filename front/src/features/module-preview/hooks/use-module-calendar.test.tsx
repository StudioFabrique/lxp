import { act, useLayoutEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import type Module from "../../../utils/interfaces/module";
import apiClient from "../../../lib/axios";
import useModuleCalendar, { type CalendarCourse, type ModuleCalendarStore } from "./use-module-calendar";

vi.mock("../../../lib/axios", () => ({ default: { post: vi.fn(), put: vi.fn() } }));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

const module = { id: 42, courses: [{ id: 1, title: "Cours 1" }, { id: 2, title: "Cours 2" }] } as Module;
const initialDates = [{ id: 1, minDate: "2026-09-01T00:00:00.000Z", maxDate: "2026-09-05T00:00:00.000Z", synchroneDuration: 3, asynchroneDuration: 7 }];
let store: ModuleCalendarStore;
let root: Root | undefined;
let client: QueryClient;
let server: CalendarCourse[];

function Harness({ enabled }: { enabled: boolean }) {
  const calendar = useModuleCalendar(module, enabled);
  useLayoutEffect(() => { store = calendar; });
  return null;
}
const flush = async () => { await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); }); };
async function render(enabled = true) {
  if (!root) {
    server = [{ id: 1, dates: initialDates }, { id: 2, dates: [] }];
    vi.mocked(apiClient.post).mockImplementation(async () => ({ data: server }));
    vi.mocked(apiClient.put).mockImplementation(async (url, body) => {
      const id = Number(url!.split("/")[3]);
      const dates = (body as { dates: typeof initialDates }).dates;
      server = server.map(course => course.id === id ? { ...course, dates } : course);
      return { data: { id, dates } };
    });
    root = createRoot(document.createElement("div"));
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  }
  await act(async () => root!.render(<QueryClientProvider client={client}><Harness enabled={enabled} /></QueryClientProvider>));
  await flush();
}
afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  client?.clear();
  vi.clearAllMocks();
});

describe("planification des cours du module", () => {
  it("n'initialise rien avant l'ouverture du calendrier", async () => {
    await render(false);
    expect(apiClient.post).not.toHaveBeenCalled();
    await render(true);
    expect(apiClient.post).toHaveBeenCalledWith("/course/calendar/42/initialize");
    expect(store.events).toHaveLength(1);
  });
  it("supprime, recharge puis réajoute un cours en quittant l'ajout et en ouvrant son popover", async () => {
    await render();
    await act(async () => { await store.saveDates(1, []); });
    await flush();
    expect(store.orphanIds).toContain(1);
    await act(async () => { await store.refetch(); });
    expect(store.events).toHaveLength(0);
    act(() => { store.setCurrentDate(new Date(2026, 8, 9)); store.setIsAdding(true); });
    await act(async () => { await store.addCourse(1); });
    await flush();
    expect(store.isAdding).toBe(false);
    expect(store.selection).toEqual({ courseId: 1, eventId: "1:0" });
    expect(store.orphanIds).not.toContain(1);
    expect(server[0].dates[0].minDate).toBe("2026-09-09T00:00:00.000Z");
  });
  it("préserve les durées pédagogiques lors d'un déplacement", async () => {
    await render();
    await act(async () => { await store.changeDates("1:0", new Date(2026, 8, 11), new Date(2026, 8, 15)); });
    expect(server[0].dates[0]).toMatchObject({ minDate: "2026-09-11T00:00:00.000Z", maxDate: "2026-09-15T00:00:00.000Z", synchroneDuration: 3, asynchroneDuration: 7 });
  });
  it("conserve les dates affichées si l'enregistrement échoue", async () => {
    await render();
    vi.mocked(apiClient.put).mockRejectedValueOnce(new Error("network"));
    let saved: boolean | undefined;
    await act(async () => { saved = await store.saveDates(1, []); });
    expect(saved).toBe(false);
    expect(store.datesByCourse.get(1)).toEqual(initialDates);
    expect(store.isSaving).toBe(false);
  });
  it("ignore l'ajout d'un cours déjà planifié", async () => {
    await render();
    act(() => store.setIsAdding(true));
    await act(async () => { await store.addCourse(1); });
    expect(apiClient.put).not.toHaveBeenCalled();
  });
});
