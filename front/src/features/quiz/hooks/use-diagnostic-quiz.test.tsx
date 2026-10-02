import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
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
function Harness({ info, loaded = true }: { info: ModuleInfo; loaded?: boolean }) {
  const quiz = useDiagnosticQuiz(false, loaded, info, onFinish);
  useEffect(() => { diagnostic = quiz; });
  return null;
}
async function render(info: ModuleInfo = completeInfo, loaded = true) {
  root ??= createRoot(document.createElement("div"));
  await act(async () => root!.render(<Harness info={info} loaded={loaded} />));
}
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  vi.clearAllMocks();
});

describe("éligibilité du diagnostic initial", () => {
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
