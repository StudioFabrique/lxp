import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import SaveButton from "./SaveButton";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  vi.unstubAllGlobals();
});

describe("SaveButton flottant", () => {
  it("devient un bouton rond aligné à droite hors de sa position naturelle", () => {
    let observerCallback: IntersectionObserverCallback | undefined;

    class IntersectionObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

    const container = document.createElement("div");
    root = createRoot(container);
    act(() => root?.render(<SaveButton floating onSave={vi.fn()} />));

    const getWrapper = () =>
      container.querySelector<HTMLElement>("[data-floating]");
    const getButton = () => container.querySelector("button");

    act(() => {
      observerCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(getWrapper()?.classList.contains("sticky")).toBe(true);
    expect(getButton()?.classList.contains("btn-circle")).toBe(true);
    expect(getButton()?.classList.contains("btn-info")).toBe(true);
    const tooltip = container.querySelector<HTMLElement>("[data-tip]");
    expect(tooltip).toBe(getButton()?.parentElement);
    expect(tooltip?.classList.contains("tooltip-left")).toBe(true);
    expect(getWrapper()?.classList.contains("tooltip")).toBe(false);
    expect(
      getButton()?.querySelector("span:last-child")?.getAttribute("aria-hidden"),
    ).toBe("true");

    act(() => {
      observerCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(getWrapper()?.classList.contains("sticky")).toBe(false);
    expect(getWrapper()?.dataset.floating).toBe("false");
    expect(getButton()?.classList.contains("btn-circle")).toBe(false);
    expect(container.querySelector("[data-tip]")).toBeNull();
    expect(
      getButton()?.querySelector("span:last-child")?.getAttribute("aria-hidden"),
    ).toBe("false");
    expect(
      getButton()?.querySelector("span:last-child")?.classList.contains("ml-2"),
    ).toBe(true);

    act(() => {
      observerCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(getWrapper()?.classList.contains("sticky")).toBe(true);
    expect(getWrapper()?.dataset.floating).toBe("true");
    expect(getButton()?.classList.contains("btn-circle")).toBe(true);
  });
});
