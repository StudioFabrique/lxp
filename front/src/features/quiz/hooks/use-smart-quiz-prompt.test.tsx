import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useSmartQuizPrompt from "./use-smart-quiz-prompt";
import type { Activity } from "../../../utils/interfaces/activity";

type Props = Parameters<typeof useSmartQuizPrompt>[0];
let root: Root;
let props: Props;
let hook: ReturnType<typeof useSmartQuizPrompt>;
const activity = (id: number, type = "text") => ({ id, type }) as Activity;
function Harness() {
  const quizPrompt = useSmartQuizPrompt(props);
  useEffect(() => { hook = quizPrompt; });
  return null;
}
async function render(changes: Partial<Props> = {}) {
  props = { ...props, ...changes };
  await act(async () => root.render(<Harness />));
}
beforeEach(() => {
  vi.useFakeTimers();
  root = createRoot(document.createElement("div"));
  props = {
    selectedActivity: activity(1),
    estimatedReadTimeMs: 120_000,
    isLessonCompleted: false,
    isAnyQuizOpen: false,
    onTriggerRandomQuiz: vi.fn(),
    onGoToNextActivity: vi.fn(),
    onCompleteLesson: vi.fn(),
  };
});
afterEach(async () => {
  await act(async () => root.unmount());
  vi.useRealTimers();
});

describe("Quiz rapide avant de continuer", () => {
  it.each(["handleNextActivity", "handleCompleteLesson"] as const)(
    "propose le quiz si le clic sur %s est trop rapide", async (action) => {
      await render();
      await act(async () => hook[action]());
      expect(hook.showQuizPrompt).toBe(true);
      expect(props.onGoToNextActivity).not.toHaveBeenCalled();
      expect(props.onCompleteLesson).not.toHaveBeenCalled();
    },
  );
  it.each(["handleNextActivity", "handleCompleteLesson"] as const)(
    "reprend la bonne action après refus depuis %s", async (action) => {
      await render();
      await act(async () => hook[action]());
      await act(async () => hook.handleDeclineQuiz());
      expect(hook.showQuizPrompt).toBe(false);
      expect(props.onGoToNextActivity).toHaveBeenCalledTimes(action === "handleNextActivity" ? 1 : 0);
      expect(props.onCompleteLesson).toHaveBeenCalledTimes(action === "handleCompleteLesson" ? 1 : 0);
    },
  );
  it("attend le quiz accepté avant de pouvoir terminer la leçon", async () => {
    await render();
    await act(async () => hook.handleCompleteLesson());
    await act(async () => hook.handleAcceptQuiz());
    expect(props.onTriggerRandomQuiz).toHaveBeenCalledOnce();
    expect(props.onCompleteLesson).not.toHaveBeenCalled();
    await render({ isAnyQuizOpen: true });
    await act(async () => hook.handleCompleteLesson());
    expect(props.onCompleteLesson).not.toHaveBeenCalled();
    await render({ isAnyQuizOpen: false });
    await act(async () => hook.handleCompleteLesson());
    expect(props.onCompleteLesson).toHaveBeenCalledOnce();
  });
  it("ne dispense pas une nouvelle activité quand le quiz précédent se ferme", async () => {
    await render({ isAnyQuizOpen: true });
    await render({ selectedActivity: activity(2), isAnyQuizOpen: false });
    await act(async () => hook.handleNextActivity());
    expect(hook.showQuizPrompt).toBe(true);
  });
  it("réinitialise le contrôle après avoir refusé sur l'activité précédente", async () => {
    await render();
    await act(async () => hook.handleNextActivity());
    await act(async () => hook.handleDeclineQuiz());
    await render({ selectedActivity: activity(2) });
    await act(async () => hook.handleNextActivity());
    expect(hook.showQuizPrompt).toBe(true);
  });
  it.each([60_000, 240_000])("continue dans la fenêtre de lecture (%i ms)", async (time) => {
    await render();
    vi.advanceTimersByTime(time);
    await act(async () => hook.handleCompleteLesson());
    expect(hook.showQuizPrompt).toBe(false);
    expect(props.onCompleteLesson).toHaveBeenCalledOnce();
  });
  it("propose le quiz au-delà du double du temps estimé", async () => {
    await render();
    vi.advanceTimersByTime(240_001);
    await act(async () => hook.handleNextActivity());
    expect(hook.showQuizPrompt).toBe(true);
  });
  it.each([
    { estimate: 30_000, elapsed: 14_999, prompt: false },
    { estimate: 30_000, elapsed: 15_000, prompt: false },
    { estimate: 30_000, elapsed: 60_000, prompt: false },
    { estimate: 30_000, elapsed: 60_001, prompt: false },
    { estimate: 60_000, elapsed: 29_999, prompt: true },
    { estimate: 60_000, elapsed: 30_000, prompt: false },
    { estimate: 60_000, elapsed: 120_001, prompt: true },
    { estimate: 600_000, elapsed: 120_000, prompt: true },
    { estimate: 600_000, elapsed: 360_000, prompt: false },
    { estimate: 600_000, elapsed: 1_200_001, prompt: true },
  ])("adapte les seuils au contenu : %j", async ({ estimate, elapsed, prompt }) => {
    await render({ estimatedReadTimeMs: estimate });
    vi.advanceTimersByTime(elapsed);
    await act(async () => hook.handleNextActivity());
    expect(hook.showQuizPrompt).toBe(prompt);
    expect(props.onGoToNextActivity).toHaveBeenCalledTimes(prompt ? 0 : 1);
  });
  it.each(["handleNextActivity", "handleCompleteLesson"] as const)(
    "exclut les lectures de moins d'une minute depuis %s, même après une longue attente", async (action) => {
      await render({ estimatedReadTimeMs: 59_999 });
      await act(async () => hook[action]());
      expect(hook.showQuizPrompt).toBe(false);
      vi.advanceTimersByTime(600_000);
      await act(async () => hook[action]());
      expect(hook.showQuizPrompt).toBe(false);
      expect(props.onTriggerRandomQuiz).not.toHaveBeenCalled();
    },
  );
  it.each([
    { isLessonCompleted: true },
    { aiIndexed: false },
    { estimatedReadTimeMs: undefined },
    { estimatedReadTimeMs: 0 },
    { selectedActivity: activity(1, "video") },
  ])("continue sans quiz pour %j", async (changes) => {
    await render(changes);
    await act(async () => hook.handleCompleteLesson());
    expect(hook.showQuizPrompt).toBe(false);
    expect(props.onCompleteLesson).toHaveBeenCalledOnce();
  });
});
