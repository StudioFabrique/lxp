import Modal from "../../../../components/UI/modal/modal";
import PredictionPanel from "./PredictionPanel";
import { VERDICT_LABELS } from "./AnalysisFeedbackForm";
import { formatOutcome } from "../../helpers/format-prediction";
import { type HistoricalAnalysis } from "./AnalysisHistory.types";

export function AnalysisDetailsModal({
  analysis,
  onClose,
}: {
  analysis: HistoricalAnalysis;
  onClose: () => void;
}) {
  return (
    <Modal
      title={`Analyse du ${new Date(analysis.evaluatedAt).toLocaleDateString("fr-FR")}`}
      onLeftClick={onClose}
      leftLabel="Fermer"
      closeButtonAtTop
      modalBoxStyle="w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto"
    >
      <p className="my-4 text-sm text-base-content/60">
        Période analysée du{" "}
        {new Date(analysis.from).toLocaleDateString("fr-FR")} au{" "}
        {new Date(analysis.to).toLocaleDateString("fr-FR")}
      </p>
      <PredictionPanel prediction={analysis} />
      <section className="mt-6 border-t border-base-300 pt-5">
        <h3 className="font-semibold">Retours enregistrés</h3>
        {analysis.feedback.length ? (
          <div className="mt-3 flex flex-col gap-3">
            {analysis.feedback.map((feedback) => (
              <article
                key={feedback._id}
                className="rounded-lg bg-base-200 p-4"
              >
                <p className="font-medium">
                  {VERDICT_LABELS[feedback.verdict]}
                </p>
                <p className="text-xs text-base-content/60">
                  {new Date(feedback.createdAt).toLocaleString("fr-FR")}
                </p>
                {feedback.comment ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {feedback.comment}
                  </p>
                ) : null}
                {feedback.actionTaken ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    <span className="font-medium">Accompagnement :</span>{" "}
                    {feedback.actionTaken}
                  </p>
                ) : null}
                {feedback.observedOutcome ? (
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Résultat constaté :</span>{" "}
                    {formatOutcome(feedback.observedOutcome)} (
                    {new Date(feedback.createdAt).toLocaleString("fr-FR")})
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-base-content/60">
            Aucun retour enregistré pour cette analyse.
          </p>
        )}
      </section>
    </Modal>
  );
}
