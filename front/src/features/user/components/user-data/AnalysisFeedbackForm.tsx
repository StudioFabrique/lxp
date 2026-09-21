import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { MessageSquareText } from "lucide-react";
import Modal from "../../../../components/UI/modal/modal";
import { indicatorsApi } from "../../api/indicators.api";
import type {
  AnalysisFeedbackInput,
  IndicatorsPrediction,
  PredictionOutcome,
} from "../../interfaces/indicators";

export const VERDICT_LABELS = {
  appropriate: "Analyse pertinente",
  overestimated: "Risque surestimé",
  underestimated: "Risque sous-estimé",
  uncertain: "Je ne peux pas encore me prononcer",
};

export default function AnalysisFeedbackForm({
  prediction,
  hasExistingFeedback = false,
}: {
  prediction: IndicatorsPrediction;
  hasExistingFeedback?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [verdict, setVerdict] = useState<AnalysisFeedbackInput["verdict"] | "">(
    "",
  );
  const [comment, setComment] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [outcome, setOutcome] = useState<PredictionOutcome | "">("");
  const [observedAt, setObservedAt] = useState("");
  const mutation = useMutation({
    mutationFn: (input: AnalysisFeedbackInput) =>
      indicatorsApi.mutations.saveAnalysisFeedback(
        prediction.userId,
        prediction.analysisId!,
        input,
      ),
    onSuccess: () => {
      setHasSubmitted(true);
      setIsOpen(false);
      void queryClient.invalidateQueries({
        queryKey: ["analysis-history", prediction.userId],
      });
    },
  });
  if (!prediction.analysisId || hasExistingFeedback || hasSubmitted) return null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!verdict) return;
    mutation.mutate({
      verdict,
      comment,
      actionTaken,
      ...(outcome
        ? {
            observedOutcome: outcome,
            observedAt: new Date(observedAt).toISOString(),
          }
        : {}),
    });
  };
  const resetForm = () => {
    mutation.reset();
    setVerdict("");
    setComment("");
    setActionTaken("");
    setOutcome("");
    setObservedAt("");
  };
  const close = () => {
    setIsOpen(false);
    resetForm();
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-primary btn-sm gap-2"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquareText className="size-4" aria-hidden="true" />
        Donner mon avis
      </button>
      {isOpen ? (
        <Modal
          title="Votre retour sur cette analyse"
          onLeftClick={close}
          leftLabel="Fermer"
          closeButtonAtTop
          modalBoxStyle="w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
            <p className="text-sm text-base-content/70">
              Votre retour aide à évaluer les analyses. L'amélioration du modèle
              nécessite des résultats observés et validés dans le temps.
            </p>
            <label className="flex flex-col gap-1">
              Votre avis
              <select
                className="select select-bordered w-full"
                required
                value={verdict}
                onChange={(e) => setVerdict(e.target.value as typeof verdict)}
              >
                <option value="">Choisir un avis</option>
                {Object.entries(VERDICT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              Commentaire (facultatif)
              <textarea
                className="textarea textarea-bordered w-full"
                maxLength={2000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Accompagnement mis en place (facultatif)
              <textarea
                className="textarea textarea-bordered w-full"
                maxLength={2000}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Résultat final constaté après cette analyse
              <select
                className="select select-bordered w-full"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as typeof outcome)}
              >
                <option value="">Pas encore connu</option>
                <option value="graduate">Réussite</option>
                <option value="fail">Échec</option>
                <option value="dropout">Abandon</option>
              </select>
            </label>
            {outcome ? (
              <label className="flex flex-col gap-1">
                Date et heure du constat
                <input
                  className="input input-bordered"
                  type="datetime-local"
                  required
                  value={observedAt}
                  onChange={(e) => setObservedAt(e.target.value)}
                />
              </label>
            ) : null}
            {mutation.isError ? (
              <p role="alert" className="text-error">
                {isAxiosError(mutation.error)
                  ? (mutation.error.response?.data?.message ??
                    "Impossible d'enregistrer le retour.")
                  : "Impossible d'enregistrer le retour."}
              </p>
            ) : null}
            {mutation.isSuccess ? (
              <>
                <p role="status">Retour enregistré.</p>
                <button
                  type="button"
                  className="btn btn-ghost self-start"
                  onClick={resetForm}
                >
                  Ajouter un nouveau retour
                </button>
              </>
            ) : null}
            <button
              className="btn btn-primary self-end"
              disabled={mutation.isPending || mutation.isSuccess}
              type="submit"
            >
              {mutation.isPending ? "Enregistrement…" : "Enregistrer le retour"}
            </button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
