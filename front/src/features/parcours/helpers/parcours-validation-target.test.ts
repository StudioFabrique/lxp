import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { goToValidationTarget } from "./parcours-validation-target";

describe("goToValidationTarget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 16),
    );
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("ouvre l'étape, amène le bloc au centre, le met en évidence et lui donne le focus", () => {
    document.body.innerHTML = '<div id="parcours-field-objectives">Objectifs</div>';
    const updateStep = vi.fn();

    goToValidationTarget("objectives", updateStep);
    vi.advanceTimersByTime(20);

    const target = document.getElementById("parcours-field-objectives")!;
    expect(updateStep).toHaveBeenCalledWith(2);
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(document.activeElement).toBe(target);
    expect(target.classList.contains("ring-primary")).toBe(true);

    vi.advanceTimersByTime(2500);
    expect(target.classList.contains("ring-primary")).toBe(false);
  });

  it("attend que l'étape soit rendue avant de chercher le bloc", () => {
    const updateStep = vi.fn();
    goToValidationTarget("groups", updateStep);
    vi.advanceTimersByTime(100);

    document.body.innerHTML = '<section id="parcours-field-groups">Groupes</section>';
    vi.advanceTimersByTime(40);

    expect(updateStep).toHaveBeenCalledWith(6);
    expect(document.activeElement?.id).toBe("parcours-field-groups");
  });

  it("n'ouvre que l'étape des modules, qui n'ont pas de bloc unique", () => {
    document.body.innerHTML = '<div id="parcours-field-modules">Modules</div>';
    const updateStep = vi.fn();

    goToValidationTarget("modules", updateStep);
    vi.advanceTimersByTime(40);

    expect(updateStep).toHaveBeenCalledWith(4);
    expect(document.activeElement).not.toBe(document.getElementById("parcours-field-modules"));
  });
});
