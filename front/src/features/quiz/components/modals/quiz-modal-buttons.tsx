import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizReportSchema } from "../../quiz-form.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { useState } from "react";

type Props = {
  externalId: string;
  isValid: boolean;
  isAnswered?: boolean;
  onValidate: () => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  nextAction?: { label: string; onClick: () => void };
};

const QuizModalButtons = ({
  externalId,
  isValid,
  isAnswered = false,
  onValidate,
  onReport,
  nextAction,
}: Props) => {
  const [isReporting, setIsReporting] = useState(false);
  const form = useForm({
    resolver: zodResolver(quizReportSchema),
    defaultValues: { comment: "" },
  });
  const [comment, setComment] = useFormField(form, "comment");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = form.handleSubmit(async ({ comment }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onReport(externalId, comment);
      setIsReporting(false);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, showFormErrors);

  if (isReporting) {
    return (
      <div className="flex flex-col gap-2 mt-4 p-3 transition-all">
        <label className="label py-0">
          <span className="label-text font-medium text-sm">
            Pourquoi cette question est-elle incorrecte ?
          </span>
        </label>
        <textarea
          className="textarea w-full text-sm bg-base-100 focus:outline-none resize-none"
          placeholder="Ex. : la question n'est pas compréhensible, la réponse attendue est incorrecte ou le sujet n'est pas abordé dans le cours."
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
              <LoaderCircle className="size-3 animate-spin" />
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
      {nextAction ? (
        <button
          className="btn btn-primary min-w-44"
          onClick={nextAction.onClick}
        >
          {nextAction.label}
        </button>
      ) : (
        !isAnswered && (
          <button
            className="btn btn-primary min-w-44"
            onClick={onValidate}
            disabled={!isValid}
          >
            Valider ma réponse
          </button>
        )
      )}
    </div>
  );
};

export default QuizModalButtons;
