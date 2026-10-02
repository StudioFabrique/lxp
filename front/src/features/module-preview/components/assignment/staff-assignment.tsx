import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gradingFormSchema } from "../../assignment.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { ClipboardCheck, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { modulePreviewApi } from "../../api/module-preview.api";
import type { AssignmentSubmission } from "../../interfaces/assignment";
import AssignmentLinkPreviews from "./assignment-link-previews";
import { cn } from "../../../../utils/cn";
import { type Props } from "./course-assignment.types";
import { MissingStudents } from "./missing-students";
import { formatDate } from "./course-assignment.utils";
import { AssignmentFileButton } from "./assignment-file-button";

export function StaffAssignment({
  course,
  initialSubmissionId,
  onChanged,
}: Omit<Props, "staff">) {
  const assignment = course.assignment!;
  const submitted = useMemo(
    () => assignment.submissions.filter((item) => item.submittedAt),
    [assignment.submissions],
  );
  const missingStudents = useMemo(() => {
    const submittedStudentIds = new Set(
      submitted
        .map((submission) => submission.student?.idMdb)
        .filter((id): id is string => Boolean(id)),
    );
    return (assignment.expectedStudents ?? []).filter(
      (student) => !submittedStudentIds.has(student.id),
    );
  }, [assignment.expectedStudents, submitted]);
  const initiallySelected =
    submitted.find((item) => item.id === initialSubmissionId) ?? submitted[0];
  const [selectedId, setSelectedId] = useState<number | null>(
    initiallySelected?.id ?? null,
  );
  const selected =
    submitted.find((item) => item.id === selectedId) ?? submitted[0];
  const gradingForm = useForm({
    resolver: zodResolver(
      gradingFormSchema(assignment.maxScore, assignment.criteria),
    ),
    defaultValues: {
      scores: Object.fromEntries(
        (initiallySelected?.criterionScores ?? []).map((score) => [
          score.criterionId,
          score.score,
        ]),
      ) as Record<string, number>,
      freeGrade: initiallySelected?.grade ?? ("" as number | ""),
      feedback: initiallySelected?.feedback ?? "",
    },
  });
  const [scores, setScores] = useFormField(gradingForm, "scores");
  const [freeGrade, setFreeGrade] = useFormField(gradingForm, "freeGrade");
  const [feedback, setFeedback] = useFormField(gradingForm, "feedback");
  const [saving, setSaving] = useState(false);

  const selectSubmission = (submission: AssignmentSubmission) => {
    setSelectedId(submission.id);
    setScores(
      Object.fromEntries(
        submission.criterionScores.map((score) => [
          score.criterionId,
          score.score,
        ]),
      ),
    );
    setFreeGrade(submission.grade ?? "");
    setFeedback(submission.feedback ?? "");
  };

  const criterionScore = (criterionId: number) =>
    scores[criterionId] ??
    selected?.criterionScores.find((score) => score.criterionId === criterionId)
      ?.score ??
    0;
  const computedGrade = assignment.criteria.reduce(
    (sum, criterion) => sum + criterionScore(criterion.id),
    0,
  );
  const currentFreeGrade =
    freeGrade === "" ? (selected?.grade ?? "") : freeGrade;
  const currentFeedback =
    feedback === null ? (selected?.feedback ?? "") : feedback;

  const grade = gradingForm.handleSubmit(async (values) => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      await modulePreviewApi.mutations.gradeAssignmentSubmission(
        course.id,
        selected.id,
        assignment.criteria.length > 0
          ? {
              criterionScores: assignment.criteria.map((criterion) => ({
                criterionId: criterion.id,
                score: values.scores[criterion.id] ?? 0,
              })),
              feedback: values.feedback,
            }
          : { grade: Number(values.freeGrade), feedback: values.feedback },
      );
      toast.success("Note enregistrée");
      await onChanged();
    } catch {
      toast.error("La note n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  }, showFormErrors);

  if (submitted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
        <ClipboardCheck className="mx-auto h-10 w-10 text-base-content/30" />
        <h3 className="mt-3 font-bold">Aucun devoir rendu</h3>
        <p className="mt-1 text-sm text-base-content/60">
          Les remises des apprenants apparaîtront ici pour être notées.
        </p>
        {(assignment.expectedStudents?.length ?? 0) > 0 && (
          <p className="mt-3 text-sm text-base-content/60">
            {assignment.expectedStudents?.length} travail
            {(assignment.expectedStudents?.length ?? 0) > 1 ? "s" : ""} attendu
            {(assignment.expectedStudents?.length ?? 0) > 1 ? "s" : ""}
          </p>
        )}
        <MissingStudents students={missingStudents} />
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-base-300 bg-base-100 p-3">
        <h3 className="px-2 pb-1 font-bold">Rendus ({submitted.length})</h3>
        {(assignment.expectedStudents?.length ?? 0) > 0 && (
          <p className="px-2 pb-3 text-xs text-base-content/60">
            {assignment.expectedStudents?.length} travail
            {(assignment.expectedStudents?.length ?? 0) > 1 ? "s" : ""} attendu
            {(assignment.expectedStudents?.length ?? 0) > 1 ? "s" : ""}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {submitted.map((submission) => {
            const name =
              [submission.student?.firstname, submission.student?.lastname]
                .filter(Boolean)
                .join(" ") || "Apprenant";
            return (
              <button
                key={submission.id}
                type="button"
                className={cn(
                  "rounded-xl bg-base-200 p-3 text-left text-sm",
                  selected?.id === submission.id
                    ? "ring-1 ring-base-content"
                    : "hover:bg-base-300",
                )}
                onClick={() => selectSubmission(submission)}
              >
                <span className="block font-semibold capitalize">{name}</span>
                <span className="mt-1 block text-xs text-base-content/60">
                  {formatDate(submission.submittedAt!)}
                </span>
                {submission.grade !== null && (
                  <span className="badge badge-success badge-sm mt-2">
                    {submission.grade}/{assignment.maxScore}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <MissingStudents students={missingStudents} compact />
      </aside>

      {selected && (
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
          <h3 className="font-bold">Travail remis</h3>
          {selected.text ? (
            <p className="mt-3 whitespace-pre-wrap rounded-xl bg-base-200 p-4 text-sm leading-6">
              {selected.text}
            </p>
          ) : (
            <p className="mt-3 text-sm italic text-base-content/50">
              Aucune réponse textuelle.
            </p>
          )}
          <AssignmentLinkPreviews text={selected.text ?? ""} />
          {selected.files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.files.map((file) => (
                <AssignmentFileButton
                  key={file.id}
                  courseId={course.id}
                  kind="submission"
                  file={file}
                />
              ))}
            </div>
          )}

          <div className="divider" />
          <h3 className="font-bold">Notation</h3>
          {assignment.criteria.length > 0 ? (
            <div className="mt-4 space-y-5">
              {assignment.criteria.map((criterion) => (
                <label
                  key={criterion.id}
                  className="grid grid-cols-[1fr_8rem] items-center gap-3 text-sm"
                >
                  <span className="text-end mr-10">{criterion.label}</span>
                  <span className="input input-bordered flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max={criterion.weight}
                      step="0.5"
                      className="min-w-0 grow"
                      value={criterionScore(criterion.id)}
                      onChange={(event) =>
                        setScores((current) => ({
                          ...current,
                          [criterion.id]: Number(event.target.value),
                        }))
                      }
                    />
                    <span className="text-sm">/{criterion.weight}</span>
                  </span>
                </label>
              ))}
              <p className="text-right text-lg font-bold">
                Total : {computedGrade}/{assignment.maxScore}
              </p>
            </div>
          ) : (
            <label className="mt-4 flex max-w-xs flex-col gap-2">
              <span className="text-sm font-semibold">Note</span>
              <span className="input input-bordered flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={assignment.maxScore}
                  step="0.5"
                  className="grow"
                  value={currentFreeGrade}
                  onChange={(event) => setFreeGrade(Number(event.target.value))}
                />
                <span>/{assignment.maxScore}</span>
              </span>
            </label>
          )}

          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold">Commentaire</span>
            <textarea
              className="textarea textarea-bordered min-h-24"
              value={currentFeedback}
              onChange={(event) => setFeedback(event.target.value)}
            />
          </label>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="btn btn-warning"
              disabled={
                saving ||
                (assignment.criteria.length === 0 && currentFreeGrade === "")
              }
              onClick={grade}
            >
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Enregistrer la note
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
