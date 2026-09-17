import { useInfiniteQuery } from "@tanstack/react-query";
import { indicatorsApi } from "../../api/indicators.api";
import PredictionPanel from "./PredictionPanel";
import AnalysisFeedbackForm, { VERDICT_LABELS } from "./AnalysisFeedbackForm";
import { formatOutcome } from "../../helpers/format-prediction";

export default function AnalysisHistory({ studentId }: { studentId: string }) {
  const history = useInfiniteQuery({
    queryKey: ["analysis-history", studentId],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => indicatorsApi.queries.getAnalysisHistory(studentId, pageParam),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  return <section className="flex flex-col gap-3">
    <h2 className="text-xl font-bold">Historique des analyses</h2>
    {history.isPending ? <p>Chargement de l'historique…</p> : null}
    {history.isError ? <p role="alert">Impossible de charger l'historique. <button className="btn btn-sm" onClick={() => history.refetch()}>Réessayer</button></p> : null}
    {history.data?.pages[0]?.items.length === 0 ? <p>Aucune analyse enregistrée.</p> : null}
    {history.data?.pages.flatMap((page) => page.items).map((analysis) => <details key={analysis.analysisId} className="border border-base-300 rounded-lg p-4">
      <summary className="cursor-pointer">{new Date(analysis.evaluatedAt).toLocaleString("fr-FR")} — {formatOutcome(analysis.outcome.prediction)}</summary>
      <p className="text-sm my-3">Période du {new Date(analysis.from).toLocaleDateString("fr-FR")} au {new Date(analysis.to).toLocaleDateString("fr-FR")}</p>
      <PredictionPanel prediction={analysis} />
      {analysis.feedback.length ? <div className="mt-4"><h3 className="font-semibold">Retours enregistrés (20 derniers au maximum)</h3>
        {analysis.feedback.map((feedback) => <article key={feedback._id} className="my-3 border-l-2 pl-3">
          <p>{new Date(feedback.createdAt).toLocaleString("fr-FR")} — {VERDICT_LABELS[feedback.verdict]}</p>
          {feedback.comment ? <p className="whitespace-pre-wrap">{feedback.comment}</p> : null}
          {feedback.actionTaken ? <p className="whitespace-pre-wrap">Accompagnement : {feedback.actionTaken}</p> : null}
          {feedback.observedOutcome ? <p>Résultat constaté : {formatOutcome(feedback.observedOutcome)} ({new Date(feedback.observedAt!).toLocaleString("fr-FR")})</p> : null}
        </article>)}
      </div> : null}
      <AnalysisFeedbackForm prediction={analysis} />
    </details>)}
    {history.hasNextPage ? <button className="btn self-start" disabled={history.isFetchingNextPage} onClick={() => history.fetchNextPage()}>Analyses précédentes</button> : null}
  </section>;
}
