import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Header from "./Header";
import { StickyBarStackProvider } from "./sticky-bar-stack";

vi.mock("./SidebarRouteIcon", () => ({ default: () => null }));

const roots: Root[] = [];
const BAR_HEIGHT = 80;

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

const slotTops = new Map<Element, number>();
let queuedFrames: FrameRequestCallback[] = [];

const renderPage = () => {
  const scrollRoot = document.createElement("div");
  scrollRoot.id = "main-scroll-container";
  scrollRoot.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;
  document.body.appendChild(scrollRoot);
  const root = createRoot(scrollRoot);
  roots.push(root);
  act(() =>
    root.render(
      <MemoryRouter>
        <StickyBarStackProvider>
          <Header title="Import de cours" description="Page" />
          <Header title="Première étape" isSubHeader />
          <Header title="Seconde étape" isSubHeader />
        </StickyBarStackProvider>
      </MemoryRouter>,
    ),
  );
  const slots = Array.from(scrollRoot.querySelectorAll<HTMLElement>('[data-testid="sticky-page-header"]'));
  slots.forEach((slot) => {
    slot.getBoundingClientRect = () => ({ top: slotTops.get(slot) ?? 0, height: BAR_HEIGHT }) as DOMRect;
    (slot.firstElementChild as HTMLElement).getBoundingClientRect = () => ({ height: BAR_HEIGHT }) as DOMRect;
  });
  return { scrollRoot, slots };
};

/** Place les barres puis déclenche un défilement. */
const scrollTo = (scrollRoot: HTMLElement, slots: HTMLElement[], tops: number[]) => {
  slots.forEach((slot, index) => slotTops.set(slot, tops[index]));
  act(() => {
    scrollRoot.dispatchEvent(new Event("scroll"));
    queuedFrames.splice(0).forEach((callback) => callback(0));
  });
};

beforeEach(() => {
  slotTops.clear();
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  vi.stubGlobal("ResizeObserver", class { observe = vi.fn(); disconnect = vi.fn(); });
  queuedFrames = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    queuedFrames.push(callback);
    return queuedFrames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("relais des barres collantes", () => {
  it("garde pleine la barre collée tant que la suivante est à plus d'une hauteur de barre", () => {
    const { scrollRoot, slots } = renderPage();

    scrollTo(scrollRoot, slots, [0, 300, 600]);

    expect(slots[0].style.opacity).toBe("");
    expect(slots[0].hasAttribute("inert")).toBe(false);
  });

  it("l'efface progressivement à mesure que la suivante la rejoint", () => {
    const { scrollRoot, slots } = renderPage();

    scrollTo(scrollRoot, slots, [0, BAR_HEIGHT * 0.75, 600]);
    expect(Number(slots[0].style.opacity)).toBeCloseTo(0.75);

    scrollTo(scrollRoot, slots, [0, BAR_HEIGHT * 0.25, 600]);
    expect(Number(slots[0].style.opacity)).toBeCloseTo(0.25);
    expect(slots[0].hasAttribute("inert")).toBe(false);

    scrollTo(scrollRoot, slots, [0, 0, 600]);
    expect(Number(slots[0].style.opacity)).toBe(0);
    expect(slots[0].hasAttribute("inert")).toBe(true);
  });

  it("relaie les barres une à une et rend sa place à la précédente quand la suivante redescend", () => {
    const { scrollRoot, slots } = renderPage();

    scrollTo(scrollRoot, slots, [0, 0, 0]);
    expect(slots[0].style.opacity).toBe("0");
    expect(slots[1].style.opacity).toBe("0");
    expect(slots[2].style.opacity).toBe("");

    scrollTo(scrollRoot, slots, [0, 0, 400]);
    expect(slots[1].style.opacity).toBe("");
    expect(slots[0].style.opacity).toBe("0");

    scrollTo(scrollRoot, slots, [0, 300, 700]);
    expect(slots[0].style.opacity).toBe("");
    expect(slots[0].hasAttribute("inert")).toBe(false);
  });

  it("n'efface pas une barre qui n'est pas encore collée", () => {
    const { scrollRoot, slots } = renderPage();

    scrollTo(scrollRoot, slots, [200, 220, 400]);

    expect(slots[0].style.opacity).toBe("");
  });

  it("donne aux sous-en-têtes un style compact, sans icône", () => {
    const { slots } = renderPage();
    const bar = slots[1].firstElementChild as HTMLElement;

    expect(bar.className).toContain("ring-1");
    expect(bar.querySelector("h2")?.className).toContain("text-lg");
  });
});
