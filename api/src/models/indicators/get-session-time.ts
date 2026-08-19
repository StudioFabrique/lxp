import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import { emptyIndicator, toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

export const SESSION_TIME_KEY = "session_time";

/**
 * Temps total connecté à la plateforme sur la période, en millisecondes.
 *
 * La valeur brute est renvoyée en millisecondes et non convertie en heures :
 * le front arrondissait à l'heure supérieure, si bien qu'une minute de
 * connexion s'affichait « 1 heure ». Le formatage appartient à l'affichage.
 */
export default async function getSessionTime(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const documents = await ConnectionInfos.find({
    userId: context.userIdMdb,
    lastConnection: { $gte: context.from, $lte: context.to },
  })
    .select({ lastConnection: 1, duration: 1 })
    .sort({ lastConnection: 1 })
    .lean();

  if (documents.length === 0) {
    return emptyIndicator(SESSION_TIME_KEY, "Temps de connexion", "ms");
  }

  // Plusieurs documents peuvent tomber le même jour civil si le fuseau du
  // serveur a changé : on regroupe pour que la série reste lisible.
  const perDay = new Map<string, number>();
  for (const doc of documents) {
    const key = toDayKey(new Date(doc.lastConnection));
    perDay.set(key, (perDay.get(key) ?? 0) + (doc.duration ?? 0));
  }

  const total = [...perDay.values()].reduce((sum, value) => sum + value, 0);

  return {
    key: SESSION_TIME_KEY,
    label: "Temps de connexion",
    value: total,
    unit: "ms",
    available: true,
    series: [...perDay.entries()].map(([date, value]) => ({ date, value })),
    meta: { averagePerDayMs: Math.round(total / perDay.size) },
  };
}
