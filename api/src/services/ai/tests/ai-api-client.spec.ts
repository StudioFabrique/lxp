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

  it("garde le statut d'une erreur renvoyée en texte brut", async () => {
    // Une exception non gérée côté FastAPI répond « Internal Server Error » en
    // texte : l'appelant doit malgré tout recevoir le statut, pas une erreur
    // d'analyse JSON.
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Internal Server Error", {
        status: 500,
        statusText: "Internal Server Error",
        headers: { "Content-Type": "text/plain" },
      }),
    );
    const client = new AiApiClient("http://ai.test", "test-secret");

    await expect(
      client.postJson("/indicators/predict", { subject: "student-1", body: {} }),
    ).rejects.toMatchObject<Partial<AiApiError>>({
      status: 500,
      responseBody: "Internal Server Error",
    });
  });

  it("échoue explicitement lorsque le secret est absent", async () => {
    const client = new AiApiClient("http://ai.test", undefined);

    await expect(
      client.postJson("/quiz/random", { subject: "student-1", body: {} }),
    ).rejects.toBeInstanceOf(AiConfigurationError);
  });
});
