import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import StickyFormHeader from "./StickyFormHeader";

vi.mock("./SidebarRouteIcon", () => ({ default: () => <svg data-testid="route-icon" /> }));

const roots: Root[] = [];
let observerCallback: IntersectionObserverCallback | null = null;
let observerOptions: IntersectionObserverInit | undefined;

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    observerCallback = callback;
    observerOptions = options;
  }

  observe = vi.fn();
  disconnect = vi.fn();
}

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

const mockViewport = (isMobile: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isMobile && query.includes("max-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

const renderHeader = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <MemoryRouter>
        <StickyFormHeader title="Créer un utilisateur" description="Renseignez les informations">
          <button type="button">Sauvegarder</button>
        </StickyFormHeader>
      </MemoryRouter>,
    ),
  );
  return container;
};

const setStuck = (stuck: boolean) =>
  act(() =>
    observerCallback?.(
      [{ intersectionRatio: stuck ? 0.9 : 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );

beforeEach(() => {
  observerCallback = null;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("StickyFormHeader", () => {
  it("affiche le titre, la description et les actions, collé en haut de la zone de défilement", () => {
    mockViewport(false);
    const container = renderHeader();

    expect(container.textContent).toContain("Créer un utilisateur");
    expect(container.textContent).toContain("Renseignez les informations");
    expect(container.textContent).toContain("Sauvegarder");
    expect(container.firstElementChild?.className).toContain("sticky");
    // Se détecte lui-même : le haut de la zone observée est rogné de la valeur de `top` (+ 4 px).
    expect(observerOptions?.rootMargin).toBe("-20px 0px 0px 0px");
    expect(observerOptions?.threshold).toEqual([1]);
  });

  it("devient une barre flottante une fois collé, en gardant son titre et ses actions", () => {
    mockViewport(false);
    const container = renderHeader();
    const bar = () => container.querySelector<HTMLElement>("[data-floating]")!;

    expect(bar().dataset.floating).toBe("false");
    expect(bar().className).toContain("themed-page-header");

    setStuck(true);

    expect(bar().dataset.floating).toBe("true");
    expect(bar().className).toContain("w-[60vw]");
    expect(bar().className).toContain("backdrop-blur");
    expect(bar().className).not.toContain("themed-page-header");
    expect(container.querySelector("h2")?.textContent).toBe("Créer un utilisateur");
    expect(container.textContent).toContain("Sauvegarder");
    // La description est repliée, pas retirée.
    expect(container.querySelector("p")?.className).toContain("max-h-0");
  });

  it("retrouve l'en-tête habituel quand il redescend", () => {
    mockViewport(false);
    const container = renderHeader();

    setStuck(true);
    setStuck(false);

    const bar = container.querySelector<HTMLElement>("[data-floating]")!;
    expect(bar.dataset.floating).toBe("false");
    expect(bar.className).toContain("w-full");
    expect(container.querySelector("p")?.className).toContain("max-h-10");
  });

  it("garde l'en-tête habituel sur mobile, sans observer le défilement", () => {
    mockViewport(true);
    const container = renderHeader();

    expect(container.firstElementChild?.className).not.toContain("sticky");
    expect(observerCallback).toBeNull();
  });
});
