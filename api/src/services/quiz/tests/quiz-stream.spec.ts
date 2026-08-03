import { Readable, Writable } from "stream";
import { relayQuizStream } from "../quiz-stream";

describe("quiz stream relay", () => {
  it("relaie les chunks à l'identique et traite les lignes fragmentées", async () => {
    const chunks = [
      'event: question\ndata: {"id":"q1","type":"mcq","pro',
      'mpt":"Question 1"}\n\n',
      'data: {"event":"done","tokens":{"total_tokens":21}}\n\n',
    ];
    let output = "";
    const questions: string[] = [];
    let trackedTokens = 0;
    const destination = new Writable({
      write(chunk, _encoding, callback) {
        output += chunk.toString();
        callback();
      },
    });

    await relayQuizStream(Readable.from(chunks), destination, {
      onQuestion: async (question) => {
        questions.push(String(question.id));
      },
      onDone: async (event) => {
        trackedTokens = event.tokens?.total_tokens || 0;
      },
    });

    expect(output).toBe(chunks.join(""));
    expect(questions).toEqual(["q1"]);
    expect(trackedTokens).toBe(21);
  });

  it("ignore les lignes de contrôle et les payloads non JSON", async () => {
    const questions: string[] = [];
    const destination = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });

    await relayQuizStream(
      Readable.from([": keep-alive\nevent: question\ndata: invalide\n\n"]),
      destination,
      {
        onQuestion: (question) => {
          questions.push(question.prompt);
        },
      },
    );

    expect(questions).toEqual([]);
  });
});
