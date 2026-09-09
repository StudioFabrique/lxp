import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { DatesEditor } from "./module-course-calendar";
import type CourseDates from "../../../course/interfaces/course-dates";
let root: Root;
let container: HTMLDivElement;
afterEach(() => { act(() => root?.unmount()); container?.remove(); });
const range: CourseDates = { id: 1, minDate: "2026-09-01T00:00:00.000Z", maxDate: "2026-09-04T00:00:00.000Z", synchroneDuration: 2, asynchroneDuration: 4 };
function render(dates = [range]) {
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  const save = vi.fn().mockResolvedValue(true);
  act(() => root.render(<DatesEditor dates={dates} isSaving={false} onSave={save} onDelete={vi.fn()} />));
  return save;
}
const submit = async () => act(async () => { container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
it("enregistre une plage sans imposer d'horaires", async () => {
  const save = render(); await submit();
  expect(save).toHaveBeenCalledWith([range]);
  expect(container.querySelectorAll('input[type="time"][required]')).toHaveLength(0);
});
it("refuse des heures inversées et permet de les retirer", async () => {
  const save = render([{ ...range, startTime: "12:00", endTime: "09:00" }]);
  await submit(); expect(save).not.toHaveBeenCalled();
  expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  act(() => Array.from(container.querySelectorAll("button")).find(button => button.textContent === "Retirer les horaires")!.click());
  await submit(); expect(save).toHaveBeenCalledWith([{ ...range, startTime: undefined, endTime: undefined }]);
});
it("enregistre les heures avec les dates et les durées pédagogiques", async () => {
  const dates = [{ ...range, startTime: "08:30", endTime: "12:15" }];
  const save = render(dates); await submit(); expect(save).toHaveBeenCalledWith(dates);
});
