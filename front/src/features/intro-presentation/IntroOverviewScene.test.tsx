import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildIntroCards } from "./intro-content";
import IntroOverviewScene from "./IntroOverviewScene";

const motion = vi.hoisted(() => ({ create: vi.fn(), timelineTo: vi.fn() }));
vi.mock("./intro-motion", () => ({
  prefersReducedMotion: () => true,
  ScrollTrigger: { create: motion.create, refresh: vi.fn() },
  gsap: {
    context: (callback: () => void) => { callback(); return { revert: vi.fn() }; },
    set: (target: HTMLElement | null, vars: Record<string, unknown>) => {
      if (!(target instanceof HTMLElement)) return;
      if (typeof vars.transform === "string") target.style.transform = vars.transform;
      if (typeof vars.y === "number") target.style.translate = `0 ${vars.y}px`;
    },
    from: vi.fn(), fromTo: vi.fn(), to: vi.fn(),
    delayedCall: (_delay: number, callback: () => void) => { callback(); return { kill: vi.fn() }; },
    timeline: () => {
      const timeline = {
        to: (...args: unknown[]) => { motion.timelineTo(...args); return timeline; },
        set: () => timeline,
        progress: vi.fn(),
      };
      return timeline;
    },
    utils: {
      toArray: (selector: string, scope: HTMLElement) => Array.from(scope.querySelectorAll(selector)),
    },
  },
}));
vi.mock("../../hooks/useInstanceBranding", () => ({
  useInstanceBranding: () => ({ logoUrl: null, backgroundColor: undefined }),
}));
vi.mock("./useIntroPresentation", () => ({
  useIntroPresentation: () => ({ sidebarPhase: "normal" }),
}));
vi.mock("./useIntroGuide", () => ({ useIntroGuide: () => 0 }));
vi.mock("./IntroChatbot", () => ({ default: () => null }));

let container: HTMLDivElement;
let root: Root;
let scroller: HTMLDivElement;
const onSelectFormation = vi.fn<(id: string) => void>();
const onSelectChild = vi.fn<(parentIndex: number, rowIndex: number) => void>();
const scrollTo = vi.fn<(options?: ScrollToOptions | number, y?: number) => void>();

