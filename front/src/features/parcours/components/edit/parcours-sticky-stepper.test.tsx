import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ParcoursStickyStepper from "./parcours-sticky-stepper";
import type Step from "../../../../utils/interfaces/step";

const roots: Root[] = [];
let observerCallback: IntersectionObserverCallback | null = null;

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = vi.fn();
  disconnect = vi.fn();
}

const steps: Step[] = ["Informations", "Objectifs", "Compétences", "Modules"].map((label, index) => ({
  id: index + 1,
  label,
  saved: false,
  isValid: true,
}));

const updateStep = vi.fn();

const renderStepper = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <ParcoursStickyStepper actualStep={steps[2]} stepsList={steps} updateStep={updateStep} />,
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
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("ParcoursStickyStepper", () => {
  it("affiche les étapes, cliquables, tant qu'il n'est pas collé", () => {
    const container = renderStepper();
    const bar = container.querySelector<HTMLElement>("[data-floating]")!;
    const [steppers, compact] = Array.from(bar.children) as HTMLElement[];

    expect(bar.dataset.floating).toBe("false");
    expect(steppers.hasAttribute("inert")).toBe(false);
    expect(compact.hasAttribute("inert")).toBe(true);
    expect(steppers.querySelectorAll("li")).toHaveLength(steps.length);
    expect(compact.querySelectorAll("li button")).toHaveLength(steps.length);
  });

  it("se réduit en barre flottante avec l'étape courante et un tiret cliquable par étape une fois collé", () => {
    const container = renderStepper();

    setStuck(true);

    const bar = container.querySelector<HTMLElement>("[data-floating]")!;
    const [steppers, compact] = Array.from(bar.children) as HTMLElement[];
    expect(bar.dataset.floating).toBe("true");
    expect(bar.className).toContain("w-[60vw]");
    expect(steppers.hasAttribute("inert")).toBe(true);
    expect(compact.hasAttribute("inert")).toBe(false);
    expect(compact.textContent).toContain("Étape 3 sur 4");
    expect(compact.textContent).toContain("Compétences");
    const dashes = compact.querySelectorAll<HTMLButtonElement>("li button");
    expect(dashes).toHaveLength(steps.length);
    expect(dashes[2].getAttribute("aria-current")).toBe("step");
    expect(dashes[3].getAttribute("aria-label")).toBe("Étape 4 : Modules");
  });

  it("retrouve les étapes quand il redescend", () => {
    const container = renderStepper();

    setStuck(true);
    setStuck(false);

    expect(container.querySelector<HTMLElement>("[data-floating]")?.dataset.floating).toBe("false");
  });

  it("change d'étape depuis un tiret", () => {
    updateStep.mockClear();
    const container = renderStepper();

    setStuck(true);
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Étape 2 : Objectifs"]')?.click());

    expect(updateStep).toHaveBeenCalledWith(2);
  });

  it("remplit les tirets jusqu'à l'étape courante, avec un trait animé", () => {
    const container = renderStepper();

    setStuck(true);

    const fills = Array.from(container.querySelectorAll<HTMLElement>("li button span span"));
    expect(fills.map((fill) => fill.className.includes("scale-x-100"))).toEqual([true, true, true, false]);
    expect(fills[2].className).toContain("bg-info");
    expect(fills[0].className).toContain("bg-primary");
    expect(fills[0].className).toContain("origin-left");
    expect(fills[0].className).toContain("duration-500");
  });
});
