import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import IntroMobileSpace from "./IntroMobileSpace";
import type { IntroSpaceContent } from "./intro-space-content";

const reducedMotion = vi.hoisted(() => ({ value: false }));
vi.mock("./intro-motion", () => ({ prefersReducedMotion: () => reducedMotion.value }));

const content: IntroSpaceContent = {
  space: "team",
  spaceLabel: "Espace équipe",
  userName: "Martin D",
  initials: "MD",
  roleLabel: "Administrateur",
  title: "Bonjour Martin !",
  message: "",
  headerAction: "Créer ma première formation",
  nav: [],
  cards: [],
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  reducedMotion.value = false;
});

describe("IntroMobileSpace", () => {
  it("construit la barre mobile avec le titre du dashboard, puis rend la main", () => {
    const onEnded = vi.fn();
    act(() => root.render(<IntroMobileSpace content={content} onEnded={onEnded} />));
    expect(container.textContent).toContain("Bonjour Martin !");
    expect(container.textContent).toContain("Créer ma première formation");
    expect(onEnded).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(4100));
    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it("attend le clic de l'utilisateur quand les animations sont réduites", () => {
    reducedMotion.value = true;
    const onEnded = vi.fn();
    act(() => root.render(<IntroMobileSpace content={content} onEnded={onEnded} />));
    act(() => vi.advanceTimersByTime(10_000));
    expect(onEnded).not.toHaveBeenCalled();
    act(() => container.querySelector("button")?.click());
    expect(onEnded).toHaveBeenCalledTimes(1);
  });
});
