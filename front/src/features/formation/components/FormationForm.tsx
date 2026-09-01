import { Loader2, Trash2 } from "lucide-react";
import AddTag from "../../../components/UI/add-tag";
import TagsList from "../../../components/tags/TagsList";

type Props = {
  title: string;
  onTitle: (v: string) => void;
  description: string;
  onDescription: (v: string) => void;
  code: string;
  onCode: (v: string) => void;
  level: string;
  onLevel: (v: string) => void;
  tagInput: string;
  onTagInput: (v: string) => void;
  currentTags: { id: number; name: string; color: string }[];
  onTagSubmit: (e: React.FormEvent) => void;
  onRemoveTag: (id: number) => void;
  isEditing: boolean;
  isPending: boolean;
  isDeleting?: boolean;
  deleteDisabled?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const LEVELS = Array.from({ length: 8 }, (_, i) => `${i + 1}`);

const FormationForm = ({
  title, onTitle,
  description, onDescription,
  code, onCode,
  level, onLevel,
  tagInput, onTagInput,
  currentTags,
  onTagSubmit, onRemoveTag,
  isEditing, isPending, isDeleting = false, deleteDisabled = false,
  onSubmit, onCancel, onDelete,
}: Props) => (
  <div className="flex flex-col gap-y-4">
    <div
      className="flex flex-col gap-y-4"
      data-onboarding="formation-fields"
    >
      <form className="flex flex-col gap-y-4">
        <span className="flex flex-col gap-y-2">
          <label data-onboarding-label="formation-title">Formation *</label>
          <input
            data-onboarding-field="formation-title"
            className="input input-sm input-bordered focus:outline-none w-full"
            type="text"
            placeholder="Nom de la formation"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            autoComplete="off"
            disabled={isPending}
          />
        </span>
        <span className="flex flex-col gap-y-2">
          <label>Description</label>
          <textarea
            className="textarea h-26 w-full p-2"
            placeholder="Description de la formation"
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            autoComplete="off"
            disabled={isPending}
          />
        </span>
        <span className="flex flex-col gap-y-2">
          <label>RNCP</label>
          <input
            className="input input-sm input-bordered focus:outline-none w-full"
            type="text"
            placeholder="Exemple : 35357"
            value={code}
            onChange={(e) => onCode(e.target.value)}
            autoComplete="off"
            disabled={isPending}
          />
        </span>
        <span className="flex flex-col gap-y-2 w-full">
          <label data-onboarding-label="formation-level">Niveau *</label>
          <select
            data-onboarding-field="formation-level"
            className="select select-bordered focus:outline-none"
            onChange={(e) => onLevel(e.target.value)}
            value={level}
            disabled={isPending}
          >
            <option value="" disabled>
              Sélectionnez un niveau
            </option>
            {LEVELS.map((opt) => (
              <option key={opt} value={opt}>
                Niveau {opt}
              </option>
            ))}
          </select>
        </span>
      </form>

      <div
        className="flex flex-col gap-y-4"
        data-onboarding-field="formation-tags"
        data-onboarding-valid={currentTags.length > 0 ? "true" : "false"}
      >
        <AddTag
          error={false}
          tag={tagInput}
          placeholder="Exemple : artisanal, technologie, industriel"
          onChangeValue={(e) =>
            onTagInput((e as React.ChangeEvent<HTMLInputElement>).target.value)
          }
          onSubmit={onTagSubmit}
        />

        <TagsList tagsList={currentTags} onRemove={onRemoveTag} />
      </div>
    </div>

    <div className="w-full flex flex-wrap justify-between gap-4">
      <div>
        {isEditing && onDelete ? (
          <span
            className={deleteDisabled ? "tooltip tooltip-right" : undefined}
            data-tip="Suppression impossible : des parcours sont rattachés"
          >
            <button
              type="button"
              className="btn btn-outline btn-error"
              disabled={isPending || isDeleting || deleteDisabled}
              onClick={onDelete}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Supprimer la formation
            </button>
          </span>
        ) : null}
      </div>

      <div className="flex gap-x-4">
        <button
          type="button"
          className="btn btn-outline btn-primary"
          onClick={onCancel}
          disabled={isPending || isDeleting}
        >
          Annuler
        </button>
        <button
          type="button"
          data-onboarding="formation-save"
          className="btn btn-primary"
          disabled={isPending || isDeleting}
          onClick={onSubmit}
        >
          {isPending ? (
            <span className="flex items-center gap-x-2">
              <Loader2 className="animate-spin" />
              <p>Sauvegarde en cours...</p>
            </span>
          ) : (
            <span>Sauvegarder</span>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default FormationForm;
