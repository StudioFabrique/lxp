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

/**
 * Prédiction du modèle IA, miroir du contrat renvoyé par
 * `POST /v1/indicators/:userId/prediction`.
 */

/** Issue estimée pour l'apprenant. */
export type PredictionOutcome = "graduate" | "fail" | "dropout";

/** Condition d'une règle d'alerte qui s'est vérifiée. */
export type MatchedCondition = {
  indicator: string;
  op: string;
  threshold: number | number[];
  actual: number | null;
};

export type FiredAlertRule = {
  ruleId: number;
  name: string;
  level: number;
  description: string | null;
  matched: MatchedCondition[];
};

export type IndicatorsPrediction = {
  userId: string;
  from: string;
  to: string;
  /** Les onze variables envoyées au modèle, `null` quand la source manque. */
  indicators: Record<string, number | null>;
  /** Raison, par variable absente, de son `null`. */
  missing: Record<string, string>;
  coverage: { available: number; total: number };
  outcome: {
    prediction: PredictionOutcome | string;
    probabilities: Record<string, number>;
  };
  alert: { effectiveLevel: number; fired: FiredAlertRule[] };
  model: {
    championName: string | null;
    trainedAt: string | null;
    metricValue: number | null;
    featureCount: number | null;
  };
  evaluatedAt: string;
};
