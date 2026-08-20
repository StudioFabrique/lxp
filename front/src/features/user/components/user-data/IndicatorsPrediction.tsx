import { useState } from "react";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { localeDate } from "../../../../utils/helpers/locale-date";
import useStudentPrediction from "../../hooks/useStudentPrediction";
import {
  alertBadgeClass,
  formatAlertLevel,
  formatModelIndicatorLabel,
  formatModelIndicatorValue,
  formatOutcome,
  formatProbability,
  sortedProbabilities,
} from "../../helpers/format-prediction";
import type {
  FiredAlertRule,
  IndicatorsPrediction as Prediction,
} from "../../interfaces/indicators";

interface IndicatorsPredictionProps {
  studentId: string;
  /** Fenêtre des indicateurs affichés : la prédiction porte sur la même. */
  range: { from: string; to: string } | null;
  /** `true` tant que les indicateurs ne sont pas chargés. */
  disabled?: boolean;
}

/**
 * Interrogation du modèle IA depuis la fiche de l'apprenant.
 *
 * L'analyse est déclenchée par un bouton et jamais au chargement de la page :
 * chaque appel lance une inférence, et un pronostic d'abandon affiché
 * d'office prendrait la place d'un indicateur mesuré.
 */
export default function IndicatorsPrediction({
  studentId,
  range,
  disabled = false,
}: IndicatorsPredictionProps) {
  const { prediction, predict, isPending } = useStudentPrediction(
    studentId,
    range,
  );

  return (
    <section className="flex flex-col gap-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-xl font-bold">Analyse du modèle IA</h2>
          <p className="max-w-2xl text-xs text-base-content/50">
            Le modèle estime une issue de parcours à partir des indicateurs
            ci-dessus et signale les règles d'alerte franchies. C'est une aide à
            la décision, pas un verdict.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary normal-case"
          onClick={() => predict()}
          disabled={isPending || disabled}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner" />
              Analyse en cours…
            </>
          ) : prediction ? (
            "Relancer l'analyse"
          ) : (
            "Interroger le modèle IA"
          )}
        </button>
      </div>

      {prediction ? (
        <PredictionResult prediction={prediction} />
      ) : (
        <p className="text-sm italic text-base-content/50">
          {isPending
            ? "Interrogation du service IA…"
            : "Aucune analyse pour le moment."}
        </p>
      )}
    </section>
  );
}

function PredictionResult({ prediction }: { prediction: Prediction }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const { alert, coverage, model } = prediction;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BoxWrapper>
          <h3 className="text-sm font-bold text-base-content/70">
            Issue estimée
          </h3>
          <p className="text-2xl font-bold">
            {formatOutcome(prediction.outcome.prediction)}
          </p>

          {/* La distribution complète, parce qu'une issue retenue à 40 %
              contre 38 % ne se lit pas comme un résultat tranché. */}
          <ul className="flex flex-col gap-y-2">
            {sortedProbabilities(prediction.outcome.probabilities).map(({ outcome, probability }) => (
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
            ))}
          </ul>
        </BoxWrapper>

        <BoxWrapper>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-base-content/70">
              Alertes de risque
            </h3>
            <span
              className={`badge badge-soft ${alertBadgeClass(alert.effectiveLevel)}`}
            >
              {formatAlertLevel(alert.effectiveLevel)}
            </span>
          </div>

          {alert.fired.length === 0 ? (
            <p className="text-sm italic text-base-content/50">
              Aucune règle d'alerte n'est franchie sur la période.
            </p>
          ) : (
            <ul className="flex flex-col gap-y-3">
              {alert.fired.map((rule) => (
                <FiredRule key={rule.ruleId} rule={rule} />
              ))}
            </ul>
          )}
        </BoxWrapper>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-base-content/50">
          {coverage.available} variables sur {coverage.total} transmises au
          modèle, sur la période du {localeDate(prediction.from)} au{" "}
          {localeDate(prediction.to)}.
          {model.championName
            ? ` Modèle ${model.championName}${
                model.trainedAt
                  ? `, entraîné le ${localeDate(model.trainedAt)}`
                  : ""
              }.`
            : ""}
        </p>

        <button
          type="button"
          className="btn btn-ghost btn-sm normal-case"
          onClick={() => setShowFeatures((visible) => !visible)}
        >
          {showFeatures
            ? "Masquer les variables transmises"
            : "Voir les variables transmises"}
        </button>
      </div>

      {showFeatures ? <SubmittedFeatures prediction={prediction} /> : null}
    </div>
  );
}

function FiredRule({ rule }: { rule: FiredAlertRule }) {
  return (
    <li className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <span className={`badge badge-xs ${alertBadgeClass(rule.level)}`} />
        <p className="text-sm font-bold">{rule.name}</p>
      </div>

      {rule.description ? (
        <p className="text-xs text-base-content/50">{rule.description}</p>
      ) : null}

      {/* Les seuils franchis sont affichés tels quels : la règle doit pouvoir
          être expliquée à l'apprenant, ce n'est pas une boîte noire. */}
      <ul className="text-xs text-base-content/50">
        {rule.matched.map((condition, index) => (
          <li key={`${condition.indicator}-${index}`}>
            {formatModelIndicatorLabel(condition.indicator)} {condition.op}{" "}
            {Array.isArray(condition.threshold)
              ? condition.threshold.join(" – ")
              : condition.threshold}{" "}
            (mesuré : {condition.actual ?? "—"})
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Ce qui a été envoyé au modèle, et pourquoi une variable manque. */
function SubmittedFeatures({ prediction }: { prediction: Prediction }) {
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
