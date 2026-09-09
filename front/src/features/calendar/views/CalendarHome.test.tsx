import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import apiClient from "../../../lib/axios";
import CalendarHome from "./CalendarHome";
import StudentTimeline from "../../dashboard-student/components/timeline/student-timeline";
import { dateKey } from "../components/read-calendar-utils";

vi.mock("../../../lib/axios", () => ({ default: { get: vi.fn() } }));
beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});
let root: Root;
let client: QueryClient;
let container: HTMLDivElement;
const flush = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
const click = async (text: string) => {
  const button = Array.from(document.querySelectorAll("button")).find(button => button.textContent?.trim() === text);
  expect(button, text).toBeDefined();
  act(() => button!.click()); await flush();
};
afterEach(() => { act(() => root?.unmount()); container?.remove(); client?.clear(); vi.clearAllMocks(); vi.unstubAllGlobals(); });
async function render(dashboard = false, singleParcours = false) {
  const today = `${dateKey(new Date())}T00:00:00.000Z`;
  vi.mocked(apiClient.get).mockImplementation(async url => ({ data: url === "/course/calendar/parcours" ? (singleParcours ? [{ id: 1, title: "Web" }] : [{ id: 1, title: "Web" }, { id: 2, title: "Design" }]) : {
    id: url?.endsWith("/1") ? 1 : 2, title: "Parcours", modules: [{ id: 42, title: url?.endsWith("/1") ? "Module Web" : "Module Design", minDate: today, maxDate: today,
      courses: [1, 2, 3].map(id => ({ id, title: `Cours ${id}`, lessons: [{ id: id + 10 }], dates: [{ id: 1, minDate: today, maxDate: today, startTime: "09:00", endTime: "12:00" }] })) }],
  } }));
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  act(() => root.render(<MemoryRouter initialEntries={["/student/calendrier"]}><QueryClientProvider client={client}>{dashboard ? <StudentTimeline /> : <CalendarHome />}</QueryClientProvider></MemoryRouter>));
  await flush(); await flush();
}
it("consulte un seul parcours et conserve la vue timeline lors du changement de badge", async () => {
  await render();
  expect(container.textContent).not.toContain("Tous les parcours");
  expect(apiClient.get).not.toHaveBeenCalledWith("/course/calendar/parcours/2");
  await click("Timeline");
  expect(container.textContent).toContain("Module Web");
  await click("Design");
  expect(apiClient.get).toHaveBeenCalledWith("/course/calendar/parcours/2");
  expect(container.textContent).toContain("Module Design");
  expect(container.textContent).not.toContain("Module Web");
  expect(Array.from(container.querySelectorAll("button")).find(b => b.textContent === "Timeline")?.getAttribute("aria-pressed")).toBe("true");
  await click("Design");
  expect(container.textContent).toContain("Module Design");
  expect(container.textContent).not.toContain("Attribuer");
});
it("ouvre le popover et le lien exact du cours, puis la liste des cours masqués", async () => {
  await render();
  const course = container.querySelector<HTMLButtonElement>('[data-calendar-event^="1:"]')!;
  act(() => course.click()); await flush();
  const link = Array.from(document.querySelectorAll("a")).find(a => a.textContent?.includes("Accéder au cours"));
  expect(link?.getAttribute("href")).toBe("/student/parcours/module/42");
  expect(document.body.textContent).toContain("09:00 – 12:00, chaque jour");
  act(() => document.querySelector<HTMLButtonElement>('[aria-label="Fermer les détails"]')!.click());
  await click("Afficher plus (1) · cours superposés");
  const dialog = document.querySelector("dialog")!;
  expect(dialog.textContent).toContain("Cours 3");
  expect(dialog.textContent).not.toContain("Cours 1");
  expect(dialog.querySelector('a[aria-label="Accéder au cours Cours 3"]')?.getAttribute("href")).toBe("/student/parcours/module/42");
  await click("Fermer");
  expect(document.querySelector("dialog")).toBeNull();
  await click("Mois");
  await click("Afficher plus (1)");
  expect(document.querySelector("dialog")?.textContent).toContain("Cours 3");
});

it("garde Mon emploi du temps sur le dashboard, Jour par défaut et seulement Jour/Semaine", async () => {
  await render(true, true);
  expect(Array.from(container.querySelectorAll("h2")).map(title => title.textContent)).toEqual(["Mon emploi du temps", "Web"]);
  expect(container.querySelector('[aria-label="Filtres par parcours"]')).toBeNull();
  const button = (title: string) => Array.from(container.querySelectorAll("button")).find(b => b.textContent === title);
  expect(button("Jour")?.getAttribute("aria-pressed")).toBe("true");
  expect(button("Semaine")).toBeDefined();
  expect(button("Mois")).toBeUndefined();
  expect(button("Timeline")).toBeUndefined();
  await click("Semaine");
  expect(button("Semaine")?.getAttribute("aria-pressed")).toBe("true");
});
it("masque aussi le filtre à parcours unique sur la page Calendrier", async () => {
  await render(false, true);
  expect(container.querySelector('[aria-label="Filtres par parcours"]')).toBeNull();
  expect(container.textContent).toContain("Timeline");
});

it("le clic sur un jour en en-tête de semaine ouvre cette date en vue Jour", async () => {
  await render();
  const headers = container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Voir le "]');
  expect(headers).toHaveLength(7);
  const dayLabel = headers[0].textContent;
  act(() => headers[0].click()); await flush();
  expect(container.querySelector('[aria-label="Cours du jour"]')).not.toBeNull();
  expect(container.querySelector('[aria-label="Cours de la semaine"]')).toBeNull();
  expect(container.querySelector('[aria-label="Cours du jour"]')?.textContent).toContain(dayLabel);
  expect(Array.from(container.querySelectorAll("button")).find(button => button.textContent === "Jour")?.getAttribute("aria-pressed")).toBe("true");
});
