import type { IndicatorsPayload } from "./types.ts";

/**
 * Traduction des indicateurs de la plateforme vers le contrat du modèle IA.
 *
 * Le service `lxp-ia` attend onze variables nommées et typées, héritées du jeu
 * de données OULAD sur lequel le modèle a été entraîné. Les indicateurs du LXP
 * ne portent ni les mêmes noms ni les mêmes unités : la conversion est
 * rassemblée ici, à l'écart des appels réseau, pour rester vérifiable.
 *
 * Une variable sans source est envoyée à `null`, jamais à zéro : le modèle
 * traite l'absence comme une donnée manquante, là où un zéro serait lu comme
 * une mesure réelle — un apprenant sans quiz passé paraîtrait en échec.
 */

const MS_PER_MINUTE = 60_000;
const SCORE_RANGE_POINTS = 100;
const MS_PER_DAY = 86_400_000;

/** Les onze variables du modèle, dans l'ordre de son contrat. */
export const MODEL_INDICATOR_KEYS = [
  "session_time",
  "mood_proxy",
  "monthly_connection_days",
  "days_since_last_activity",
  "time_on_content",
  "quiz_interaction_count",
  "chatbot_proxy",
  "score_evolution",
  "assessment_count",
  "cumul_assessments",
  "pass_rate",
] as const;

export type ModelIndicatorKey = (typeof MODEL_INDICATOR_KEYS)[number];

export type ModelIndicators = Record<ModelIndicatorKey, number | null>;

/** Volumétrie des quiz d'un apprenant, calculée par `get-assessments-summary`. */
export type AssessmentsSummary = {
  /** Tentatives terminées sur la période. */
  periodCount: number;
  /** Tentatives terminées depuis toujours, jusqu'à la fin de la période. */
  cumulativeCount: number;
  /** Part cumulée des tentatives réussies, entre 0 et 1, `null` sans tentative. */
  passRate: number | null;
};

export type ModelFeatures = {
  indicators: ModelIndicators;
  /** Raison, par variable absente, de son `null`. */
  missing: Record<string, string>;
};

const NO_ASSESSMENT_SOURCE =
  "Cet utilisateur n'est pas un apprenant : aucune tentative de quiz à comptabiliser.";

function readIndicator(
  payload: IndicatorsPayload,
  key: string,
): { value: number | null; reason?: string } {
  const indicator = payload.indicators[key];

  if (!indicator) {
    return { value: null, reason: `L'indicateur « ${key} » n'a pas été calculé.` };
  }

  if (!indicator.available || typeof indicator.value !== "number") {
    const reason = indicator.meta?.reason ?? indicator.meta?.error;

    return {
      value: null,
      reason:
        typeof reason === "string"
          ? reason
          : "Aucune donnée sur la période pour cet indicateur.",
    };
  }

  return { value: indicator.value };
}

function periodDays(payload: IndicatorsPayload): number {
  const span =
    new Date(payload.to).getTime() - new Date(payload.from).getTime();

  // Une période d'un jour au minimum : la pente est une variation par jour, la
  // diviser par zéro n'aurait pas de sens.
  return Math.max(1, Math.round(span / MS_PER_DAY));
}

/**
 * Construit la ligne d'entrée du modèle à partir des indicateurs de la
 * plateforme et de la volumétrie des quiz.
 *
 * `assessments` vaut `null` quand l'utilisateur n'est pas un apprenant : les
 * trois variables qui en dépendent restent alors absentes.
 */
export default function toModelIndicators(
  payload: IndicatorsPayload,
  assessments: AssessmentsSummary | null,
): ModelFeatures {
  const missing: Record<string, string> = {};

  const take = (
    modelKey: ModelIndicatorKey,
    indicatorKey: string,
    convert: (value: number) => number = (value) => value,
  ): number | null => {
    const { value, reason } = readIndicator(payload, indicatorKey);

    if (value === null) {
      missing[modelKey] = reason!;
      return null;
    }

    return convert(value);
  };

  const evolution = readIndicator(payload, "correct_answer_rate_evolution");

  if (evolution.value === null) {
    missing.score_evolution = evolution.reason!;
  }

  if (assessments === null) {
    missing.assessment_count = NO_ASSESSMENT_SOURCE;
    missing.cumul_assessments = NO_ASSESSMENT_SOURCE;
    missing.pass_rate = NO_ASSESSMENT_SOURCE;
  } else if (assessments.passRate === null) {
    missing.pass_rate = "Aucune tentative de quiz terminée à ce jour.";
  }

  const indicators: ModelIndicators = {
    // Le modèle raisonne en minutes ; le LXP stocke des millisecondes.
    session_time: take("session_time", "session_time", (value) =>
      Math.round((value / MS_PER_MINUTE) * 10) / 10,
    ),
    mood_proxy: take("mood_proxy", "mood"),
    monthly_connection_days: take(
      "monthly_connection_days",
      "monthly_connection_days",
    ),
    days_since_last_activity: take(
      "days_since_last_activity",
      "days_since_last_activity",
    ),
    time_on_content: take("time_on_content", "time_on_content", (value) =>
      Math.round((value / MS_PER_MINUTE) * 10) / 10,
    ),
    quiz_interaction_count: take("quiz_interaction_count", "quiz_interactions"),
    chatbot_proxy: take("chatbot_proxy", "chatbot_interactions"),

    // `score_evolution` est une pente : la variation du score, ramenée à
    // l'échelle [0, 1], par jour. L'indicateur de la plateforme est un écart en
    // points de pourcentage sur toute la période, d'où la double division.
    score_evolution:
      evolution.value === null
        ? null
        : Number(
            (
              evolution.value /
              SCORE_RANGE_POINTS /
              periodDays(payload)
            ).toFixed(6),
          ),

    assessment_count: assessments?.periodCount ?? null,
    cumul_assessments: assessments?.cumulativeCount ?? null,
    pass_rate: assessments?.passRate ?? null,
  };

  return { indicators, missing };
}
