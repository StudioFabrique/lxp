import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import useCourseQuiz from "./use-course-quiz";
import { quizApi } from "../api/quiz.api";
vi.mock("../../../store/DemoContext", () => ({ useDemoMode: () => ({ aiDisabled: false }) }));
vi.mock("../../../store/ChatbotProvider", async () => {
  const { createContext } = await import("react");
  return { ChatbotContext: createContext({ aiUnavailable: false, setAiUnavailable: vi.fn() }) };
});
vi.mock("./use-quiz-attempt-tracking", () => ({ default: () => ({ start: vi.fn(), recordAnswer: vi.fn(), finish: vi.fn() }) }));
vi.mock("../api/quiz.api", () => ({ quizApi: { queries: { streamEndingQuiz: vi.fn(), requestRandomQuestion: vi.fn() } } }));
let root: Root;
let hook: ReturnType<typeof useCourseQuiz>;
function Harness() {
  const state = useCourseQuiz(1);
  useEffect(() => { hook = state; });
  return null;
}
const question = (id: string) => ({ id, type: "true_false", prompt: id, answer_key: true });
const encode = (payloads: unknown[], newline = true) => new TextEncoder().encode(payloads.map((p) => JSON.stringify(p)).join("\n") + (newline ? "\n" : ""));
beforeEach(async () => {
  vi.clearAllMocks();
  root = createRoot(document.createElement("div"));
  await act(async () => root.render(<Harness />));
});
afterEach(async () => { await act(async () => root.unmount()); });
it("un double clic ne cumule pas deux séries et déduplique les questions", async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  vi.mocked(quizApi.queries.streamEndingQuiz).mockResolvedValue(new ReadableStream({ start(c) { controller = c; } }));
  await act(async () => {
    const loading = hook.onLoadQuizzes();
    await hook.onLoadQuizzes();
    controller.enqueue(encode([question("1"), question("1"), question("2"), { event: "done" }], false));
    controller.close();
    await loading;
  });
  expect(quizApi.queries.streamEndingQuiz).toHaveBeenCalledOnce();
  expect(hook.quizzes?.map((q) => q.id)).toEqual(["1", "2"]);
  expect(hook.isStreaming).toBe(false);
});
it("les mauvaises réponses ne génèrent pas de questions et ne terminent pas la série", async () => {
  vi.mocked(quizApi.queries.streamEndingQuiz).mockResolvedValue(new ReadableStream({ start(c) {
    c.enqueue(encode([question("1"), question("2"), question("3"), question("4"), { event: "done" }])); c.close();
  } }));
  await act(async () => { await hook.onLoadQuizzes(); });
  for (let i = 0; i < 4; i++) {
    await act(async () => hook.onAnswerQuiz(false, { type: "true_false", selected: false }));
    expect(hook.showResults).toBe(false);
    await act(async () => hook.onNextQuiz());
  }
  expect(quizApi.queries.requestRandomQuestion).not.toHaveBeenCalled();
  expect(hook.showResults).toBe(true);
  expect(hook.attempts).toHaveLength(4);
});
it("ignore un ancien chargement après fermeture et réouverture", async () => {
  let resolveOld!: (stream: ReadableStream<Uint8Array>) => void;
  vi.mocked(quizApi.queries.streamEndingQuiz).mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  let oldLoading!: Promise<void>;
  await act(async () => { oldLoading = hook.onLoadQuizzes(); });
  const oldSignal = vi.mocked(quizApi.queries.streamEndingQuiz).mock.calls[0][1];
  await act(async () => hook.onCloseQuizzes());
  expect(oldSignal?.aborted).toBe(true);
  vi.mocked(quizApi.queries.streamEndingQuiz).mockResolvedValue(new ReadableStream({ start(c) { c.enqueue(encode([question("new"), { event: "done" }])); c.close(); } }));
  await act(async () => { await hook.onLoadQuizzes(); });
  await act(async () => { resolveOld(new ReadableStream({ start(c) { c.close(); } })); await oldLoading; });
  expect(hook.quizzes?.map((q) => q.id)).toEqual(["new"]);
});
