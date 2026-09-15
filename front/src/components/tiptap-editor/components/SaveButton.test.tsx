import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import SaveButton from "./SaveButton";

const motionRenderHistory = vi.hoisted(() => ({
  positions: [] as Array<{ left?: unknown; duration?: unknown }>,
}));

vi.mock("motion/react", async () => {
  const React = await import("react");

  type MotionProps = {
    animate?: Record<string, unknown>;
    initial?: unknown;
    transition?: { duration?: number };
  };

  const MotionDiv = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & MotionProps
  >(({ animate, initial, transition, ...props }, ref) => {
    void initial;
    motionRenderHistory.positions.push({
      left: animate?.left,
      duration: transition?.duration,
    });
    return <div ref={ref} {...props} />;
  });

  const MotionButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps
  >(({ animate, initial, transition, ...props }, ref) => {
    void animate;
    void initial;
    void transition;
    return <button ref={ref} {...props} />;
  });

  const MotionSpan = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & MotionProps
  >(({ animate, initial, transition, ...props }, ref) => {
    void animate;
    void initial;
    void transition;
    return <span ref={ref} {...props} />;
  });

  return {
    motion: {
      div: MotionDiv,
      button: MotionButton,
      span: MotionSpan,
    },
  };
});

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  motionRenderHistory.positions = [];
  vi.unstubAllGlobals();
});

describe("SaveButton flottant", () => {
  it("se place sans transition initiale puis anime les changements suivants", () => {
    let observerCallback: IntersectionObserverCallback | undefined;
    let animationFrameCallback: FrameRequestCallback | undefined;

    class IntersectionObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallback = callback;
        return 1;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

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

    expect(
      motionRenderHistory.positions.some(
        ({ left, duration }) =>
          left === "calc(100% - 0px)" && duration === 0,
      ),
    ).toBe(true);

    act(() => animationFrameCallback?.(0));
    act(() => animationFrameCallback?.(16));

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
    expect(
      motionRenderHistory.positions[motionRenderHistory.positions.length - 1],
    ).toEqual({
      left: "calc(50% - 0px)",
      duration: 0.36,
    });

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
