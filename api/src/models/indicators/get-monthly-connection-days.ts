import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import { toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

export const MONTHLY_CONNECTION_DAYS_KEY = "monthly_connection_days";

/**
 * Nombre de jours civils distincts où l'apprenant s'est connecté, sur le mois
 * calendaire courant.
 *
 * Un document `connectioninfos` correspond déjà à une journée, mais on
 * dédoublonne quand même par date : rien ne garantit cette invariante en base.
 */
export default async function getMonthlyConnectionDays(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const reference = context.to;
  const startOfMonth = new Date(
    Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1),
  );

  const documents = await ConnectionInfos.find({
    userId: context.userIdMdb,
    lastConnection: { $gte: startOfMonth, $lte: reference },
  })
    .select({ lastConnection: 1 })
    .lean();

  const distinctDays = new Set(
    documents.map((doc) => toDayKey(new Date(doc.lastConnection))),
  );

  return {
    key: MONTHLY_CONNECTION_DAYS_KEY,
    label: "Jours de connexion ce mois-ci",
    value: distinctDays.size,
    unit: "count",
    available: true,
    meta: { since: toDayKey(startOfMonth) },
  };
}
