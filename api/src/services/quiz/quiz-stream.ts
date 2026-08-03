import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";
import { type AiQuizQuestion, isAiQuizQuestion } from "./quiz-question.ts";

export interface QuizStreamDoneEvent {
  event: "done";
  tokens?: {
    total_tokens?: number;
  };
  [key: string]: unknown;
}

type QuizStreamHandlers = {
  onQuestion: (question: AiQuizQuestion) => Promise<void> | void;
  onDone?: (event: QuizStreamDoneEvent) => Promise<void> | void;
};

export function parseQuizStreamLine(
  line: string,
): AiQuizQuestion | QuizStreamDoneEvent | null {
  const cleanLine = line.trim().replace(/^data:\s*/, "");
  if (!cleanLine || cleanLine.startsWith("event:")) return null;

  try {
    const parsed = JSON.parse(cleanLine) as unknown;

    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as Record<string, unknown>).event === "done"
    ) {
      return parsed as QuizStreamDoneEvent;
    }

    return isAiQuizQuestion(parsed) ? parsed : null;
  } catch (error) {
    // Les lignes SSE de contrôle ou de commentaire ne sont pas des payloads.
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

function isDoneEvent(
  event: AiQuizQuestion | QuizStreamDoneEvent,
): event is QuizStreamDoneEvent {
  return "event" in event && event.event === "done";
}

/**
 * Relaie le flux sans en modifier le format et traite chaque événement complet
 * avant de l'exposer au client (notamment pour rendre la question signalable).
 */
export async function relayQuizStream(
  source: Readable,
  destination: Writable,
  handlers: QuizStreamHandlers,
) {
  let lineBuffer = "";

  const handleLine = async (line: string) => {
    const event = parseQuizStreamLine(line);
    if (!event) return;

    if (isDoneEvent(event)) {
      await handlers.onDone?.(event);
      return;
    }

    await handlers.onQuestion(event);
  };

  const captureStream = new Transform({
    transform(chunk, _encoding, callback) {
      lineBuffer += chunk.toString();
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() || "";

      (async () => {
        for (const line of lines) await handleLine(line);
      })()
        .then(() => {
          this.push(chunk);
          callback();
        })
        .catch(callback);
    },
    flush(callback) {
      handleLine(lineBuffer).then(() => callback(), callback);
    },
  });

  await pipeline(source, captureStream, destination);
}
