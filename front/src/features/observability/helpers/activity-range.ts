import type { ActivityPeriod } from "../api/observability.api";

/**
 * Fenêtre d'analyse : une période prédéfinie, ou un intervalle de jours choisi
 * au calendrier. Les jours sont locaux (`YYYY-MM-DD`) et la fin est incluse.
 */
export type ActivityRange =
  | { kind: "preset"; period: ActivityPeriod }
  | { kind: "custom"; startDate: string; endDate: string };

export const presetRange = (period: ActivityPeriod): ActivityRange => ({
  kind: "preset",
  period,
});

const parseLocalDay = (value: string, dayOffset = 0): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day + dayOffset);
};

/**
 * Paramètres d'API d'une fenêtre. Un intervalle part du début du premier jour
 * local et s'arrête au début du lendemain du dernier (borne de fin exclue).
 */
export function rangeParams(range: ActivityRange): Record<string, string> {
  if (range.kind === "preset") return { period: range.period };
  return {
    from: parseLocalDay(range.startDate).toISOString(),
    to: parseLocalDay(range.endDate, 1).toISOString(),
  };
}

/** Clé stable pour TanStack Query. */
export const rangeKey = (range: ActivityRange): string =>
  range.kind === "preset"
    ? range.period
    : `custom:${range.startDate}:${range.endDate}`;

const shortDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
    parseLocalDay(value),
  );

/** Texte du bouton calendrier quand un intervalle est actif. */
export function customRangeLabel(startDate: string, endDate: string): string {
  return startDate === endDate
    ? shortDate(startDate)
    : `Du ${shortDate(startDate)} au ${shortDate(endDate)}`;
}
