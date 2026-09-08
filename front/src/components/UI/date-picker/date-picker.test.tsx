import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DatePicker from "./date-picker";

describe("DatePicker", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class ResizeObserverMock {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it("affiche la date en français et conserve la valeur de formulaire ISO", () => {
    act(() => {
      root.render(
        <DatePicker
          label="Date de début"
          name="startingDate"
          value="2026-09-08"
          onChange={vi.fn()}
        />,
      );
    });

    expect(container.querySelector("button")?.textContent).toContain(
      "8 septembre 2026",
    );
    expect(
      container.querySelector<HTMLInputElement>('input[name="startingDate"]')
        ?.value,
    ).toBe("2026-09-08");
  });

  it("ouvre le popover et renvoie le jour sélectionné au format ISO", async () => {
    const onChange = vi.fn();
    act(() => {
      root.render(<DatePicker value="2026-09-08" onChange={onChange} />);
    });

    await act(async () => {
      container
        .querySelector("button")
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const day = document.body.querySelector<HTMLButtonElement>(
      '[data-day="2026-09-15"] button',
    );
    expect(day).not.toBeNull();

    await act(async () => {
      day?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onChange).toHaveBeenCalledWith("2026-09-15");
  });
});
