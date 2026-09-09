import { act, useLayoutEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import type Module from "../../../utils/interfaces/module";
import apiClient from "../../../lib/axios";
import useModuleCalendar, { type CalendarCourse, type ModuleCalendarStore } from "./use-module-calendar";
import ModuleCourseCalendar from "../components/calendar/module-course-calendar";

vi.mock("../../../lib/axios", () => ({ default: { post: vi.fn(), put: vi.fn() } }));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

const module = { id: 42, courses: [{ id: 1, title: "Cours 1" }, { id: 2, title: "Cours 2" }] } as Module;
const initialDates = [{ id: 1, minDate: "2026-09-01T00:00:00.000Z", maxDate: "2026-09-05T00:00:00.000Z", synchroneDuration: 3, asynchroneDuration: 7 }];
let store: ModuleCalendarStore;
let root: Root | undefined;
let client: QueryClient;
let server: CalendarCourse[];
let container: HTMLDivElement;

function Harness({ enabled, showCalendar }: { enabled: boolean; showCalendar: boolean }) {
  const calendar = useModuleCalendar(module, enabled);
  useLayoutEffect(() => { store = calendar; });
  return showCalendar ? <ModuleCourseCalendar module={module} store={calendar} /> : null;
}
const flush = async () => { await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); }); };
async function render(enabled = true, showCalendar = false) {
  if (!root) {
    server = [{ id: 1, dates: initialDates }, { id: 2, dates: [] }];
    vi.mocked(apiClient.post).mockImplementation(async () => ({ data: server }));
    vi.mocked(apiClient.put).mockImplementation(async (url, body) => {
      const id = Number(url!.split("/")[3]);
      const dates = (body as { dates: typeof initialDates }).dates;
      server = server.map(course => course.id === id ? { ...course, dates } : course);
      return { data: { id, dates } };
    });
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  }
  await act(async () => root!.render(<QueryClientProvider client={client}><Harness enabled={enabled} showCalendar={showCalendar} /></QueryClientProvider>));
  await flush();
}
afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  container?.remove();
  client?.clear();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("planification des cours du module", () => {
  it("revient au mois du cours, surligne son item et réserve le popover au clic sur le calendrier", async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
    try {
      await render(true, true);
      act(() => container.querySelector<HTMLButtonElement>('[aria-label="Mois suivant"]')!.click());
      expect(container.textContent).toContain("octobre 2026");
      act(() => store.selectCourse(1));
      expect(container.textContent).toContain("septembre 2026");
      const item = container.querySelector<HTMLElement>('[data-calendar-event="1:0"]')!;
      expect(item.getAttribute("aria-pressed")).toBe("true");
      expect(item.classList.contains("ring-primary")).toBe(true);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
      expect(document.querySelector('[aria-label="Dates du cours Cours 1"]')).toBeNull();
      expect(apiClient.put).not.toHaveBeenCalled();
      act(() => item.click());
      await flush();
      expect(document.querySelector('[aria-label="Dates du cours Cours 1"]')).not.toBeNull();
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
    }
  });

  it("sélectionne la première plage chronologique sans modifier les dates", async () => {
    await render();
    server = server.map(course => course.id === 1 ? { ...course, dates: [
      { ...initialDates[0], minDate: "2026-11-01T00:00:00.000Z", maxDate: "2026-11-05T00:00:00.000Z" },
      initialDates[0],
    ] } : course);
    await act(async () => { await store.refetch(); });
    await flush();
    act(() => store.selectCourse(1));
    expect(store.currentDate).toEqual(new Date(2026, 8, 1));
    expect(store.selection).toEqual({ courseId: 1, eventId: "1:1", showDetails: false });
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it("ne déplace pas le calendrier pour un cours sans dates ou pendant un ajout", async () => {
    await render();
    act(() => store.setCurrentDate(new Date(2027, 0, 1)));
    act(() => store.selectCourse(2));
    expect(store.currentDate).toEqual(new Date(2027, 0, 1));
    expect(store.selection).toBeNull();
    act(() => store.setIsAdding(true));
    act(() => store.selectCourse(1));
    expect(store.currentDate).toEqual(new Date(2027, 0, 1));
    expect(store.selection).toBeNull();
    expect(apiClient.put).not.toHaveBeenCalled();
  });

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
