import resolveIndicatorContext from "./indicator-context.ts";
import getChatbotInteractions from "./get-chatbot-interactions.ts";
import getChatbotOutOfScope from "./get-chatbot-out-of-scope.ts";
import getCorrectAnswerRate from "./get-correct-answer-rate.ts";
import getCorrectAnswerRateEvolution from "./get-correct-answer-rate-evolution.ts";
import getDaysSinceLastActivity from "./get-days-since-last-activity.ts";
import getMonthlyConnectionDays from "./get-monthly-connection-days.ts";
import getMood from "./get-mood.ts";
import getParcoursProgression from "./get-parcours-progression.ts";
import getQuizInteractions from "./get-quiz-interactions.ts";
import getSessionTime from "./get-session-time.ts";
import getTimeOnContent from "./get-time-on-content.ts";
import type {
  Indicator,
  IndicatorContext,
  IndicatorFn,
  IndicatorsPayload,
} from "./types.ts";
import { logger } from "../../utils/logs/logger.ts";

/**
 * Registre des indicateurs exposés par l'API.
 *
 * Ajouter un indicateur consiste à écrire son fichier puis à l'inscrire ici :
 * l'endpoint et l'interface le reprennent sans modification supplémentaire.
 */
export const INDICATORS: Record<string, IndicatorFn> = {
  session_time: getSessionTime,
  monthly_connection_days: getMonthlyConnectionDays,
  days_since_last_activity: getDaysSinceLastActivity,
  chatbot_interactions: getChatbotInteractions,
  chatbot_out_of_scope: getChatbotOutOfScope,
  mood: getMood,
  time_on_content: getTimeOnContent,
  quiz_interactions: getQuizInteractions,
  correct_answer_rate: getCorrectAnswerRate,
  correct_answer_rate_evolution: getCorrectAnswerRateEvolution,
  parcours_progression: getParcoursProgression,
};

export type IndicatorKey = keyof typeof INDICATORS;

/**
 * Calcule tous les indicateurs d'un apprenant en une passe.
 *
 * Le contexte est résolu une seule fois, puis les indicateurs sont évalués en
 * parallèle et de façon indépendante : un calcul en échec ressort comme
 * indisponible avec son erreur, sans faire tomber les dix autres.
 */
export default async function getAllIndicators(
  userIdMdb: string,
  from?: Date,
  to?: Date,
): Promise<IndicatorsPayload> {
  const context: IndicatorContext = await resolveIndicatorContext(
    userIdMdb,
    from,
    to,
  );

  const entries = Object.entries(INDICATORS);
  const results = await Promise.allSettled(
    entries.map(([, compute]) => compute(context)),
  );

  const indicators: Record<string, Indicator<any>> = {};

  results.forEach((result, index) => {
    const key = entries[index]![0];

    if (result.status === "fulfilled") {
      indicators[key] = result.value;
      return;
    }

    logger.error(`Indicateur "${key}" en échec :`, result.reason);

    indicators[key] = {
      key,
      label: key,
      value: null,
      available: false,
      meta: {
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Calcul impossible.",
      },
    };
  });

  return {
    userId: userIdMdb,
    from: context.from.toISOString(),
    to: context.to.toISOString(),
    indicators,
  };
}
