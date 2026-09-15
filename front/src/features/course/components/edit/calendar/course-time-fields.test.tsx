import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import CourseTimeFields from "./course-time-fields";

it("règle automatiquement les deux horaires depuis les choix rapides", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const onChange = vi.fn();
  act(() => root.render(<CourseTimeFields onChange={onChange} />));
  for (const [label, startTime, endTime] of [
    ["Matin", "08:00", "12:00"],
    ["Après-midi", "13:00", "17:00"],
    ["Toute la journée", "08:00", "17:00"],
  ]) {
    const button = Array.from(container.querySelectorAll("button")).find(item => item.textContent === label)!;
    act(() => button.click());
    expect(onChange).toHaveBeenLastCalledWith({ startTime, endTime });
  }
  act(() => root.unmount());
});
