import {
  isObservabilityAvailable,
  ObservabilityUnavailableError,
  OBSERVABILITY_PREFIX,
} from "./victorialogs-proxy.ts";

export const ACTIVITY_PERIODS = ["24h", "7d", "30d"] as const;
export type ActivityPeriod = (typeof ACTIVITY_PERIODS)[number];

/**
 * Fenêtre d'analyse : une période prédéfinie ou un intervalle précis
 * `[from, to[`. Seuls des instants reconstruits par `toISOString()` entrent dans
 * la requête LogsQL, jamais le texte reçu.
 */
export type ActivityRange =
  | { kind: "preset"; period: ActivityPeriod }
  | { kind: "custom"; from: Date; to: Date };

/** Largeur maximale d'un intervalle personnalisé, en jours (30 jours de rétention, plus une marge). */
export const MAX_CUSTOM_RANGE_DAYS = 32;

const DAY_MS = 24 * 60 * 60 * 1000;

export function timeFilter(range: ActivityRange): string {
  if (range.kind === "preset") return `_time:${range.period}`;

  const { from, to } = range;
  if (
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from >= to ||
    to.getTime() - from.getTime() > MAX_CUSTOM_RANGE_DAYS * DAY_MS
  ) {
    throw new Error("Intervalle invalide.");
  }
  return `_time:[${from.toISOString()}, ${to.toISOString()})`;
}

const QUERY_TIMEOUT_MS = 20_000;
const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/;

/**
 * Ne comptent pas dans les statistiques : les routes de l'interface de
 * consultation, et les 401 de `handshake` et `refresh`, cas normal d'un visiteur
 * sans session (le frontend les appelle à chaque chargement).
 */
const IGNORE_OBSERVABILITY =
  '!path:~"^/v1/observability" !(status:=401 path:~"^/v1/auth/(handshake|refresh)$")';
const FAILED_LOGIN = 'path:="/v1/auth/login" method:POST status:range[400,499]';
/** Les identifiants numériques et Mongo d'un chemin sont regroupés sous `:id`. */
const NORMALIZE_PATH =
  'replace_regexp("/([0-9]+|[0-9a-f]{24})(/|$)", "/:id$2") at path';

type LogRow = Record<string, string>;

/**
 * Exécute une requête LogsQL construite côté serveur. Le client ne fournit
 * jamais de LogsQL : seuls une période de la liste blanche et un identifiant
 * Mongo validé entrent dans les requêtes.
 */
export async function runLogsQuery(logsql: string): Promise<LogRow[]> {
  const base = process.env.OBSERVABILITY_URL;
  if (!base || !isObservabilityAvailable()) {
    throw new ObservabilityUnavailableError();
  }

  const response = await fetch(
    new URL(`${OBSERVABILITY_PREFIX}/select/logsql/query`, base),
    {
      method: "POST",
      body: new URLSearchParams({ query: logsql }),
      redirect: "manual",
      signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
    },
  );
  if (!response.ok) {
    throw new Error(`VictoriaLogs a répondu ${response.status}`);
  }

  const text = await response.text();
  return text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as LogRow);
}

