import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  OVERVIEW_DIALOGUE,
  dialogueSchedule,
  typingDuration,
} from "./intro-dialogue";
import { useIntroDialogueStep } from "./useIntroDialogueStep";

let root: Root | null;
const latest: { step: number } = { step: -1 };

const Probe = ({ onStep }: { onStep: (step: number) => void }) => {
  onStep(useIntroDialogueStep(OVERVIEW_DIALOGUE));
  return null;
};

beforeEach(() => {
  vi.useFakeTimers();
  root = createRoot(document.createElement("div"));
  act(() => root?.render(<Probe onStep={(step) => { latest.step = step; }} />));
});
afterEach(() => {
  act(() => root?.unmount());
  vi.useRealTimers();
});

describe("dialogueSchedule", () => {
  it("espace les messages du temps de placement, d'attente et de lecture", () => {
    const starts = dialogueSchedule(OVERVIEW_DIALOGUE);

    expect(starts[0]).toBe(0);
    expect(starts).toHaveLength(OVERVIEW_DIALOGUE.length);
    starts.slice(1).forEach((start, index) => expect(start).toBeGreaterThan(starts[index]));
  });

  it("allonge les points d'attente pour un message plus long, dans une limite", () => {
    expect(typingDuration("a".repeat(100))).toBeGreaterThan(typingDuration("a"));
    expect(typingDuration("a".repeat(10_000))).toBeLessThanOrEqual(2200);
  });
});

describe("useIntroDialogueStep", () => {
  it("commence au premier message puis avance quand il est lu", () => {
    const starts = dialogueSchedule(OVERVIEW_DIALOGUE);
    expect(latest.step).toBe(0);

    act(() => vi.advanceTimersByTime(starts[1] - 1));
    expect(latest.step).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(latest.step).toBe(1);

    act(() => vi.advanceTimersByTime(starts[2] - starts[1]));
    expect(latest.step).toBe(2);
  });

  it("s'arrête au dernier message", () => {
    act(() => vi.advanceTimersByTime(120_000));
    expect(latest.step).toBe(OVERVIEW_DIALOGUE.length - 1);
  });

  it("annule les messages en attente au démontage", () => {
    act(() => root?.unmount());
    root = null;
    act(() => vi.advanceTimersByTime(120_000));
    expect(latest.step).toBe(0);
  });
});
