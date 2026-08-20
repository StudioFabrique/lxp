import { useState } from "react";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { localeDate } from "../../../../utils/helpers/locale-date";
import {
  formatAlertRuleDescription,
  formatAlertRuleName,
  formatMatchedCondition,
  formatModelIndicatorLabel,
  formatModelIndicatorValue,
  formatOutcome,
  formatProbability,
  formatRiskLevel,
  isAlertDriven,
  isUncertain,
  missingDataSentence,
  outcomeSentence,
  riskLevel,
  severityBadgeClass,
  sortedProbabilities,
} from "../../helpers/format-prediction";
import type {
  FiredAlertRule,
  IndicatorsPrediction,
} from "../../interfaces/indicators";

interface PredictionPanelProps {
  prediction: IndicatorsPrediction;
}

/**
 * Résultat de l'analyse, tel qu'un formateur doit pouvoir le lire.
 *
 * Trois choses seulement : où en est l'apprenant, ce qui a été repéré, et sur
 * quoi cela repose. Le modèle employé, ses métriques et le nom de ses variables
 * n'apparaissent nulle part — ils ne changent rien à l'accompagnement.
 */
export default function PredictionPanel({ prediction }: PredictionPanelProps) {
  const [showData, setShowData] = useState(false);

  const level = riskLevel(prediction);
  const fired = prediction.alert.fired;
  const missing = missingDataSentence(prediction);

  return (
    <section className="flex flex-col gap-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Risque de décrochage</h2>
        <span className={`badge badge-soft ${severityBadgeClass(level)}`}>
          {formatRiskLevel(level)}
        </span>
      </div>

      <p className="max-w-3xl">
        {outcomeSentence(prediction.outcome.prediction)}
        {/* Une issue retenue à 40 % contre 38 % n'est pas un résultat tranché :
            le dire évite de faire passer une hésitation pour un pronostic. */}
        {isUncertain(prediction.outcome.probabilities) ? (
          <span className="text-base-content/60">
            {" "}
            L'analyse hésite toutefois entre plusieurs issues.
          </span>
        ) : null}
        {isAlertDriven(prediction) ? (
          <span className="text-base-content/60">
            {" "}
            Des signaux méritent malgré tout votre attention.
          </span>
        ) : null}
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BoxWrapper>
          <h3 className="text-sm font-bold text-base-content/70">
            Ce que l'activité laisse prévoir
          </h3>
          <ul className="flex flex-col gap-y-2">
            {sortedProbabilities(prediction.outcome.probabilities).map(
              ({ outcome, probability }) => (
                <li key={outcome} className="flex flex-col gap-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{formatOutcome(outcome)}</span>
                    <span className="font-bold">
                      {formatProbability(probability)}
                    </span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={Math.round(probability * 100)}
                    max={100}
                  />
                </li>
              ),
            )}
          </ul>
        </BoxWrapper>

        <BoxWrapper>
          <h3 className="text-sm font-bold text-base-content/70">
            Ce qui a été repéré sur la période
          </h3>

          {fired.length === 0 ? (
            <p className="text-sm italic text-base-content/50">
              Aucun signal d'alerte : assiduité, travail des contenus et
              résultats restent dans les clous.
            </p>
          ) : (
            <ul className="flex flex-col gap-y-3">
              {fired.map((rule) => (
                <FiredRule key={rule.ruleId} rule={rule} />
              ))}
            </ul>
          )}
        </BoxWrapper>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-base-content/50">
          Analyse fondée sur l'activité du {localeDate(prediction.from)} au{" "}
          {localeDate(prediction.to)}.{missing ? ` ${missing}` : ""}
        </p>

        <button
          type="button"
          className="btn btn-ghost btn-sm normal-case"
          onClick={() => setShowData((visible) => !visible)}
        >
          {showData
            ? "Masquer les données utilisées"
            : "Voir les données utilisées"}
        </button>
      </div>

      {showData ? <AnalysedData prediction={prediction} /> : null}
    </section>
  );
}

function FiredRule({ rule }: { rule: FiredAlertRule }) {
  const description = formatAlertRuleDescription(rule.name, rule.description);

  return (
    <li className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <span className={`badge badge-xs ${severityBadgeClass(rule.level)}`} />
        <p className="text-sm font-bold">{formatAlertRuleName(rule.name)}</p>
      </div>

      {description ? (
        <p className="text-xs text-base-content/50">{description}</p>
      ) : null}

      {/* Ce qui a fait basculer la règle, valeur et seuil dans la même unité :
          le signal doit pouvoir être expliqué à l'apprenant. */}
      <ul className="text-xs text-base-content/50">
        {rule.matched.map((condition, index) => (
          <li key={`${condition.indicator}-${index}`}>
            {formatMatchedCondition(condition)}
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Les données de la période sur lesquelles l'analyse s'est appuyée. */
function AnalysedData({ prediction }: PredictionPanelProps) {
  return (
    <BoxWrapper>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(prediction.indicators).map(([key, value]) => (
          <li key={key} className="flex flex-col gap-y-0.5">
            <span className="text-xs text-base-content/50">
              {formatModelIndicatorLabel(key)}
            </span>
            <span className="text-sm font-bold">
              {formatModelIndicatorValue(key, value)}
            </span>
            {value === null && prediction.missing[key] ? (
              <span className="text-xs italic text-base-content/50">
                {prediction.missing[key]}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
}
