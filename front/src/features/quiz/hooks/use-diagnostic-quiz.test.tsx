import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import toast from "react-hot-toast";
import { quizApi } from "../api/quiz.api";
import useDiagnosticQuiz from "./use-diagnostic-quiz";

vi.mock("../api/quiz.api", () => ({
  quizApi: { queries: {
    getPreliminaryProgress: vi.fn().mockResolvedValue(null),
    streamPreliminaryQuiz: vi.fn(),
  } },
}));
vi.mock("./use-quiz-attempt-tracking", () => ({ default: () => tracking }));
vi.mock("../../../store/ChatbotProvider", async () => {
  const { createContext } = await import("react");
  return { ChatbotContext: createContext({ setForceHideChatbot: vi.fn(), setAiUnavailable }) };
});
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn(), success: vi.fn() } }));
vi.mock("../../../store/DemoContext", () => ({ useDemoMode: () => ({ aiDisabled: runtime.aiDisabled }) }));

const runtime = vi.hoisted(() => ({ aiDisabled: false }));
const setAiUnavailable = vi.hoisted(() => vi.fn());
const tracking = { start: vi.fn(), finish: vi.fn(), restore: vi.fn() };
const onFinish = vi.fn();
const completeInfo = {
  id: 1,
  title: "Module",
  description: "Description pédagogique",
  quizInstructions: "Évaluer les connaissances initiales",
  hasQuizContent: true,
};
let root: Root | undefined;
let diagnostic: ReturnType<typeof useDiagnosticQuiz>;
type ModuleInfo = Parameters<typeof useDiagnosticQuiz>[2];
function Harness({ info, loaded = true, started = false }: { info: ModuleInfo; loaded?: boolean; started?: boolean }) {
  const quiz = useDiagnosticQuiz(started, loaded, info, onFinish);
  useEffect(() => { diagnostic = quiz; });
  return null;
}
async function render(info: ModuleInfo = completeInfo, loaded = true, started = false) {
  root ??= createRoot(document.createElement("div"));
  await act(async () => root!.render(<Harness info={info} loaded={loaded} started={started} />));
}
beforeEach(() => {
  runtime.aiDisabled = false;
  vi.mocked(quizApi.queries.getPreliminaryProgress).mockResolvedValue(null);
});
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  vi.clearAllMocks();
});

describe("éligibilité du diagnostic initial", () => {
  const cachedInfo = { ...completeInfo, hasPreliminaryQuiz: true, hasQuizContent: false, quizInstructions: "" };
  const question = {
    id: "question-1", type: "true_false" as const, difficulty: "easy" as const,
    prompt: "Vrai ou faux ?", choices: null, answer_key: true,
    explanation_correct: "Oui", explanation_wrong: "Non",
  };

  it("lance le quiz enregistré sans consignes ni indexation après le début des leçons", async () => {
    vi.mocked(quizApi.queries.streamPreliminaryQuiz).mockResolvedValue(new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`event: question\ndata: ${JSON.stringify(question)}\n\nevent: done\ndata: {"status":"cached"}\n\n`));
        controller.close();
      },
    }));
    await render(cachedInfo, true, true);
    expect(diagnostic.isOpen).toBe(true);
    expect(onFinish).not.toHaveBeenCalled();
    await act(async () => diagnostic.onStartQuiz());
    expect(quizApi.queries.streamPreliminaryQuiz).toHaveBeenCalledWith(1);
    expect(diagnostic.currentQuiz?.id).toBe("question-1");
    expect(tracking.start).toHaveBeenCalledWith("preliminary", { moduleId: 1 });
    expect(setAiUnavailable).not.toHaveBeenCalled();
  });

  it("reprend une passation inachevée même si une leçon a déjà été ouverte", async () => {
    vi.mocked(quizApi.queries.getPreliminaryProgress).mockResolvedValue({
      attemptId: 9, finished: false, questions: [question, { ...question, id: "question-2" }],
      answers: [{ externalId: question.id, isCorrect: true, userAnswer: { type: "true_false", selected: true } }],
    });
    await render(cachedInfo, true, true);
    expect(diagnostic.isOpen).toBe(true);
    expect(diagnostic.isStarted).toBe(true);
    expect(diagnostic.currentQuiz?.id).toBe("question-2");
    expect(diagnostic.score).toBe(1);
    expect(tracking.restore).toHaveBeenCalledWith(9);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("ne repropose pas un diagnostic déjà terminé", async () => {
    vi.mocked(quizApi.queries.getPreliminaryProgress).mockResolvedValue({
      attemptId: 9, finished: true, questions: [question], answers: [],
    });
    await render(cachedInfo, true, true);
    expect(diagnostic.isOpen).toBe(false);
    expect(onFinish).toHaveBeenCalledTimes(1);
    await render(cachedInfo, true, true);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(quizApi.queries.streamPreliminaryQuiz).not.toHaveBeenCalled();
  });

  it("propose le quiz enregistré même lorsque la génération IA est désactivée", async () => {
    runtime.aiDisabled = true;
    await render(cachedInfo);
    expect(diagnostic.isOpen).toBe(true);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("passe la génération lorsque l'IA est désactivée et aucun quiz n'est enregistré", async () => {
    runtime.aiDisabled = true;
    await render();
    expect(diagnostic.isOpen).toBe(false);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["un devoir seul", { hasQuizContent: false }],
    ["un titre absent", { title: "" }],
    ["une description absente", { description: "" }],
    ["des instructions absentes", { quizInstructions: "" }],
    ["des instructions non renseignées", { quizInstructions: undefined }],
    ["une description remplie d'espaces", { description: "   " }],
    ["des instructions remplies d'espaces", { quizInstructions: "   " }],
  ])("ne propose aucun quiz pour %s", async (_name, missing) => {
    await render({ ...completeInfo, ...missing });
    expect(diagnostic.isOpen).toBe(false);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(quizApi.queries.getPreliminaryProgress).not.toHaveBeenCalled();
    await act(async () => diagnostic.onStartQuiz());
    expect(quizApi.queries.streamPreliminaryQuiz).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(setAiUnavailable).not.toHaveBeenCalled();
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("attend le chargement du module avant de décider", async () => {
    await render({ ...completeInfo, hasQuizContent: false }, false);
    expect(onFinish).not.toHaveBeenCalled();
    await render({ ...completeInfo, hasQuizContent: false });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("propose et restaure le diagnostic quand le contenu et les consignes sont présents", async () => {
    await render();
    expect(diagnostic.isOpen).toBe(true);
    expect(quizApi.queries.getPreliminaryProgress).toHaveBeenCalledWith(1);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("recalcule l'éligibilité au changement de module", async () => {
    await render();
    await render({ ...completeInfo, id: 2, hasQuizContent: false });
    expect(diagnostic.isOpen).toBe(false);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(quizApi.queries.getPreliminaryProgress).toHaveBeenCalledTimes(1);
  });
});
