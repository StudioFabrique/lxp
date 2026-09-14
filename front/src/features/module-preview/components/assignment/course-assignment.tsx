import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  LoaderCircle,
  Send,
  Save,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../../components/UI/modal/modal";
import type Course from "../../../../utils/interfaces/course";
import { modulePreviewApi } from "../../api/module-preview.api";
import type {
  AssignmentFile,
  AssignmentSubmission,
} from "../../interfaces/assignment";
import {
  assignmentScoreTextClass,
  assignmentScoreTone,
} from "./assignment-score-color";

type Props = {
  course: Course;
  staff: boolean;
  onChanged: () => void | Promise<void>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function fileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

function AssignmentFileButton({
  courseId,
  kind,
  file,
}: {
  courseId: number;
  kind: "brief" | "submission";
  file: AssignmentFile;
}) {
  const [loading, setLoading] = useState(false);
  const download = async () => {
    setLoading(true);
    try {
      const blob = await modulePreviewApi.mutations.downloadAssignmentFile(
        courseId,
        kind,
        file.id,
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Impossible de télécharger ce fichier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline max-w-full justify-start"
      onClick={download}
      disabled={loading}
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="truncate">{file.originalName}</span>
      <span className="text-xs opacity-60">{fileSize(file.size)}</span>
    </button>
  );
}

function AssignmentHeader({ course }: { course: Course }) {
  const assignment = course.assignment!;
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold">Devoir</h2>
          <p className="mt-1 text-sm text-base-content/70">{course.title}</p>
        </div>
      </div>
      <div className="self-end text-end">
        <span className="block text-xs text-base-content/60">
          À rendre avant
        </span>
        <strong>{formatDate(assignment.dueAt)}</strong>
      </div>
    </div>
  );
}

function StudentAssignment({ course, onChanged }: Omit<Props, "staff">) {
  const assignment = course.assignment!;
  const submission = assignment.submissions[0];
  const [text, setText] = useState(submission?.text ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState<"draft" | "submit" | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const isSubmitted = Boolean(submission?.submittedAt);

  const save = async (submit: boolean) => {
    if (
      submit &&
      !text.trim() &&
      files.length === 0 &&
      !submission?.files.length
    ) {
      toast.error("Ajoutez un texte ou au moins un fichier.");
      return;
    }
    setSaving(submit ? "submit" : "draft");
    try {
      await modulePreviewApi.mutations.saveAssignmentSubmission(
        course.id,
        text,
        files,
        submit,
      );
      setFiles([]);
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
  };

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
              const scoreClass =
                awarded === undefined
                  ? ""
                  : assignmentScoreTextClass[
                      assignmentScoreTone(awarded, criterion.weight)
                    ];
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
              className={`text-3xl font-bold ${
                assignmentScoreTextClass[
                  assignmentScoreTone(
                    submission.grade,
                    assignment.maxScore,
                  )
                ]
              }`}
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

function StaffAssignment({ course, onChanged }: Omit<Props, "staff">) {
  const assignment = course.assignment!;
  const submitted = useMemo(
    () => assignment.submissions.filter((item) => item.submittedAt),
    [assignment.submissions],
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected =
    submitted.find((item) => item.id === selectedId) ?? submitted[0];
  const [scores, setScores] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      (submitted[0]?.criterionScores ?? []).map((score) => [
        score.criterionId,
        score.score,
      ]),
    ),
  );
  const [freeGrade, setFreeGrade] = useState<number | "">(
    submitted[0]?.grade ?? "",
  );
  const [feedback, setFeedback] = useState<string | null>(null);
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

  const grade = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await modulePreviewApi.mutations.gradeAssignmentSubmission(
        course.id,
        selected.id,
        assignment.criteria.length > 0
          ? {
              criterionScores: assignment.criteria.map((criterion) => ({
                criterionId: criterion.id,
                score: criterionScore(criterion.id),
              })),
              feedback: currentFeedback,
            }
          : { grade: Number(currentFreeGrade), feedback: currentFeedback },
      );
      toast.success("Note enregistrée");
      await onChanged();
    } catch {
      toast.error("La note n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
        <ClipboardCheck className="mx-auto h-10 w-10 text-base-content/30" />
        <h3 className="mt-3 font-bold">Aucun devoir rendu</h3>
        <p className="mt-1 text-sm text-base-content/60">
          Les remises des apprenants apparaîtront ici pour être notées.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-base-300 bg-base-100 p-3">
        <h3 className="px-2 pb-3 font-bold">Rendus ({submitted.length})</h3>
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
                className={`rounded-xl bg-base-200 p-3 text-left text-sm ${
                  selected?.id === submission.id
                    ? "ring-1 ring-base-content"
                    : "hover:bg-base-300"
                }`}
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

export default function CourseAssignmentView({
  course,
  staff,
  onChanged,
}: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["course-assignment", course.id],
    queryFn: () => modulePreviewApi.queries.getCourseAssignment(course.id),
    initialData: course.assignment ?? undefined,
  });

  if (isLoading || !data) {
    return <span className="loading loading-spinner loading-lg mx-auto" />;
  }
  const hydratedCourse = { ...course, assignment: data };
  const handleChanged = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["course-assignment", course.id],
      }),
      onChanged(),
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <AssignmentHeader course={hydratedCourse} />
      {staff ? (
        <StaffAssignment course={hydratedCourse} onChanged={handleChanged} />
      ) : (
        <StudentAssignment course={hydratedCourse} onChanged={handleChanged} />
      )}
    </div>
  );
}
