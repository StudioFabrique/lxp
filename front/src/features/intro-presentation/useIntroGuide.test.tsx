import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useIntroGuide, type IntroGuide } from "./useIntroGuide";

let root: Root;
let guide: IntroGuide;

const Probe = ({ count, resetKey, onGuide }: { count: number; resetKey: string; onGuide: (guide: IntroGuide) => void }) => {
  onGuide(useIntroGuide(count, resetKey));
  return null;
};
const render = (count: number, resetKey: string) => act(() => root.render(<Probe count={count} resetKey={resetKey} onGuide={(value) => { guide = value; }} />));

beforeEach(() => {
  vi.useFakeTimers();
  root = createRoot(document.createElement("div"));
});
afterEach(() => {
  act(() => root.unmount());
  vi.useRealTimers();
});

describe("useIntroGuide", () => {
  it("reste sur le premier message sans jamais avancer seul", () => {
    render(3, "a");
    act(() => vi.advanceTimersByTime(120_000));
    expect(guide.step).toBe(0);
    expect(guide.previous).toBeUndefined();
    expect(guide.next).toBeDefined();
  });

  it("avance et recule à la demande, sans « Suivant » au dernier message", () => {
    render(3, "a");
    act(() => guide.next?.());
    expect(guide.step).toBe(1);
    act(() => guide.next?.());
    expect(guide.step).toBe(2);
    expect(guide.next).toBeUndefined();
    act(() => guide.previous?.());
    expect(guide.step).toBe(1);
  });

  it("repart du premier message quand la clé change", () => {
    render(3, "a");
    act(() => guide.next?.());
    render(3, "b");
    expect(guide.step).toBe(0);
  });

  it("n'offre aucune navigation pour un message unique", () => {
    render(1, "a");
    expect(guide.previous).toBeUndefined();
    expect(guide.next).toBeUndefined();
  });
});
