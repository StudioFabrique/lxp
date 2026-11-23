import { Readable } from "node:stream";

/** Préfixe sur lequel VictoriaLogs sert son interface (`-http.pathPrefix`). */
export const OBSERVABILITY_PREFIX = "/v1/observability";

const UPSTREAM_TIMEOUT_MS = 60_000;

export class ObservabilityUnavailableError extends Error {}
export class ObservabilityForbiddenPathError extends Error {}

/**
 * L'interface envoie ses requêtes LogsQL en POST (formulaire) pour éviter les
 * URL trop longues. Ce sont des lectures : seul `/select/logsql/` l'accepte.
 */
const POST_ALLOWED_PREFIX = `${OBSERVABILITY_PREFIX}/select/logsql/`;
export const MAX_POST_BODY_BYTES = 1_000_000;

export type ForwardBody = { content: Readable | string; contentType: string };

export type UpstreamResponse = {
  status: number;
  headers: Record<string, string>;
  body: Readable | null;
};

/**
 * Construit l'URL amont à partir de l'URL reçue.
 *
 * L'hôte vient exclusivement de la configuration. Le chemin est normalisé par
 * `URL` (segments `..` résolus) puis restreint à `/select/` : l'ingestion, la
 * suppression et les routes d'administration de VictoriaLogs ne sont jamais
 * exposées par l'API.
 */
export function buildUpstreamUrl(base: string, originalUrl: string): URL {
  // Seuls le chemin et la query sont repris : une requête en forme absolue
  // (`GET http://autre-hote/...`) ne doit jamais changer l'hôte amont.
  const received = new URL(originalUrl, "http://localhost");
  const upstream = new URL(base);
  upstream.pathname = received.pathname;
  upstream.search = received.search;
  const allowedPrefix = `${OBSERVABILITY_PREFIX}/select/`;

  if (!upstream.pathname.startsWith(allowedPrefix)) {
    throw new ObservabilityForbiddenPathError();
  }
  return upstream;
}

/** Les journaux sont consultables : service configuré et hors démonstration. */
export function isObservabilityAvailable(): boolean {
  return Boolean(process.env.OBSERVABILITY_URL) && process.env.DEMO_MODE !== "true";
}

export async function forwardToVictoriaLogs(
  method: "GET" | "HEAD" | "POST",
  originalUrl: string,
  signal?: AbortSignal,
  body?: ForwardBody,
): Promise<UpstreamResponse> {
  const base = process.env.OBSERVABILITY_URL;
  // Le mode démonstration n'expose jamais les journaux, même mal configuré.
  if (!base || !isObservabilityAvailable()) throw new ObservabilityUnavailableError();

  const upstream = buildUpstreamUrl(base, originalUrl);
  if (method === "POST" && !upstream.pathname.startsWith(POST_ALLOWED_PREFIX)) {
    throw new ObservabilityForbiddenPathError();
  }

  const response = await fetch(upstream, {
    method,
    redirect: "manual",
    ...(method === "POST" && body
      ? {
          headers: { "content-type": body.contentType },
          body:
            typeof body.content === "string"
              ? body.content
              : (Readable.toWeb(body.content) as ReadableStream),
          duplex: "half",
        }
      : {}),
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)])
      : AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  // Seuls les en-têtes nécessaires au rendu sont relayés. Le corps est déjà
  // décompressé par fetch : `content-encoding` et `content-length` sont donc omis.
  const headers: Record<string, string> = {};
  for (const name of ["content-type", "cache-control", "etag"]) {
    const value = response.headers.get(name);
    if (value) headers[name] = value;
  }

  return {
    status: response.status,
    headers,
    body: response.body ? Readable.fromWeb(response.body) : null,
  };
}
