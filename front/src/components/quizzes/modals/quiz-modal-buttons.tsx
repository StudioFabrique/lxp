import { useState } from "react";

type Props = {
  externalId: string;
  isValid: boolean;
  onValidate: () => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
};

const QuizModalButtons = ({
  externalId,
  isValid,
  onValidate,
  onReport,
}: Props) => {
  const [isReporting, setIsReporting] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // AJOUT : État de soumission local

  const handleSubmitReport = async () => {
    if (comment && comment.trim() !== "") {
      setIsSubmitting(true);
      try {
        await onReport(externalId, comment.trim());
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
      }
    }
  };

  if (isReporting) {
    return (
      <div className="flex flex-col gap-2 mt-4 p-3 bg-base-200 rounded-lg border border-warning/20 transition-all">
        <label className="label py-0">
          <span className="label-text font-medium text-sm">
            Pourquoi cette question est-elle incorrecte ?
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full text-sm bg-base-100 focus:outline-none"
          placeholder="Ex: Il manque une réponse"
          rows={3}
          draggable={false}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-1">
          <button
            className="btn btn-sm btn-ghost"
            disabled={isSubmitting}
            onClick={() => {
              setIsReporting(false);
              setComment("");
            }}
          >
            Annuler
          </button>
          <button
            className="btn btn-sm btn-warning gap-2"
            disabled={isSubmitting || !comment.trim()}
            onClick={handleSubmitReport}
          >
            {isSubmitting && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            Envoyer le signalement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between mt-4">
      <div className="self-end flex items-center">
        <button
          className="btn btn-sm hover:btn-warning btn-link"
          onClick={() => setIsReporting(true)}
        >
          Signaler un problème
        </button>
      </div>
      <button
        className="btn btn-secondary"
        onClick={onValidate}
        disabled={!isValid}
      >
        Valider ma réponse
      </button>
    </div>
  );
};

export default QuizModalButtons;
