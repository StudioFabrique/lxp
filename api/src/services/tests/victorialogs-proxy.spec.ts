import {
  buildUpstreamUrl,
  forwardToVictoriaLogs,
  ObservabilityForbiddenPathError,
  ObservabilityUnavailableError,
} from "../../utils/services/observability/victorialogs-proxy.ts";

const base = "http://victorialogs:9428";

describe("proxy des journaux VictoriaLogs", () => {
  afterEach(() => {
    delete process.env.OBSERVABILITY_URL;
    delete process.env.DEMO_MODE;
  });

  it("transmet une requête de lecture vers l'hôte configuré", () => {
    const url = buildUpstreamUrl(
      base,
      "/v1/observability/select/logsql/query?query=event%3A%22auth.login%22",
    );
    expect(url.origin).toBe(base);
    expect(url.pathname).toBe("/v1/observability/select/logsql/query");
    expect(url.search).toContain("query=");
  });

  it.each([
    "/v1/observability/insert/jsonline",
    "/v1/observability/internal/force_flush",
    "/v1/observability/select/../insert/jsonline",
    "/v1/observability/select/%2e%2e/insert/jsonline",
    "/v1/observability//evil.example/select/x",
  ])("refuse le chemin %s", (path) => {
    expect(() => buildUpstreamUrl(base, path)).toThrow(
      ObservabilityForbiddenPathError,
    );
  });

  it("ne change jamais d'hôte, même avec une URL en forme absolue", () => {
    const url = buildUpstreamUrl(
      base,
      "http://evil.example/v1/observability/select/x?query=*",
    );
    expect(url.origin).toBe(base);
    expect(url.pathname).toBe("/v1/observability/select/x");
  });

  it("refuse un POST hors de /select/logsql/", async () => {
    process.env.OBSERVABILITY_URL = base;
    await expect(
      forwardToVictoriaLogs(
        "POST",
        "/v1/observability/select/vmui/x",
        undefined,
        { content: "query=*", contentType: "application/x-www-form-urlencoded" },
      ),
    ).rejects.toThrow(ObservabilityForbiddenPathError);
  });

  it("est indisponible sans OBSERVABILITY_URL", async () => {
    await expect(
      forwardToVictoriaLogs("GET", "/v1/observability/select/vmui/"),
    ).rejects.toThrow(ObservabilityUnavailableError);
  });

  it("est indisponible en mode démonstration", async () => {
    process.env.OBSERVABILITY_URL = base;
    process.env.DEMO_MODE = "true";
    await expect(
      forwardToVictoriaLogs("GET", "/v1/observability/select/vmui/"),
    ).rejects.toThrow(ObservabilityUnavailableError);
  });
});
