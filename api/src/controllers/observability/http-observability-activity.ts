import { type Request, type Response } from "express";
import { matchedData } from "express-validator";
import { logger } from "../../utils/logs/logger.ts";
import { ObservabilityUnavailableError } from "../../utils/services/observability/victorialogs-proxy.ts";
import getUserIdentitiesByIds, { type UserIdentity } from "../../models/user/get-user-identities-by-ids.ts";
import getTargetLabels, { targetKey } from "../../models/observability/get-target-labels.ts";
import findUserIdsByName from "../../models/user/find-user-ids-by-name.ts";
import {
  extractTargets,
  TARGET_KIND_LABELS,
} from "../../utils/services/observability/route-targets.ts";
import {
  getActivityDetails,
  getActivityOverview,
  getUserActivity,
  searchLogs,
  type ActivityDetails,
  type ActivityPeriod,
  type ActivityRange,
  type DetailKind,
} from "../../utils/services/observability/victorialogs-queries.ts";

const DEFAULT_PERIOD: ActivityPeriod = "24h";

type RangeQuery = { period?: ActivityPeriod; from?: string; to?: string };

/** Les validateurs garantissent que `from` et `to` vont ensemble et sont des instants valides. */
function rangeOf({ period, from, to }: RangeQuery): ActivityRange {
  if (from && to) return { kind: "custom", from: new Date(from), to: new Date(to) };
  return { kind: "preset", period: period ?? DEFAULT_PERIOD };
}

function failure(res: Response, error: unknown, context: string) {
  if (error instanceof ObservabilityUnavailableError) {
    return res.status(404).json({ message: "Ressource introuvable." });
  }
  logger.error(context, {
    error: error instanceof Error ? error.message : "inconnue",
  });
  return res.status(502).json({
    message: "Le service de journaux est indisponible. Réessayez plus tard.",
  });
}

/**
 * Statistiques d'activité. Les identifiants relevés dans les journaux sont
 * rattachés à une identité ici, à l'affichage : aucun nom n'est écrit dans les
 * journaux. Un compte supprimé n'a plus d'identité (`user: null`).
 */
export async function httpObservabilityOverview(req: Request, res: Response) {
  const range = rangeOf(matchedData<RangeQuery>(req));
  try {
    const overview = await getActivityOverview(range);
    const identities = await getUserIdentitiesByIds(
      overview.recentLogins.map(({ userId }) => userId),
    );
    const byId = new Map(identities.map((identity) => [identity.id, identity]));

    return res.json({
      ...overview,
      recentLogins: overview.recentLogins.map((login) => {
        const identity = byId.get(login.userId);
        return {
          time: login.time,
          from: login.from,
          user: identity
            ? {
                id: identity.id,
                name: `${identity.firstname} ${identity.lastname}`.trim(),
                role: identity.roleLabel,
              }
            : null,
        };
      }),
    });
  } catch (error: unknown) {
    return failure(res, error, "observability.overview");
  }
}

export async function httpObservabilityUserActivity(
  req: Request,
  res: Response,
) {
  const { userId, ...rangeQuery } = matchedData<RangeQuery & { userId: string }>(req);
  const range = rangeOf(rangeQuery);
  try {
    const [actions, [identity]] = await Promise.all([
      getUserActivity(userId, range),
      getUserIdentitiesByIds([userId]),
    ]);
    return res.json({
      user: identity
        ? {
            id: identity.id,
            name: `${identity.firstname} ${identity.lastname}`.trim(),
            role: identity.roleLabel,
          }
        : null,
      actions: await attachTargets(actions),
    });
  } catch (error: unknown) {
    return failure(res, error, "observability.user-activity");
  }
}

type UserRef = { id: string; name: string; role: string | null } | null;

const toUserRef = (
  identities: Map<string, UserIdentity>,
  userId: string | null,
): UserRef => {
  const identity = userId ? identities.get(userId) : undefined;
  return identity
    ? {
        id: identity.id,
        name: `${identity.firstname} ${identity.lastname}`.trim(),
        role: identity.roleLabel,
      }
    : null;
};

