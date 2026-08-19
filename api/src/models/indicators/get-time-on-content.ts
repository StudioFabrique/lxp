import {
  CONTENT_TYPES,
  type ContentType,
} from "../../config/content-read.ts";
import { contentReadRepository } from "../content-read/content-read-repository.ts";
import { emptyIndicator, type Indicator, type IndicatorContext } from "./types.ts";

export const TIME_ON_CONTENT_KEY = "time_on_content";

/**
 * Temps réellement passé sur les contenus, en millisecondes.
 *
 * Somme des `readTimeMs`, alimentés par les battements envoyés pendant la
 * consultation. `finishedAt - beganAt` ne conviendrait pas : un contenu ouvert
 * lundi et terminé vendredi compterait quatre jours de lecture.
 *
 * Les niveaux ne s'additionnent pas de façon disjointe — lire une leçon, c'est
 * aussi être dans son cours et son module — d'où le détail par niveau dans
 * `meta` et une valeur principale prise au niveau le plus fin.
 */
export default async function getTimeOnContent(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  if (context.studentId === null) {
    return emptyIndicator(TIME_ON_CONTENT_KEY, "Temps passé sur les contenus", "ms", {
      reason: "Cet utilisateur n'est pas un apprenant.",
    });
  }

  const studentId = context.studentId;

  const totals = await Promise.all(
    CONTENT_TYPES.map(async (type: ContentType) => [
      type,
      await contentReadRepository.sumReadTime(
        type,
        studentId,
        context.from,
        context.to,
      ),
    ] as const),
  );

  const byType = Object.fromEntries(totals) as Record<ContentType, number>;

  // Leçons et activités sont les deux seuls niveaux qui ne se recouvrent pas :
  // les additionner donne le temps de consultation sans double comptage.
  const value = byType.lesson + byType.activity;

  if (value === 0 && byType.module === 0 && byType.course === 0) {
    return emptyIndicator(TIME_ON_CONTENT_KEY, "Temps passé sur les contenus", "ms", {
      reason: "Aucune consultation mesurée sur la période.",
    });
  }

  return {
    key: TIME_ON_CONTENT_KEY,
    label: "Temps passé sur les contenus",
    value,
    unit: "ms",
    available: true,
    meta: {
      moduleMs: byType.module,
      courseMs: byType.course,
      lessonMs: byType.lesson,
      activityMs: byType.activity,
    },
  };
}
