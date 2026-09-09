import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import Calendar from "../calendar";

let root: Root;
let container: HTMLDivElement;
afterEach(() => { act(() => root?.unmount()); container?.remove(); vi.restoreAllMocks(); });

function render(disabled = false) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const onChangeDates = vi.fn();
  const onClickDetails = vi.fn();
  act(() => root.render(<Calendar events={[]} view="planning" currentDate={new Date(2026, 8, 1)} darkMode={false} planningDisabled={disabled}
    timelineEvents={[{ id: "1:0", title: "Introduction", startDate: new Date(2026, 8, 2), endDate: new Date(2026, 8, 3) }]}
    onChangeTimelineEventDates={onChangeDates} onClickTimelineYearEventDetails={onClickDetails} />));
  const surface = container.querySelector<HTMLDivElement>('[aria-label="Calendrier mensuel des cours"]')!;
  surface.setPointerCapture = vi.fn();
  const rows = container.querySelectorAll<HTMLDivElement>('[style*="min-height"]');
  rows.forEach((row, index) => { row.getBoundingClientRect = () => new DOMRect(0, index * 110, 700, 110); });
  return { surface, onChangeDates, onClickDetails };
}
function pointer(element: Element, type: string, x: number, y: number) {
  act(() => element.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 })));
}

describe("calendrier mensuel interactif", () => {
  it("ouvre les détails au clavier et affiche les poignées de redimensionnement", () => {
    const { onClickDetails } = render();
    const event = container.querySelector('[data-calendar-event="1:0"]')!;
    expect(event.querySelectorAll("[data-resize]")).toHaveLength(2);
    act(() => event.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(onClickDetails).toHaveBeenCalledWith("1:0", expect.anything());
  });
  it("garde la capture pendant un déplacement vers une autre semaine et ne déclenche pas le popover", () => {
    const { surface, onChangeDates, onClickDetails } = render();
    pointer(container.querySelector('[data-calendar-event="1:0"]')!, "pointerdown", 250, 50);
    pointer(surface, "pointermove", 450, 160);
    pointer(surface, "pointerup", 450, 160);
    expect(onChangeDates).toHaveBeenCalledWith("1:0", new Date(2026, 8, 11), new Date(2026, 8, 12));
    expect(onClickDetails).not.toHaveBeenCalled();
  });
  it("redimensionne le bord de fin et annule un geste interrompu", () => {
    const { surface, onChangeDates } = render();
    pointer(container.querySelector('[data-resize="end"]')!, "pointerdown", 395, 50);
    pointer(surface, "pointermove", 595, 50);
    pointer(surface, "pointerup", 595, 50);
    expect(onChangeDates).toHaveBeenCalledWith("1:0", new Date(2026, 8, 2), new Date(2026, 8, 5));
    onChangeDates.mockClear();
    pointer(container.querySelector('[data-calendar-event="1:0"]')!, "pointerdown", 250, 50);
    pointer(surface, "pointermove", 550, 50);
    pointer(surface, "pointercancel", 550, 50);
    expect(onChangeDates).not.toHaveBeenCalled();
  });
  it("désactive le clavier et les gestes pendant l'enregistrement ou l'ajout", () => {
    const { surface, onChangeDates, onClickDetails } = render(true);
    const event = container.querySelector<HTMLElement>('[data-calendar-event="1:0"]')!;
    expect(event.tabIndex).toBe(-1);
    pointer(event, "pointerdown", 250, 50);
    pointer(surface, "pointermove", 450, 160);
    pointer(surface, "pointerup", 450, 160);
    act(() => event.click());
    expect(onChangeDates).not.toHaveBeenCalled();
    expect(onClickDetails).not.toHaveBeenCalled();
  });
});
