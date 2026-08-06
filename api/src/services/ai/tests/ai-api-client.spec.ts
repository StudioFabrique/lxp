import { jest } from "@jest/globals";
import {
  AiApiClient,
  AiApiError,
  AiConfigurationError,
} from "../ai-api-client.ts";

describe("AiApiClient", () => {
  afterEach(() => jest.restoreAllMocks());

  it("centralise l'URL, l'authentification et le format JSON", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ result: "ok" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    const client = new AiApiClient("http://ai.test/", "test-secret");

    await expect(
      client.postJson<{ result: string }>("/quiz/random", {
        subject: "student-1",
        body: { content: "cours" },
      }),
    ).resolves.toEqual({ result: "ok" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://ai.test/quiz/random",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: expect.stringMatching(/^Bearer /),
        }),
      }),
    );
  });

  it("conserve le statut et le payload d'une erreur du service IA", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "payload invalide" }), {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const client = new AiApiClient("http://ai.test", "test-secret");

    await expect(
      client.postJson("/quiz/random", { subject: "student-1", body: {} }),
    ).rejects.toMatchObject<Partial<AiApiError>>({
      status: 422,
      responseBody: { error: "payload invalide" },
    });
  });

  it("échoue explicitement lorsque le secret est absent", async () => {
    const client = new AiApiClient("http://ai.test", undefined);

    await expect(
      client.postJson("/quiz/random", { subject: "student-1", body: {} }),
    ).rejects.toBeInstanceOf(AiConfigurationError);
  });
});
