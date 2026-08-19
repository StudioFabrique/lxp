/**
 * Miroir du contrat `Indicator` défini côté API dans
 * `api/src/models/indicators/types.ts`.
 *
 * Le dépôt n'a pas de paquet de types partagé entre le front et l'API : la
 * double déclaration est la convention en place, à tenir à jour à la main.
 */

export type IndicatorUnit =
  | "ms"
  | "days"
  | "count"
  | "percent"
  | "level"
  | "trend";

export type IndicatorPoint = {
  date: string;
  value: number;
};

export type Indicator<TValue = number> = {
  key: string;
  label: string;
  value: TValue | null;
  unit?: IndicatorUnit;
  /** `false` : rien à afficher. On montre un état vide, jamais un zéro. */
  available: boolean;
  series?: IndicatorPoint[];
  meta?: Record<string, unknown>;
};

export type IndicatorsResponse = {
  userId: string;
  from: string;
  to: string;
  indicators: Record<string, Indicator>;
};

/** Progression d'un module, portée par `parcours_progression.meta.modules`. */
export type IndicatorModuleProgress = {
  id: number;
  title: string;
  progress: number;
};
