import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, finalSubmissionSchema } from "../../assignment.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { CheckCircle2, FileText, LoaderCircle, Send, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../../components/UI/modal/modal";
import { modulePreviewApi } from "../../api/module-preview.api";
import { assignmentScoreTextClass, assignmentScoreTone } from "./assignment-score-color";
import AssignmentLinkPreviews from "./assignment-link-previews";
import { cn } from "../../../../utils/cn";
import { type Props } from "./course-assignment.types";
import { AssignmentFileButton } from "./assignment-file-button";
import { formatDate } from "./course-assignment.utils";

export function StudentAssignment({ course, onChanged }: Omit<Props, "staff">) {
  const assignment = course.assignment!;
  const submission = assignment.submissions[0];
  const submissionForm = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: { text: submission?.text ?? "", files: [] as File[] },
  });
  const [text, setText] = useFormField(submissionForm, "text");
  const [savedText, setSavedText] = useState(submission?.text ?? "");
  const [files, setFiles] = useFormField(submissionForm, "files");
  const [saving, setSaving] = useState<"draft" | "submit" | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const isSubmitted = Boolean(submission?.submittedAt);

  const save = (submit: boolean) =>
    submissionForm.handleSubmit(async (values) => {
      if (saving) return;
      if (submit) {
        const result = finalSubmissionSchema.safeParse({
          ...values,
          existingFileCount: submission?.files.length ?? 0,
        });
        if (!result.success) {
          toast.error(result.error.issues[0].message);
          return;
        }
      }
      setSaving(submit ? "submit" : "draft");
      try {
        await modulePreviewApi.mutations.saveAssignmentSubmission(
          course.id,
          values.text,
          values.files,
          submit,
        );
        setFiles([]);
        setSavedText(text);
        if (submit) setShowSubmitConfirmation(false);
        toast.success(submit ? "Devoir rendu" : "Brouillon enregistré");
        await onChanged();
      } catch {
        toast.error(
          submit
            ? "Le devoir n’a pas pu être rendu."
            : "Le brouillon n’a pas pu être enregistré.",
        );
      } finally {
        setSaving(null);
      }
    }, showFormErrors)();

  return (
    <div className="flex flex-col gap-6">
      {showSubmitConfirmation && (
        <Modal
          title="Confirmer la remise ?"
          leftLabel="Annuler"
          rightLabel="Confirmer la remise"
          rightClassName="btn-warning"
          isSubmitting={saving === "submit"}
          onLeftClick={() => {
            if (saving === null) setShowSubmitConfirmation(false);
          }}
          onRightClick={() => void save(true)}
        >
          <p className="mt-4 text-sm leading-6 text-base-content/70">
            Le devoir ne pourra plus être modifié après sa remise. Vérifiez
            votre texte et vos fichiers avant de confirmer.
          </p>
        </Modal>
      )}
      <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
        <h3 className="font-bold">Instructions</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
          {assignment.instructions}
        </p>
        {assignment.files.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {assignment.files.map((file) => (
              <AssignmentFileButton
                key={file.id}
                courseId={course.id}
                kind="brief"
                file={file}
              />
            ))}
          </div>
        )}
      </section>

      {assignment.criteria.length > 0 && (
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold">Barème d’évaluation</h3>
            <span className="badge badge-primary">
              {assignment.maxScore} points
            </span>
          </div>
          <ul className="mt-4 divide-y divide-base-300">
            {assignment.criteria.map((criterion) => {
              const awarded = submission?.criterionScores.find(
                (score) => score.criterionId === criterion.id,
              )?.score;
              const scoreClass = cn(
                awarded !== undefined &&
                  assignmentScoreTextClass[
                    assignmentScoreTone(awarded, criterion.weight)
                  ],
              );
              return (
                <li
                  key={criterion.id}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <span>{criterion.label}</span>
                  <strong className={scoreClass}>
                    {awarded !== undefined ? `${awarded}/` : ""}
                    {criterion.weight} pts
                  </strong>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold">Votre rendu</h3>
          {isSubmitted && (
            <span className="badge badge-success gap-1">
              <CheckCircle2 className="h-4 w-4" /> Rendu le{" "}
              {formatDate(submission!.submittedAt!)}
            </span>
          )}
        </div>

        <label className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-semibold">Réponse textuelle</span>
          <textarea
            className="textarea textarea-bordered min-h-48 w-full resize-y"
            placeholder="Rédigez votre réponse…"
            value={text}
            disabled={isSubmitted}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <AssignmentLinkPreviews text={savedText} />

        {!isSubmitted && (
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold">Fichiers</span>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              multiple
              onChange={(event) =>
                setFiles(Array.from(event.target.files ?? []))
              }
            />
          </label>
        )}

        {(submission?.files.length || files.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {submission?.files.map((file) => (
              <AssignmentFileButton
                key={file.id}
                courseId={course.id}
                kind="submission"
                file={file}
              />
            ))}
            {files.map((file) => (
              <span
                key={`${file.name}-${file.lastModified}`}
                className="badge badge-info gap-1"
              >
                <FileText className="h-3.5 w-3.5" /> {file.name}
              </span>
            ))}
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={saving !== null}
              onClick={() => save(false)}
            >
              {saving === "draft" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Enregistrer le brouillon
            </button>
            <button
              type="button"
              className="btn btn-warning"
              disabled={saving !== null}
              onClick={() => {
                if (
                  !text.trim() &&
                  files.length === 0 &&
                  !submission?.files.length
                ) {
                  toast.error("Ajoutez un texte ou au moins un fichier.");
                  return;
                }
                setShowSubmitConfirmation(true);
              }}
            >
              {saving === "submit" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Rendre et terminer
            </button>
          </div>
        )}

        {submission?.grade !== null && submission?.grade !== undefined && (
          <div className="mt-6 p-4 flex flex-col items-end">
            <p className="text-sm text-base-content/70">Note attribuée</p>
            <p
              className={cn(
                "text-3xl font-bold",
                assignmentScoreTextClass[
                  assignmentScoreTone(submission.grade, assignment.maxScore)
                ],
              )}
            >
              {submission.grade}/{assignment.maxScore}
            </p>
            {submission.feedback && (
              <p className="mt-3 whitespace-pre-wrap text-sm">
                {submission.feedback}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
