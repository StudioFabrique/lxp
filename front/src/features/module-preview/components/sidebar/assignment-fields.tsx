import { Eye, EyeOff, FileText, Plus, Trash2 } from "lucide-react";
import DatePicker from "../../../../components/UI/date-picker/date-picker";
import { cn } from "../../../../utils/cn";
import type {
  AssignmentFile,
  AssignmentFormValue,
} from "../../interfaces/assignment";

type Props = {
  value: AssignmentFormValue;
  existingFiles?: AssignmentFile[];
  onChange: (value: AssignmentFormValue) => void;
};

export default function AssignmentFields({
  value,
  existingFiles = [],
  onChange,
}: Props) {
  const visibleExistingFiles = existingFiles.filter(
    (file) => !value.removeFileIds.includes(file.id),
  );
  const criteriaTotal = value.criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0,
  );
  const dueDate = value.dueAt.slice(0, 10);
  const dueTime = value.dueAt.slice(11, 16);

  const patch = (next: Partial<AssignmentFormValue>) =>
    onChange({ ...value, ...next });

  const addCriterion = () => {
    patch({
      criteria: [
        ...value.criteria,
        {
          key: `${Date.now()}-${Math.random()}`,
          label: "",
          weight: 1,
        },
      ],
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-base-300 p-4">
      <label className="flex cursor-pointer items-center justify-between gap-4">
        <span>
          <span className="block font-semibold">
            Exiger la remise d’un devoir
          </span>
          <span className="block text-xs text-base-content/60">
            Le devoir devient la dernière étape obligatoire du cours.
          </span>
        </span>
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={value.required}
          onChange={(event) => patch({ required: event.target.checked })}
        />
      </label>

      {value.required && (
        <div className="flex flex-col gap-5 border-t border-base-300 pt-4">
          <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Barème *</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/60">Sur</span>
                <input
                  type="number"
                  min="0.5"
                  max="1000"
                  step="0.5"
                  className="input input-sm input-bordered w-20"
                  value={value.maxScore}
                  onChange={(event) =>
                    patch({ maxScore: Number(event.target.value) })
                  }
                />
                <span className="text-sm">points</span>
              </div>
            </label>
            <div className="grid grid-cols-[minmax(0,1fr)_8rem] items-end gap-2">
              <DatePicker
                id="assignment-due-date"
                label="Date limite de remise *"
                value={dueDate}
                placeholder="Choisir une date"
                clearable={false}
                onChange={(date) =>
                  patch({ dueAt: `${date}T${dueTime || "17:00"}` })
                }
              />
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Heure *</span>
                <input
                  type="time"
                  className="input input-sm input-bordered w-full"
                  value={dueTime || "17:00"}
                  disabled={!dueDate}
                  required
                  onChange={(event) =>
                    patch({ dueAt: `${dueDate}T${event.target.value}` })
                  }
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-base-300 pb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 ">
              <h5 className="text-sm font-semibold">Grille de critères</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline btn-primary"
                onClick={addCriterion}
              >
                <Plus className="h-4 w-4" /> Critère
              </button>
            </div>
            {value.criteria.map((criterion, index) => (
              <div
                key={criterion.key}
                className="grid grid-cols-[1fr_7rem_auto] items-center gap-2 rounded-lg border border-base-300 bg-base-100 p-2"
              >
                <input
                  className="input input-sm input-bordered min-w-0"
                  value={criterion.label}
                  placeholder="Ex. Qualité de l’argumentation"
                  aria-label={`Critère ${index + 1}`}
                  onChange={(event) =>
                    patch({
                      criteria: value.criteria.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, label: event.target.value }
                          : item,
                      ),
                    })
                  }
                />
                <label className="input input-sm input-bordered flex items-center gap-1">
                  <input
                    type="number"
                    min="0.5"
                    max={value.maxScore}
                    step="0.5"
                    className="w-full min-w-0"
                    value={criterion.weight}
                    aria-label={`Poids du critère ${index + 1}`}
                    onChange={(event) =>
                      patch({
                        criteria: value.criteria.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, weight: Number(event.target.value) }
                            : item,
                        ),
                      })
                    }
                  />
                  <span className="text-xs">pts</span>
                </label>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square text-error"
                  aria-label={`Supprimer le critère ${index + 1}`}
                  onClick={() =>
                    patch({
                      criteria: value.criteria.filter(
                        (_item, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {value.criteria.length > 0 && (
              <div
                className={cn(
                  "flex justify-end text-xs font-semibold",
                  Math.abs(criteriaTotal - value.maxScore) < 0.001
                    ? "text-success"
                    : "text-error",
                )}
              >
                Total des critères : {criteriaTotal}/{value.maxScore} points
              </div>
            )}

            {value.criteria.length > 0 && (
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-base-200 p-3">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {value.rubricVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Rendre cette grille visible aux apprenants
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={value.rubricVisible}
                  onChange={(event) =>
                    patch({ rubricVisible: event.target.checked })
                  }
                />
              </label>
            )}
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">
              Instructions de remise *
            </span>
            <textarea
              className="textarea textarea-bordered min-h-28 w-full resize-y"
              value={value.instructions}
              required
              placeholder="Précisez le travail attendu et les modalités de remise."
              onChange={(event) => patch({ instructions: event.target.value })}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Fichiers de consigne</span>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              multiple
              onChange={(event) =>
                patch({
                  files: [
                    ...value.files,
                    ...Array.from(event.target.files ?? []),
                  ],
                })
              }
            />
          </label>

          {(visibleExistingFiles.length > 0 || value.files.length > 0) && (
            <ul className="space-y-2">
              {visibleExistingFiles.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">
                    {file.originalName}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square text-error"
                    aria-label={`Retirer ${file.originalName}`}
                    onClick={() =>
                      patch({
                        removeFileIds: [...value.removeFileIds, file.id],
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              {value.files.map((file, index) => (
                <li
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-info/10 px-3 py-2 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square text-error"
                    aria-label={`Retirer ${file.name}`}
                    onClick={() =>
                      patch({
                        files: value.files.filter(
                          (_item, itemIndex) => itemIndex !== index,
                        ),
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
