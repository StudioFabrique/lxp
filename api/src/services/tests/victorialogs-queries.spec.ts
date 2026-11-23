import { jest } from "@jest/globals";
import { matchedData, validationResult } from "express-validator";
import {
  type ActivityRange,
  DETAIL_KINDS,
  getActivityDetails,
  getActivityOverview,
  getUserActivity,
  userIdFromLogField,
} from "../../utils/services/observability/victorialogs-queries.ts";
import { ObservabilityUnavailableError } from "../../utils/services/observability/victorialogs-proxy.ts";
import {
  detailsValidator,
  overviewValidator,
  userActivityValidator,
} from "../../routes/v1/observability/observability.validators.ts";

const preset = (period: "24h" | "7d" | "30d"): ActivityRange => ({ kind: "preset", period });
const custom = (from: string, to: string): ActivityRange => ({
  kind: "custom",
  from: new Date(from),
  to: new Date(to),
});

const ndjson = (rows: object[]) => rows.map((row) => JSON.stringify(row)).join("\n");

const run = async (chains: unknown[], req: object) => {
  for (const chain of chains.slice(0, -1) as { run: (r: object) => Promise<unknown> }[]) {
    await chain.run(req);
  }
  return req;
};

describe("requêtes d'activité VictoriaLogs", () => {
  const sentQueries: string[] = [];

  beforeEach(() => {
    process.env.OBSERVABILITY_URL = "http://victorialogs:9428";
    sentQueries.length = 0;
    jest.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      const query = String((init?.body as URLSearchParams).get("query"));
      sentQueries.push(query);
      if (query.includes("count_uniq(userId)"))
        return new Response(ndjson([{ n: "9", users: "2" }]));
      if (query.includes("by (status)"))
        return new Response(ndjson([{ status: "200", n: "7" }, { status: "500", n: "1" }]));
      if (query.includes("avg(durationMs)") && query.includes("by (method"))
        return new Response(ndjson([{ method: "GET", path: "/v1/a/:id", avg_ms: "12.6", hits: "3" }]));
      if (query.includes("stats by (_time:1h)"))
        return new Response(ndjson([{ _time: "2026-11-23T09:00:00Z", n: "3" }, { _time: "2026-11-23T10:00:00Z", n: "6" }]));
      if (query.includes("quantile(0.95, durationMs) as p95") && !query.includes("by (method"))
        return new Response(ndjson([{ avg_ms: "45.4", p95: "97" }]));
      if (query.includes("by (user)"))
        return new Response(ndjson([{ user: "6b0442fd94346451f219a8fd-root", hits: "264", last: "2026-11-23T14:00:00Z" }, { user: "-anonyme", hits: "2", last: "x" }]));
      if (query.includes("fields _time, method, path, status, user"))
        return new Response(ndjson([{ _time: "t", method: "GET", path: "/v1/a", status: "503", user: "6b0442fd94346451f219a8fd-root", durationMs: "39" }, { _time: "t2", method: "GET", path: "/v1/b", status: "500", user: "-anonyme", durationMs: "5" }]));
      if (query.includes("fields _time, userId"))
        return new Response(ndjson([{ _time: "2026-11-23T10:00:00Z", userId: "6b0442fd94346451f219a8fd", from: "::1" }]));
      return new Response(ndjson([{ n: "4" }]));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.OBSERVABILITY_URL;
    delete process.env.DEMO_MODE;
  });

  it("assemble les statistiques et exclut l'interface de consultation", async () => {
    const overview = await getActivityOverview(preset("7d"));
    expect(overview.totals).toMatchObject({ logins: 9, loginUsers: 2, requests: 4 });
    expect(overview.slowestRoutes[0]).toEqual({ method: "GET", path: "/v1/a/:id", avgMs: 13, hits: 3 });
    expect(overview.recentLogins[0].userId).toBe("6b0442fd94346451f219a8fd");
    expect(sentQueries.every((query) => query.startsWith("_time:7d "))).toBe(true);
    expect(sentQueries.filter((query) => query.includes("path:*")).every((query) => query.includes("!path:~"))).toBe(true);
  });

  it("expose les nouveaux indicateurs et la courbe horaire des connexions", async () => {
    const overview = await getActivityOverview(preset("30d"));
    expect(overview.totals).toMatchObject({ failedLogins: 4, avgResponseMs: 45, p95ResponseMs: 97 });
    expect(overview.hourlyLogins).toEqual([
      { time: "2026-11-23T09:00:00Z", count: 3 },
      { time: "2026-11-23T10:00:00Z", count: 6 },
    ]);
  });

  it("exclut les 401 de session absente des statistiques de requêtes", async () => {
    await getActivityOverview(preset("24h"));
    const requestQueries = sentQueries.filter((query) => query.includes("path:*"));
    expect(requestQueries.length).toBeGreaterThan(0);
    expect(requestQueries.every((query) => query.includes("auth/(handshake|refresh)"))).toBe(true);
  });

  it("filtre sur un intervalle précis, borné à droite, pour toutes les requêtes", async () => {
    await getActivityOverview(custom("2026-11-01T00:00:00.000Z", "2026-11-08T00:00:00.000Z"));
    const filter = "_time:[2026-11-01T00:00:00.000Z, 2026-11-08T00:00:00.000Z)";
    expect(sentQueries.length).toBeGreaterThan(0);
    expect(sentQueries.every((query) => query.startsWith(`${filter} `))).toBe(true);

    sentQueries.length = 0;
    await getActivityDetails("client-errors", custom("2026-11-01T00:00:00.000Z", "2026-11-02T00:00:00.000Z"));
    await getUserActivity("6b0442fd94346451f219a8fd", custom("2026-11-01T00:00:00.000Z", "2026-11-02T00:00:00.000Z"));
    expect(sentQueries.every((query) => query.startsWith("_time:[2026-11-01T00:00:00.000Z, 2026-11-02T00:00:00.000Z) "))).toBe(true);
  });

  it.each([
    ["début après la fin", custom("2026-11-08T00:00:00.000Z", "2026-11-01T00:00:00.000Z")],
    ["intervalle vide", custom("2026-11-01T00:00:00.000Z", "2026-11-01T00:00:00.000Z")],
    ["date invalide", { kind: "custom", from: new Date("n'importe quoi"), to: new Date() } as ActivityRange],
    ["intervalle trop long", custom("2026-01-01T00:00:00.000Z", "2026-11-01T00:00:00.000Z")],
  ])("refuse un intervalle invalide : %s", async (_name, range) => {
    await expect(getActivityOverview(range)).rejects.toThrow("Intervalle invalide");
    expect(sentQueries).toHaveLength(0);
  });

  it("extrait l'identifiant Mongo du champ user", () => {
    expect(userIdFromLogField("6b0442fd94346451f219a8fd-root")).toBe("6b0442fd94346451f219a8fd");
    expect(userIdFromLogField("-anonyme")).toBeNull();
    expect(userIdFromLogField(undefined)).toBeNull();
  });

  it.each(DETAIL_KINDS)("construit le détail « %s » avec la période demandée", async (kind) => {
    const details = await getActivityDetails(kind, preset("7d"));
    expect(details.kind).toBe(kind);
    expect(sentQueries.length).toBeGreaterThan(0);
    expect(sentQueries.every((query) => query.startsWith("_time:7d "))).toBe(true);
  });

  it("rattache les erreurs à un utilisateur ou à un visiteur non connecté", async () => {
    const details = await getActivityDetails("server-errors", preset("24h"));
    if (details.kind !== "server-errors") throw new Error("type inattendu");
    expect(details.recent.map(({ userId }) => userId)).toEqual(["6b0442fd94346451f219a8fd", null]);
    expect(sentQueries.some((query) => query.includes("status:range[500,599]"))).toBe(true);
  });

  it("ne garde que les comptes dans les utilisateurs actifs", async () => {
    const details = await getActivityDetails("active-users", preset("24h"));
    if (details.kind !== "active-users") throw new Error("type inattendu");
    expect(details.users).toHaveLength(1);
    expect(details.users[0].hits).toBe(264);
  });

  it("valide le type de détail", async () => {
    const invalid = await run(detailsValidator, { params: { kind: "drop-table" }, query: {} });
    expect(validationResult(invalid).isEmpty()).toBe(false);
    const valid = await run(detailsValidator, { params: { kind: "client-errors" }, query: { period: "30d" } });
    expect(validationResult(valid).isEmpty()).toBe(true);
  });

  it("refuse un identifiant qui ne soit pas un ObjectId avant toute requête", async () => {
    await expect(getUserActivity('x"} | delete', preset("24h"))).rejects.toThrow();
    expect(sentQueries).toHaveLength(0);
  });

  it("filtre les actions sur l'identifiant demandé", async () => {
    await getUserActivity("6b0442fd94346451f219a8fd", preset("24h"));
    expect(sentQueries[0]).toContain('user:~"^6b0442fd94346451f219a8fd-"');
  });

  it("est indisponible en mode démonstration", async () => {
    process.env.DEMO_MODE = "true";
    await expect(getActivityOverview(preset("24h"))).rejects.toThrow(ObservabilityUnavailableError);
  });

  it("propage une réponse d'erreur de VictoriaLogs", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response("boom", { status: 500 }));
    await expect(getActivityOverview(preset("24h"))).rejects.toThrow("500");
  });

  it("valide la période (liste blanche, absente = défaut du contrôleur)", async () => {
    const valid = await run(overviewValidator, { query: {} });
    expect(validationResult(valid).isEmpty()).toBe(true);
    const sevenDays = await run(overviewValidator, { query: { period: "7d" } });
    expect(matchedData(sevenDays as never).period).toBe("7d");
    const invalid = await run(overviewValidator, { query: { period: "1y" } });
    expect(validationResult(invalid).isEmpty()).toBe(false);
  });

  const query = (params: Record<string, string>) => run(overviewValidator, { query: params });
  const isValid = async (params: Record<string, string>) =>
    validationResult(await query(params)).isEmpty();

  it("valide un intervalle personnalisé (instants ISO, début avant fin, durée bornée)", async () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const iso = (offsetDays: number) => new Date(now + offsetDays * day).toISOString();

    expect(await isValid({ from: iso(-7), to: iso(-1) })).toBe(true);
    expect(await isValid({ from: iso(-1), to: iso(1) })).toBe(true);
    expect(await isValid({ from: iso(-1), to: iso(-7) })).toBe(false);
    expect(await isValid({ from: iso(-60), to: iso(-1) })).toBe(false);
    expect(await isValid({ from: iso(-1), to: iso(30) })).toBe(false);
  });

  it("refuse un intervalle incomplet, mal formé ou combiné à une période", async () => {
    const from = new Date(Date.now() - 86_400_000).toISOString();
    const to = new Date().toISOString();
    expect(await isValid({ from })).toBe(false);
    expect(await isValid({ to })).toBe(false);
    expect(await isValid({ from: "2026-11-01", to: "2026-11-02" })).toBe(false);
    expect(await isValid({ from: "x\" | delete", to })).toBe(false);
    expect(await isValid({ period: "7d", from, to })).toBe(false);
  });

  it("valide l'identifiant utilisateur", async () => {
    const invalid = await run(userActivityValidator, { params: { userId: "abc" }, query: {} });
    expect(validationResult(invalid).isEmpty()).toBe(false);
    const valid = await run(userActivityValidator, { params: { userId: "6b0442fd94346451f219a8fd" }, query: {} });
    expect(validationResult(valid).isEmpty()).toBe(true);
  });
});