const toNumber = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export type ActivityOverview = {
  totals: {
    requests: number;
    logins: number;
    loginUsers: number;
    activeUsers: number;
    clientErrors: number;
    serverErrors: number;
    failedLogins: number;
    avgResponseMs: number;
    p95ResponseMs: number;
  };
  /** Connexions par heure UTC : le navigateur regroupe selon son fuseau. */
  hourlyLogins: { time: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  slowestRoutes: { method: string; path: string; avgMs: number; hits: number }[];
  recentLogins: { time: string; userId: string; from: string }[];
};

export async function getActivityOverview(
  activityRange: ActivityRange,
): Promise<ActivityOverview> {
  const range = timeFilter(activityRange);
  const requests = `${range} path:* ${IGNORE_OBSERVABILITY}`;

  const [
    requestCount,
    logins,
    activeUsers,
    clientErrors,
    serverErrors,
    statuses,
    slowest,
    recent,
    failedLogins,
    timing,
    hourly,
  ] = await Promise.all([
    runLogsQuery(`${requests} | stats count() as n`),
    runLogsQuery(`${range} event:"auth.login" | stats count() as n, count_uniq(userId) as users`),
    runLogsQuery(`${requests} user:~"^[0-9a-f]{24}-" | stats count_uniq(user) as n`),
    runLogsQuery(`${requests} status:range[400,499] | stats count() as n`),
    runLogsQuery(`${requests} status:range[500,599] | stats count() as n`),
    runLogsQuery(`${requests} | stats by (status) count() as n | sort by (n desc)`),
    runLogsQuery(
      `${requests} | ${NORMALIZE_PATH} | stats by (method, path) avg(durationMs) as avg_ms, count() as hits | sort by (avg_ms desc) | limit 10`,
    ),
    runLogsQuery(
      `${range} event:"auth.login" | sort by (_time desc) | limit 20 | fields _time, userId, from`,
    ),
    runLogsQuery(`${range} ${FAILED_LOGIN} | stats count() as n`),
    runLogsQuery(
      `${requests} | stats avg(durationMs) as avg_ms, quantile(0.95, durationMs) as p95`,
    ),
    runLogsQuery(
      `${range} event:"auth.login" | stats by (_time:1h) count() as n | sort by (_time)`,
    ),
  ]);

  return {
    totals: {
      requests: toNumber(requestCount[0]?.n),
      logins: toNumber(logins[0]?.n),
      loginUsers: toNumber(logins[0]?.users),
      activeUsers: toNumber(activeUsers[0]?.n),
      clientErrors: toNumber(clientErrors[0]?.n),
      serverErrors: toNumber(serverErrors[0]?.n),
      failedLogins: toNumber(failedLogins[0]?.n),
      avgResponseMs: Math.round(toNumber(timing[0]?.avg_ms)),
      p95ResponseMs: Math.round(toNumber(timing[0]?.p95)),
    },
    hourlyLogins: hourly.map((row) => ({
      time: row._time ?? "",
      count: toNumber(row.n),
    })),
    statusBreakdown: statuses.map((row) => ({
      status: row.status ?? "",
      count: toNumber(row.n),
    })),
    slowestRoutes: slowest.map((row) => ({
      method: row.method ?? "",
      path: row.path ?? "",
      avgMs: Math.round(toNumber(row.avg_ms)),
      hits: toNumber(row.hits),
    })),
    recentLogins: recent.map((row) => ({
      time: row._time ?? "",
      userId: row.userId ?? "",
      from: row.from ?? "",
    })),
  };
}

export type UserAction = {
  time: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

export async function getUserActivity(
  userId: string,
  activityRange: ActivityRange,
): Promise<UserAction[]> {
  // Défense en profondeur : l'identifiant entre dans la requête LogsQL.
  if (!OBJECT_ID_PATTERN.test(userId)) throw new Error("Identifiant invalide.");

  const rows = await runLogsQuery(
    `${timeFilter(activityRange)} user:~"^${userId}-" method:* ${IGNORE_OBSERVABILITY} | sort by (_time desc) | limit 50 | fields _time, method, path, status, durationMs`,
  );
  return rows.map((row) => ({
    time: row._time ?? "",
    method: row.method ?? "",
    path: row.path ?? "",
    status: toNumber(row.status),
    durationMs: toNumber(row.durationMs),
  }));
}

// ---------------------------------------------------------------------------
// Détails d'une statistique
// ---------------------------------------------------------------------------

export const DETAIL_KINDS = [
  "logins",
  "failed-logins",
  "active-users",
  "requests",
  "client-errors",
  "server-errors",
  "performance",
] as const;
export type DetailKind = (typeof DETAIL_KINDS)[number];

/** `userId` vaut `null` pour un visiteur non connecté. */
export type ActivityEvent = {
  time: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  userId: string | null;
};

export type ActivityDetails =
  | {
      kind: "logins";
      recent: { time: string; userId: string; from: string }[];
      topUsers: { userId: string; count: number }[];
    }
  | {
      kind: "failed-logins";
      byIp: { from: string; count: number; last: string }[];
      recent: { time: string; from: string; status: number }[];
    }
  | {
      kind: "active-users";
      users: { userId: string; hits: number; last: string }[];
    }
  | {
      kind: "requests";
      topRoutes: { method: string; path: string; hits: number; avgMs: number }[];
      byMethod: { method: string; count: number }[];
    }
  | {
      kind: "client-errors" | "server-errors";
      byStatus: { status: string; count: number }[];
      topRoutes: { method: string; path: string; status: string; count: number }[];
      recent: ActivityEvent[];
    }
  | {
      kind: "performance";
      slowestRoutes: { method: string; path: string; avgMs: number; p95Ms: number; hits: number }[];
    };

/** L'identifiant Mongo est le préfixe du champ `user` (« <id>-<rôle> »). */
export const userIdFromLogField = (user: string | undefined): string | null =>
  /^([0-9a-f]{24})-/.exec(user ?? "")?.[1] ?? null;

export async function getActivityDetails(
  kind: DetailKind,
  activityRange: ActivityRange,
): Promise<ActivityDetails> {
  const range = timeFilter(activityRange);
  const requests = `${range} path:* ${IGNORE_OBSERVABILITY}`;
  const routeKey = `${NORMALIZE_PATH} | stats by (method, path)`;

  switch (kind) {
    case "logins": {
      const [recent, top] = await Promise.all([
        runLogsQuery(
          `${range} event:"auth.login" | sort by (_time desc) | limit 50 | fields _time, userId, from`,
        ),
        runLogsQuery(
          `${range} event:"auth.login" | stats by (userId) count() as n | sort by (n desc) | limit 10`,
        ),
      ]);
      return {
        kind,
        recent: recent.map((row) => ({
          time: row._time ?? "",
          userId: row.userId ?? "",
          from: row.from ?? "",
        })),
        topUsers: top.map((row) => ({
          userId: row.userId ?? "",
          count: toNumber(row.n),
        })),
      };
    }
    case "failed-logins": {
      const [byIp, recent] = await Promise.all([
        runLogsQuery(
          `${range} ${FAILED_LOGIN} | stats by (from) count() as n, max(_time) as last | sort by (n desc) | limit 15`,
        ),
        runLogsQuery(
          `${range} ${FAILED_LOGIN} | sort by (_time desc) | limit 30 | fields _time, from, status`,
        ),
      ]);
      return {
        kind,
        byIp: byIp.map((row) => ({
          from: row.from ?? "",
          count: toNumber(row.n),
          last: row.last ?? "",
        })),
        recent: recent.map((row) => ({
          time: row._time ?? "",
          from: row.from ?? "",
          status: toNumber(row.status),
        })),
      };
    }
    case "active-users": {
      const rows = await runLogsQuery(
        `${requests} user:~"^[0-9a-f]{24}-" | stats by (user) count() as hits, max(_time) as last | sort by (hits desc) | limit 20`,
      );
      return {
        kind,
        users: rows.flatMap((row) => {
          const userId = userIdFromLogField(row.user);
          return userId
            ? [{ userId, hits: toNumber(row.hits), last: row.last ?? "" }]
            : [];
        }),
      };
    }
    case "requests": {
      const [routes, methods] = await Promise.all([
        runLogsQuery(
          `${requests} | ${routeKey} count() as hits, avg(durationMs) as avg_ms | sort by (hits desc) | limit 15`,
        ),
        runLogsQuery(`${requests} | stats by (method) count() as n | sort by (n desc)`),
      ]);
      return {
        kind,
        topRoutes: routes.map((row) => ({
          method: row.method ?? "",
          path: row.path ?? "",
          hits: toNumber(row.hits),
          avgMs: Math.round(toNumber(row.avg_ms)),
        })),
        byMethod: methods.map((row) => ({
          method: row.method ?? "",
          count: toNumber(row.n),
        })),
      };
    }
    case "client-errors":
    case "server-errors": {
      const statuses =
        kind === "client-errors" ? "status:range[400,499]" : "status:range[500,599]";
      const [byStatus, routes, recent] = await Promise.all([
        runLogsQuery(
          `${requests} ${statuses} | stats by (status) count() as n | sort by (n desc)`,
        ),
        runLogsQuery(
          `${requests} ${statuses} | ${NORMALIZE_PATH} | stats by (method, path, status) count() as n | sort by (n desc) | limit 15`,
        ),
        runLogsQuery(
          `${requests} ${statuses} | sort by (_time desc) | limit 30 | fields _time, method, path, status, user, durationMs`,
        ),
      ]);
      return {
        kind,
        byStatus: byStatus.map((row) => ({
          status: row.status ?? "",
          count: toNumber(row.n),
        })),
        topRoutes: routes.map((row) => ({
          method: row.method ?? "",
          path: row.path ?? "",
          status: row.status ?? "",
          count: toNumber(row.n),
        })),
        recent: recent.map((row) => ({
          time: row._time ?? "",
          method: row.method ?? "",
          path: row.path ?? "",
          status: toNumber(row.status),
          durationMs: toNumber(row.durationMs),
          userId: userIdFromLogField(row.user),
        })),
      };
    }
    case "performance": {
      const rows = await runLogsQuery(
        `${requests} | ${routeKey} avg(durationMs) as avg_ms, quantile(0.95, durationMs) as p95, count() as hits | sort by (avg_ms desc) | limit 15`,
      );
      return {
        kind,
        slowestRoutes: rows.map((row) => ({
          method: row.method ?? "",
          path: row.path ?? "",
          avgMs: Math.round(toNumber(row.avg_ms)),
          p95Ms: Math.round(toNumber(row.p95)),
          hits: toNumber(row.hits),
        })),
      };
    }
  }
}
