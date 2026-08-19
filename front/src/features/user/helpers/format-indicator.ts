import type { Indicator, IndicatorUnit } from "../interfaces/indicators";

/**
 * Mise en forme des valeurs d'indicateurs.
 *
 * Les durées transitent en millisecondes : le front les arrondissait jusqu'ici
 * à l'heure supérieure, si bien qu'une minute de connexion s'affichait
 * « 1 heure ». Le formatage se fait donc ici, sur la valeur exacte.
 */

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;

export function formatDuration(milliseconds: number): string {
  if (milliseconds <= 0) return "0 min";

  const hours = Math.floor(milliseconds / MS_PER_HOUR);
  const minutes = Math.round((milliseconds % MS_PER_HOUR) / MS_PER_MINUTE);

  // 59 min 60 s ne doit pas s'afficher « 0 h 60 ».
  if (minutes === 60) return `${hours + 1} h`;
  if (hours === 0) return `${Math.max(minutes, 1)} min`;
  if (minutes === 0) return `${hours} h`;

  return `${hours} h ${String(minutes).padStart(2, "0")}`;
}

/**
 * Durée en minutes pour les graphiques.
 *
 * Une durée non nulle vaut au moins une minute, comme dans `formatDuration` :
 * sinon la carte affiche « 1 min » et la barre correspondante reste à zéro.
 */
export function toDisplayMinutes(milliseconds: number): number {
  if (milliseconds <= 0) return 0;
  return Math.max(1, Math.round(milliseconds / MS_PER_MINUTE));
}

export function formatDays(days: number): string {
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days} jours`;
}

const MOOD_LABELS: Record<number, string> = {
  1: "Très difficile",
  2: "Difficile",
  3: "Mitigé",
  4: "Plutôt bien",
  5: "Au beau fixe",
};

export function formatMood(level: number): string {
  return MOOD_LABELS[level] ?? `Niveau ${level}`;
}

export function formatTrend(deltaPoints: number): string {
  if (deltaPoints > 0) return `+${deltaPoints} pts`;
  if (deltaPoints < 0) return `${deltaPoints} pts`;
  return "stable";
}

export function formatIndicatorValue(
  value: number | null,
  unit: IndicatorUnit | undefined,
): string {
  if (value === null) return "—";

  switch (unit) {
    case "ms":
      return formatDuration(value);
    case "days":
      return formatDays(value);
    case "percent":
      return `${value} %`;
    case "level":
      return formatMood(value);
    case "trend":
      return formatTrend(value);
    case "count":
    default:
      return String(value);
  }
}

/** Message affiché quand l'indicateur n'a rien à montrer. */
export function indicatorEmptyMessage(indicator: Indicator): string {
  const reason = indicator.meta?.reason;
  if (typeof reason === "string") return reason;

  const error = indicator.meta?.error;
  if (typeof error === "string") return `Calcul indisponible : ${error}`;

  return "Pas encore de donnée.";
}
