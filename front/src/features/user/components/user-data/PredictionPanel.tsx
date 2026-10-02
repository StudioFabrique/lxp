import { useState } from "react";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { formatOutcome, formatProbability, formatRiskLevel, isAlertDriven, isUncertain, outcomeSentence, riskLevel, severityBadgeClass, sortedProbabilities } from "../../helpers/format-prediction";
import { cn } from "../../../../utils/cn";
import { type PredictionPanelProps } from "./PredictionPanel.types";
import { FiredRule } from "./FiredRule";
import { AnalysedData } from "./AnalysedData";

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

  return (
    <section className="flex flex-col gap-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Risque de décrochage</h2>
        <span className={cn("badge badge-soft", severityBadgeClass(level))}>
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
              Aucun signal d'alerte.
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

      <div className="flex flex-wrap items-center justify-end gap-2">
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
