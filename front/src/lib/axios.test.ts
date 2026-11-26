import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-hot-toast", () => ({ default: vi.fn() }));

import toast from "react-hot-toast";
import apiClient, { isDemoBlockedError, setDemoMode } from "./axios";

/**
 * Le refus s'exerce dans l'intercepteur de requête : rien ne part sur le
 * réseau, la promesse est rejetée avec `isDemoReadOnly`. On l'observe donc
 * directement, sans serveur simulé.
 */
const attempt = (method: "post" | "put" | "get", url: string) =>
  apiClient.request({ method, url }).then(
    () => "resolved" as const,
    (error: { isDemoReadOnly?: boolean }) =>
      error.isDemoReadOnly ? ("blocked" as const) : ("rejected" as const),
  );

afterEach(() => {
  vi.mocked(toast).mockClear();
  setDemoMode(false);
});

describe("client HTTP en mode démonstration", () => {
  it("bloque le suivi de consultation sans notifier l'apprenant", async () => {
    setDemoMode(true);

    await expect(
      attempt("post", "/content-read/lesson/12/begin"),
    ).resolves.toBe("blocked");
    await expect(
      attempt("post", "/content-read/activity/34/heartbeat"),
    ).resolves.toBe("blocked");

    expect(vi.mocked(toast)).not.toHaveBeenCalled();
  });

  it("bloque le suivi des passations de quiz sans notifier l'apprenant", async () => {
    setDemoMode(true);

    await expect(attempt("post", "/quiz/attempt")).resolves.toBe("blocked");
    await expect(attempt("post", "/quiz/attempt/5/answer")).resolves.toBe(
      "blocked",
    );
    await expect(attempt("put", "/quiz/attempt/5/finish")).resolves.toBe(
      "blocked",
    );

    expect(vi.mocked(toast)).not.toHaveBeenCalled();
  });

  it("reconnaît une erreur issue du verrou de démonstration", () => {
    expect(isDemoBlockedError({ isDemoReadOnly: true })).toBe(true);
    expect(
      isDemoBlockedError({ response: { data: { code: "DEMO_READ_ONLY" } } }),
    ).toBe(true);
    expect(isDemoBlockedError(new Error("réseau"))).toBe(false);
    expect(isDemoBlockedError(null)).toBe(false);
  });

  it("notifie sur une écriture issue d'un geste de l'apprenant", async () => {
    setDemoMode(true);

    await expect(
      attempt("put", "/content-read/lesson/12/finish"),
    ).resolves.toBe("blocked");
    await expect(attempt("post", "/lesson/rate/12")).resolves.toBe("blocked");

    expect(vi.mocked(toast)).toHaveBeenCalledWith("Indisponible en mode démo", {
      id: "demo-read-only",
    });
  });

  it("ne bloque rien hors démonstration", async () => {
    const result = await attempt("post", "/content-read/lesson/12/begin");

    // La requête part réellement : elle échoue faute de serveur, mais pas au
    // titre de la démonstration.
    expect(result).toBe("rejected");
    expect(vi.mocked(toast)).not.toHaveBeenCalled();
  });
});

describe("client HTTP face à un lien d'activation invalide", () => {
  const rejectWith401 = (url: string) => {
    const calls: string[] = [];
    const adapter = (config: { url?: string }) => {
      calls.push(String(config.url));
      return Promise.reject(
        Object.assign(new Error("401"), {
          config,
          response: {
            status: 401,
            data: { message: "Ce lien n'est plus valide." },
          },
        }),
      );
    };
    return {
      calls,
      run: () =>
        apiClient
          .request({ method: "post", url, adapter })
          .then(() => null, (error: { response: { data: { message: string } } }) => error),
    };
  };

  it("conserve le message du lien sans tenter de renouveler la session", async () => {
    const { calls, run } = rejectWith401("/user/check-invitation");
    const error = await run();

    expect(error?.response.data.message).toBe("Ce lien n'est plus valide.");
    expect(calls).toEqual(["/user/check-invitation"]);
  });
});
