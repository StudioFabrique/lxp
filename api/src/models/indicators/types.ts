/**
 * Contrat commun à tous les indicateurs.
 *
 * Chaque indicateur est une fonction autonome de `models/indicators`, appelable
 * isolément depuis n'importe quel autre modèle, et renvoyant toujours la même
 * forme : c'est ce qui permet à l'interface d'en afficher la liste sans
 * connaître chacun d'eux.
 */

export type IndicatorUnit =
  | "ms"
  | "days"
  | "count"
  | "percent"
  | "level"
  | "trend";

export type IndicatorPoint = {
  /** Jour au format ISO court (YYYY-MM-DD). */
  date: string;
  value: number;
};

export type Indicator<TValue = number> = {
  key: string;
  label: string;
  value: TValue | null;
  unit?: IndicatorUnit;
  /**
   * `false` quand l'indicateur n'a rien à montrer : apprenant sans fiche,
   * aucune donnée sur la période, ou calcul en échec. L'interface affiche
   * alors un état vide explicite plutôt qu'un zéro trompeur.
   */
  available: boolean;
  series?: IndicatorPoint[];
  meta?: Record<string, unknown>;
};

export type IndicatorContext = {
  /** Identifiant MongoDB de l'utilisateur. */
  userIdMdb: string;
  /** Identifiant PostgreSQL de l'apprenant, `null` si ce n'en est pas un. */
  studentId: number | null;
  from: Date;
  to: Date;
};

export type IndicatorFn = (
  context: IndicatorContext,
) => Promise<Indicator<any>>;

export type IndicatorsPayload = {
  userId: string;
  from: string;
  to: string;
  indicators: Record<string, Indicator<any>>;
};

/** Indicateur vide, pour les cas « pas de donnée » sans erreur. */
export function emptyIndicator<TValue>(
  key: string,
  label: string,
  unit: IndicatorUnit,
  meta?: Record<string, unknown>,
): Indicator<TValue> {
  return { key, label, value: null, unit, available: false, meta };
}

export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
