import StudentFeedback from "../../utils/interfaces/db/student-feedback.ts";
import { emptyIndicator, toDayKey, type Indicator, type IndicatorContext } from "./types.ts";

export const MOOD_KEY = "mood";

/**
 * Humeur déclarée par l'apprenant, sur une échelle de 1 (orage) à 5 (soleil).
 *
 * La valeur renvoyée est le dernier ressenti connu sur la période, la moyenne
 * étant dans `meta` : c'est l'état actuel qui déclenche un accompagnement, pas
 * la moyenne. L'indicateur reste indisponible tant que l'apprenant n'a rien
 * déclaré — il est facultatif, un zéro serait un contresens.
 */
export default async function getMood(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const feedbacks = await StudentFeedback.find({
    user: context.userIdMdb,
    feedbackAt: { $gte: context.from, $lte: context.to },
  })
    .select({ feelingLevel: 1, feedbackAt: 1, comment: 1 })
    .sort({ feedbackAt: 1 })
    .lean();

  if (feedbacks.length === 0) {
    return emptyIndicator(MOOD_KEY, "Humeur déclarée", "level", {
      reason: "Aucun retour déposé sur la période.",
    });
  }

  const latest = feedbacks[feedbacks.length - 1]!;
  const average =
    feedbacks.reduce((sum, item) => sum + (item.feelingLevel ?? 0), 0) /
    feedbacks.length;

  return {
    key: MOOD_KEY,
    label: "Humeur déclarée",
    value: latest.feelingLevel ?? null,
    unit: "level",
    available: true,
    series: feedbacks.map((item) => ({
      date: toDayKey(new Date(item.feedbackAt)),
      value: item.feelingLevel ?? 0,
    })),
    meta: {
      averageLevel: Math.round(average * 10) / 10,
      feedbackCount: feedbacks.length,
      lastFeedbackAt: new Date(latest.feedbackAt).toISOString(),
      lastComment: latest.comment ?? null,
    },
  };
}