const userIdsOf = (details: ActivityDetails): string[] => {
  switch (details.kind) {
    case "logins":
      return [...details.recent, ...details.topUsers].map(({ userId }) => userId);
    case "active-users":
      return details.users.map(({ userId }) => userId);
    case "client-errors":
    case "server-errors":
    case "slow-requests":
      return details.recent.flatMap(({ userId }) => (userId ? [userId] : []));
    default:
      return [];
  }
};

/** Remplace chaque `userId` par l'identité résolue (`user`), sans toucher au reste. */
function withUsers(details: ActivityDetails, identities: Map<string, UserIdentity>) {
  const user = (userId: string | null) => toUserRef(identities, userId);
  switch (details.kind) {
    case "logins":
      return {
        ...details,
        recent: details.recent.map((row) => ({ ...row, user: user(row.userId) })),
        topUsers: details.topUsers.map((row) => ({ ...row, user: user(row.userId) })),
      };
    case "active-users":
      return {
        ...details,
        users: details.users.map((row) => ({ ...row, user: user(row.userId) })),
      };
    case "client-errors":
    case "server-errors":
    case "slow-requests":
      return {
        ...details,
        recent: details.recent.map((row) => ({ ...row, user: user(row.userId) })),
      };
    default:
      return details;
  }
}

export async function httpObservabilityDetails(req: Request, res: Response) {
  const { kind, ...rangeQuery } = matchedData<RangeQuery & { kind: DetailKind }>(req);
  const range = rangeOf(rangeQuery);
  try {
    const details = await getActivityDetails(kind, range);
    const identities = await getUserIdentitiesByIds(userIdsOf(details));
    const resolved = withUsers(
      details,
      new Map(identities.map((identity) => [identity.id, identity])),
    );

    // Les événements individuels (pas les routes regroupées) portent un chemin
    // complet : on y résout les contenus désignés.
    if (resolved.kind === "client-errors" || resolved.kind === "server-errors" || resolved.kind === "slow-requests") {
      return res.json({ ...resolved, recent: await attachTargets(resolved.recent) });
    }
    return res.json(resolved);
  } catch (error: unknown) {
    return failure(res, error, "observability.details");
  }
}

/**
 * Contenu désigné par un chemin (« Leçon : Introduction »). `label` vaut `null`
 * quand le contenu n'existe plus, pour afficher « supprimé » plutôt que rien.
 */
type TargetView = { kind: string; id: string; label: string | null };

async function attachTargets<T extends { path: string }>(
  rows: T[],
): Promise<(T & { targets: TargetView[] })[]> {
  const refsByRow = rows.map((row) => extractTargets(row.path));
  const labels = await getTargetLabels(refsByRow.flat());

  return rows.map((row, index) => ({
    ...row,
    targets: refsByRow[index].map((ref) => ({
      kind: TARGET_KIND_LABELS[ref.kind],
      id: ref.id,
      label: labels.get(targetKey(ref.kind, ref.id)) ?? null,
    })),
  }));
}

export async function httpObservabilitySearch(req: Request, res: Response) {
  const { q, ...rangeQuery } = matchedData<RangeQuery & { q: string }>(req);
  const range = rangeOf(rangeQuery);
  try {
    // Les journaux ne portent que des identifiants : un nom tapé ici retrouve
    // les comptes correspondants, dont on cherche ensuite les lignes.
    const personIds = await findUserIdsByName(q);
    const results = await searchLogs(q, range, personIds);

    const identities = await getUserIdentitiesByIds(
      results.flatMap(({ userId }) => (userId ? [userId] : [])),
    );
    const byId = new Map(identities.map((identity) => [identity.id, identity]));
    const withTargets = await attachTargets(results);

    return res.json({
      results: withTargets.map((row) => ({
        ...row,
        user: toUserRef(byId, row.userId),
      })),
    });
  } catch (error: unknown) {
    return failure(res, error, "observability.search");
  }
}
