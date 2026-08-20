import {
  AiApiError,
  AiConfigurationError,
  aiApiClient,
} from "../../services/ai/ai-api-client.ts";
import { logger } from "../../utils/logs/logger.ts";
import getAllIndicators from "./get-all-indicators.ts";
import getAssessmentsSummary from "./get-assessments-summary.ts";
import resolveIndicatorContext from "./indicator-context.ts";
import toModelIndicators, {
  MODEL_INDICATOR_KEYS,
  type ModelIndicators,
} from "./model-features.ts";

/** Chemin du modèle d'indicateurs dans le service IA. */
const PREDICT_PATH = "/indicators/predict";

/**
 * Étiquette de provenance renvoyée telle quelle par le service IA. Le modèle a
 * été entraîné sur OULAD ; préciser `lxp` garde la trace, dans la réponse, que
 * les valeurs soumises viennent de la plateforme et non du jeu de données.
 */
const PREDICTION_SOURCE = "lxp";

export class IndicatorPredictionError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "IndicatorPredictionError";
    this.statusCode = statusCode;
  }
}

/** Réponse brute du service IA, en `snake_case`. */
type AiPredictionResponse = {
  outcome: { prediction: string; probabilities: Record<string, number> };
  alert: {
    effective_level: number;
    fired: {
      rule_id: number;
      name: string;
      level: number;
      description: string | null;
      matched: {
        indicator: string;
        op: string;
        threshold: number | number[];
        actual: number | null;
      }[];
    }[];
  };
  model?: {
    champion_name?: string;
    trained_at?: string | null;
    metric_value?: number | null;
    n_features?: number;
  };
  evaluated_at: string;
};

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

export type IndicatorPrediction = {
  userId: string;
  from: string;
  to: string;
  /** Les onze variables envoyées au modèle, `null` compris. */
  indicators: ModelIndicators;
  /** Raison, par variable absente, de son `null`. */
  missing: Record<string, string>;
  coverage: { available: number; total: number };
  outcome: { prediction: string; probabilities: Record<string, number> };
  alert: { effectiveLevel: number; fired: FiredAlertRule[] };
  model: {
    championName: string | null;
    trainedAt: string | null;
    metricValue: number | null;
    featureCount: number | null;
  };
  evaluatedAt: string;
};

/**
 * Interroge le modèle d'indicateurs du service IA pour un apprenant.
 *
 * Les indicateurs de la plateforme sont calculés puis traduits vers le contrat
 * du modèle, qui renvoie une issue probable — `graduate`, `fail` ou `dropout` —
 * et le résultat de ses règles d'alerte. Le détail de ce qui a été envoyé est
 * conservé dans la réponse : une prédiction fondée sur quatre variables sur
 * onze doit pouvoir être relativisée par celui qui la lit.
 */
export default async function predictOutcome(
  userIdMdb: string,
  from?: Date,
  to?: Date,
): Promise<IndicatorPrediction> {
  const context = await resolveIndicatorContext(userIdMdb, from, to);

  const [payload, assessments] = await Promise.all([
    getAllIndicators(userIdMdb, context.from, context.to),
    getAssessmentsSummary(context),
  ]);

  const features = toModelIndicators(payload, assessments);
  const available = MODEL_INDICATOR_KEYS.filter(
    (key) => features.indicators[key] !== null,
  ).length;

  const response = await requestPrediction(userIdMdb, features.indicators);

  return {
    userId: payload.userId,
    from: payload.from,
    to: payload.to,
    indicators: features.indicators,
    missing: features.missing,
    coverage: { available, total: MODEL_INDICATOR_KEYS.length },
    outcome: response.outcome,
    alert: {
      effectiveLevel: response.alert.effective_level,
      fired: response.alert.fired.map((rule) => ({
        ruleId: rule.rule_id,
        name: rule.name,
        level: rule.level,
        description: rule.description ?? null,
        matched: rule.matched,
      })),
    },
    model: {
      championName: response.model?.champion_name ?? null,
      trainedAt: response.model?.trained_at ?? null,
      metricValue: response.model?.metric_value ?? null,
      featureCount: response.model?.n_features ?? null,
    },
    evaluatedAt: response.evaluated_at,
  };
}

async function requestPrediction(
  userIdMdb: string,
  indicators: ModelIndicators,
): Promise<AiPredictionResponse> {
  try {
    return await aiApiClient.postJson<AiPredictionResponse>(PREDICT_PATH, {
      subject: userIdMdb,
      body: { source: PREDICTION_SOURCE, indicators },
    });
  } catch (error) {
    throw toPredictionError(error);
  }
}

function toPredictionError(error: unknown): IndicatorPredictionError {
  if (error instanceof AiConfigurationError) {
    logger.error("[PREDICTION IA]", error);
    return new IndicatorPredictionError(
      500,
      "Le service IA n'est pas configuré.",
    );
  }

  if (error instanceof AiApiError) {
    logger.error("[PREDICTION IA]", error.responseBody);

    // Le service IA répond en erreur tant qu'aucun modèle n'a été entraîné :
    // c'est une indisponibilité temporaire, pas une requête fautive.
    if (error.status >= 500) {
      return new IndicatorPredictionError(
        503,
        "Le modèle de prédiction est indisponible. Vérifier qu'un entraînement a bien été effectué sur le service IA.",
      );
    }

    return new IndicatorPredictionError(
      error.status,
      detailOf(error.responseBody) ??
        "Le service IA a refusé la demande de prédiction.",
    );
  }

  logger.error("[PREDICTION IA]", error);

  return new IndicatorPredictionError(
    502,
    "Le service IA n'a pas pu être interrogé. Vérifier qu'il est bien démarré.",
  );
}

function detailOf(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;

  const detail = (body as { detail?: unknown }).detail;

  return typeof detail === "string" ? detail : null;
}