const advanceTo = (step: number) => {
  const config: { onUpdate: (self: { progress: number }) => void } = motion.create.mock.calls[0][0];
  act(() => config.onUpdate({ progress: step / 6 }));
  act(() => vi.advanceTimersByTime(1000));
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(
    <IntroOverviewScene cards={buildIntroCards()}
      formationOptions={[
        { id: "web", title: "Développeur web et web mobile", isCurrent: false },
        { id: "hotel", title: "Réceptionniste en hôtellerie", isCurrent: false },
        { id: "payroll", title: "Gestionnaire de paie", isCurrent: false },
      ]}
      selectedFormationId="web"
      onSelectFormation={onSelectFormation}
      onSelectChild={onSelectChild} isSaving={false} onComplete={vi.fn()} />,
  ));
  scroller = container.querySelector<HTMLDivElement>("[role='region']")!;
  Object.defineProperties(scroller, {
    scrollHeight: { value: 6600 }, clientHeight: { value: 600 },
  });
  scroller.scrollTo = scrollTo;
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("IntroOverviewScene", () => {
  it("commence en haut et progresse en descendant, y compris au clavier", () => {
    expect(scroller.scrollTop).toBe(0);
    advanceTo(2);
    expect(container.querySelector("[aria-label='Palier 2 sur 6']")).not.toBeNull();
    act(() => scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 3000, behavior: "auto" });
    act(() => scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "PageUp", bubbles: true })));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "auto" });
  });

  it("permet de revenir sur les grandes plaques et de découvrir le niveau enfant", () => {
    advanceTo(4);
    const parcours = container.querySelector<HTMLButtonElement>("button[aria-label='Revenir au niveau Parcours']");
    expect(parcours).not.toBeNull();
    expect(parcours?.closest("[aria-hidden='true']")).toBeNull();
    act(() => parcours?.click());
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: "auto" });
    act(() => container.querySelector<HTMLButtonElement>("button.intro-child-plate")?.click());
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 5000, behavior: "auto" });
    act(() => container.querySelector<HTMLButtonElement>("button[data-intro-plate='0']")?.click());
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "auto" });
  });

  it("transmet l’élément cliqué avant de passer au niveau suivant", () => {
    advanceTo(2);
    const module2 = container.querySelector<HTMLButtonElement>("button[aria-label='Découvrir Module 2']");
    expect(module2).not.toBeNull();
    act(() => module2?.click());
    expect(onSelectChild).toHaveBeenCalledWith(2, 1);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 3000, behavior: "auto" });
  });

  it("montre trois boutons de formation seulement après le premier palier", () => {
    expect(container.querySelector("[aria-label='Choix de la formation présentée']")).toBeNull();
    advanceTo(1);
    const group = container.querySelector("[aria-label='Choix de la formation présentée']");
    expect(group?.querySelectorAll("button")).toHaveLength(3);
    expect(group?.querySelector("button[aria-pressed='true']")?.textContent).toContain("Développeur web");
    advanceTo(4);
    act(() => group?.querySelectorAll<HTMLButtonElement>("button")[1].click());
    expect(onSelectFormation).toHaveBeenCalledWith("hotel");
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "auto" });
  });

  it("limite les paliers et la pyramide aux niveaux du contenu réel", () => {
    act(() => root.render(
      <IntroOverviewScene cards={buildIntroCards({ includeExamples: false, formationTitles: ["Ma formation"], parcoursTitles: ["Mon parcours"] })} isSaving={false} onComplete={vi.fn()} />,
    ));
    const config: { onUpdate: (self: { progress: number }) => void } = motion.create.mock.calls[0][0];
    act(() => config.onUpdate({ progress: 1 }));
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector("[aria-label='Palier 2 sur 2']")).not.toBeNull();
    expect(container.querySelectorAll("button[data-intro-plate]:not([hidden])")).toHaveLength(2);
    expect(container.querySelectorAll(".intro-rail-item:not([hidden])")).toHaveLength(3);
    expect(container.textContent).toContain("Continuer la découverte");
  });

  it("présente quatre activités face à l’écran et relève le sélecteur au dernier palier", () => {
    advanceTo(6);
    const layer = container.querySelector<HTMLElement>(".intro-child-layer");
    expect(layer?.querySelectorAll(".intro-child-plate")).toHaveLength(4);
    expect(layer?.style.transform).toContain("rotateX(-22deg)");
    expect(layer?.style.transform).toContain("translateY(-110px)");
    const selector = container.querySelector("[aria-label='Choix de la formation présentée']")?.closest("fieldset")?.parentElement;
    expect(selector?.style.translate).toBe("0 -56px");
    // Les cartes posées, la couche « Activités » est mise en avant.
    expect(container.querySelector("button[aria-label='Revenir au niveau Activités']")?.getAttribute("data-active")).toBe("true");
    expect(container.querySelector("button[aria-label='Revenir au niveau Leçon']")?.getAttribute("data-active")).toBeNull();
    advanceTo(5);
    expect(selector?.style.translate).toBe("0 0px");
  });

  it("garde les plaques montées et leur profondeur lors du changement de niveau", () => {
    advanceTo(4);
    const parcours = container.querySelector<HTMLButtonElement>("button[aria-label='Revenir au niveau Parcours']");
    expect(parcours).not.toBeNull();
    if (parcours) parcours.style.transform = "translateZ(60px)";
    const config: { onUpdate: (self: { progress: number }) => void } = motion.create.mock.calls[0][0];
    act(() => config.onUpdate({ progress: 5 / 6 }));
    act(() => vi.advanceTimersByTime(120));
    expect(container.querySelector("button[aria-label='Revenir au niveau Parcours']")).toBe(parcours);
    expect(parcours?.style.transform).toBe("translateZ(60px)");
  });

  it("conserve la consigne demandée à tous les paliers sans l'effacer dans l'animation", () => {
    const hint = container.querySelector(".intro-scroll-hint");
    expect(hint?.textContent).toContain("Faire défiler vers le bas");
    for (const step of [1, 3, 6, 0]) {
      advanceTo(step);
      expect(container.querySelector(".intro-scroll-hint")).toBe(hint);
    }
    const fadedTargets = motion.timelineTo.mock.calls
      .filter(([, vars]) => typeof vars === "object" && vars !== null && "autoAlpha" in vars && vars.autoAlpha === 0)
      .flatMap(([target]) => Array.isArray(target) ? target : [target]);
    expect(fadedTargets).not.toContain(hint);
    advanceTo(6);
    // Au dernier niveau, chaque type d'activité est une carte cliquable qui ouvre un aperçu.
    const plates = container.querySelectorAll<HTMLButtonElement>("button.intro-child-plate");
    expect(plates).toHaveLength(4);
    expect(plates[0].getAttribute("aria-label")).toBe("Voir un exemple : Texte");
  });
});
