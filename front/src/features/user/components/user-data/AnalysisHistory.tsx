import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Eye, MessageSquareText } from "lucide-react";
import Modal from "../../../../components/UI/modal/modal";
import { indicatorsApi } from "../../api/indicators.api";
import PredictionPanel from "./PredictionPanel";
import AnalysisFeedbackForm, { VERDICT_LABELS } from "./AnalysisFeedbackForm";
import { formatOutcome } from "../../helpers/format-prediction";
import type { AnalysisHistory as AnalysisHistoryResponse } from "../../interfaces/indicators";
import AnalysisTimelineChart from "./AnalysisTimelineChart";

type HistoricalAnalysis = AnalysisHistoryResponse["items"][number];

export default function AnalysisHistory({
  studentId,
  onDailyAnalysisChange,
}: {
  studentId: string;
  onDailyAnalysisChange?: (reached: boolean) => void;
}) {
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<HistoricalAnalysis | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const history = useInfiniteQuery({
    queryKey: ["analysis-history", studentId],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      indicatorsApi.queries.getAnalysisHistory(studentId, pageParam),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  const analyses = history.data?.pages.flatMap((page) => page.items) ?? [];
  const visibleAnalyses = analyses.slice(0, visibleCount);
  const canShowMore = visibleCount < analyses.length || history.hasNextPage;
  const today = new Date().toISOString().slice(0, 10);
  const dailyLimitReached = analyses.some(
    (analysis) => analysis.evaluatedAt.slice(0, 10) === today,
  );
  useEffect(() => {
    onDailyAnalysisChange?.(dailyLimitReached);
  }, [dailyLimitReached, onDailyAnalysisChange]);
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold">Historique des analyses</h2>
        <p className="text-sm text-base-content/60">
          Évolution des estimations au fil des analyses.
        </p>
      </div>
      {history.isPending ? <p>Chargement de l'historique…</p> : null}
      {history.isError ? (
        <p role="alert">
          Impossible de charger l'historique.{" "}
          <button className="btn btn-sm" onClick={() => history.refetch()}>
            Réessayer
          </button>
        </p>
      ) : null}
      {history.data?.pages[0]?.items.length === 0 ? (
        <p>Aucune analyse enregistrée.</p>
      ) : null}
      {analyses.length ? <AnalysisTimelineChart analyses={analyses} /> : null}
      {analyses.length ? (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Détail des analyses</h3>
          {visibleAnalyses.map((analysis) => (
            <article
              key={analysis.analysisId}
              className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    Analyse du{" "}
                    {new Date(analysis.evaluatedAt).toLocaleDateString(
                      "fr-FR",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {new Date(analysis.evaluatedAt).toLocaleTimeString(
                      "fr-FR",
                      { hour: "2-digit", minute: "2-digit" },
                    )}{" "}
                    · Issue estimée :{" "}
                    {formatOutcome(analysis.outcome.prediction)}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-base-content/60">
                    <MessageSquareText
                      className="size-3.5"
                      aria-hidden="true"
                    />
                    {analysis.feedback.length
                      ? `${analysis.feedback.length} retour${analysis.feedback.length > 1 ? "s" : ""}`
                      : "Aucun retour"}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <AnalysisFeedbackForm
                  prediction={analysis}
                  hasExistingFeedback={analysis.hasMyFeedback}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm gap-2"
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <Eye className="size-4" aria-hidden="true" />
                  Voir les détails
                </button>
              </div>
            </article>
          ))}
          {canShowMore ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm self-center"
              disabled={history.isFetchingNextPage}
              onClick={async () => {
                if (visibleCount >= analyses.length && history.hasNextPage)
                  await history.fetchNextPage();
                setVisibleCount((count) => count + 5);
              }}
            >
              {history.isFetchingNextPage ? (
                <>
                  <span className="loading loading-spinner loading-xs" />{" "}
                  Chargement…
                </>
              ) : (
                "Afficher plus"
              )}
            </button>
          ) : null}
        </div>
      ) : null}
      {selectedAnalysis ? (
        <AnalysisDetailsModal
          analysis={selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      ) : null}
    </section>
  );
}

function AnalysisDetailsModal({
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
