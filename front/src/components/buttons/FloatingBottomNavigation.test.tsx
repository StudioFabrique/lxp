import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import FloatingBottomNavigation from "./FloatingBottomNavigation";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  vi.unstubAllGlobals();
});

describe("FloatingBottomNavigation", () => {
  it("retarde réellement le sticky selon le décalage demandé", () => {
    const observers: Array<{
      callback: IntersectionObserverCallback;
      options?: IntersectionObserverInit;
    }> = [];

    class IntersectionObserverMock {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observers.push({ callback, options });
      }

      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "0px";
      thresholds = [0.1];
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

    const scrollContainer = document.createElement("main");
    scrollContainer.id = "main-scroll-container";
    const container = document.createElement("div");
    scrollContainer.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(<FloatingBottomNavigation stickyActivationOffset={200} />),
    );

    const dockingObserver = observers.find(
      ({ options }) => options?.rootMargin === undefined,
    );
    const activationObserver = observers.find(
      ({ options }) => options?.rootMargin === "0px 0px 200px 0px",
    );

    expect(dockingObserver).toBeDefined();
    expect(activationObserver).toBeDefined();
    expect(dockingObserver?.options?.root).toBe(scrollContainer);
    expect(activationObserver?.options?.root).toBe(scrollContainer);

    const navigation = container.firstElementChild as HTMLElement;
    expect(navigation.className).not.toContain("sticky");

    act(() => {
      dockingObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      activationObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(navigation.className).toContain("shadow-none");
    expect(navigation.className).not.toContain("sticky");

    act(() => {
      dockingObserver?.callback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(navigation.className).not.toContain("sticky");

    act(() => {
      activationObserver?.callback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(navigation.className).toContain("shadow-xl");
    expect(navigation.className).toContain("sticky bottom-4");

    act(() => {
      activationObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(navigation.className).not.toContain("sticky");

    act(() => {
      dockingObserver?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(navigation.className).not.toContain("sticky");
  });

  it("conserve le sticky immédiat par défaut", () => {
    let observerOptions: IntersectionObserverInit | undefined;

    class IntersectionObserverMock {
      constructor(
        _callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observerOptions = options;
      }

      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

    const container = document.createElement("div");
    root = createRoot(container);
    act(() => root?.render(<FloatingBottomNavigation />));

    expect(observerOptions?.rootMargin).toBeUndefined();
    expect(container.firstElementChild?.className).toContain("sticky bottom-4");
  });
});
