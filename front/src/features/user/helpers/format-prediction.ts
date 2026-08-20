/**
 * Mise en forme de la prédiction du modèle IA.
 *
 * Le service IA répond avec le vocabulaire de son jeu d'entraînement
 * (`graduate`, `fail`, `dropout`, niveaux d'alerte numérotés) : la traduction
 * est rassemblée ici pour que les composants n'aient pas à la porter.
 */

const OUTCOME_LABELS: Record<string, string> = {
  graduate: "Parcours mené à son terme",
  fail: "Échec probable",
  dropout: "Abandon probable",
};

export function formatOutcome(prediction: string): string {
  return OUTCOME_LABELS[prediction] ?? prediction;
}

const ALERT_LABELS: Record<number, string> = {
  0: "Aucune alerte",
  1: "Point de vigilance",
  2: "Alerte",
  3: "Alerte critique",
};

export function formatAlertLevel(level: number): string {
  return ALERT_LABELS[level] ?? `Niveau ${level}`;
}

/** Classe daisyUI du badge d'alerte, de la plus rassurante à la plus grave. */
export function alertBadgeClass(level: number): string {
  switch (level) {
    case 0:
      return "badge-success";
    case 1:
      return "badge-info";
    case 2:
      return "badge-warning";
    default:
      return "badge-error";
  }
}

export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)} %`;
}

/**
 * Libellés des onze variables attendues par le modèle.
 *
 * Elles ne portent pas les noms des indicateurs de la plateforme : le modèle a
 * été entraîné sur un autre jeu de données, l'API fait la correspondance.
 */
const MODEL_INDICATOR_LABELS: Record<string, string> = {
  session_time: "Temps de connexion",
  mood_proxy: "Humeur déclarée",
  monthly_connection_days: "Jours de connexion",
  days_since_last_activity: "Jours depuis la dernière activité",
  time_on_content: "Temps passé sur les contenus",
  quiz_interaction_count: "Quiz lancés",
  chatbot_proxy: "Questions posées au chatbot",
  score_evolution: "Évolution des résultats",
  assessment_count: "Quiz terminés sur la période",
  cumul_assessments: "Quiz terminés au total",
  pass_rate: "Taux de réussite aux quiz",
};

export function formatModelIndicatorLabel(key: string): string {
  return MODEL_INDICATOR_LABELS[key] ?? key;
}

/** Unités des variables transmises, pour les relire sans se méprendre. */
export function formatModelIndicatorValue(
  key: string,
  value: number | null,
): string {
  if (value === null) return "—";

  switch (key) {
    case "session_time":
    case "time_on_content":
      return `${value} min`;
    case "days_since_last_activity":
      return value === 1 ? "1 jour" : `${value} jours`;
    case "monthly_connection_days":
      return value === 1 ? "1 jour" : `${value} jours`;
    case "mood_proxy":
      return `${value} / 5`;
    case "pass_rate":
      return `${Math.round(value * 100)} %`;
    default:
      return String(value);
  }
}

/**
 * Issues triées de la plus probable à la moins probable.
 *
 * Le modèle renvoie une issue retenue, mais la distribution complète dit
 * l'essentiel : une issue à 40 % contre 38 % ne se lit pas comme un verdict.
 */
export function sortedProbabilities(
  probabilities: Record<string, number>,
): { outcome: string; probability: number }[] {
  return Object.entries(probabilities)
    .map(([outcome, probability]) => ({ outcome, probability }))
    .sort((a, b) => b.probability - a.probability);
}
