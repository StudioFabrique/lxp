import { useState } from "react";
import { PlusCircle } from "lucide-react";

import Modal from "../../../../components/UI/modal/modal";

type FormationItem = {
  id: number;
  title: string;
};

export type ImportFormationChoice = number | "create" | undefined;

type ParcoursImportPayload = {
  archive: File;
  formationId?: number;
  createFormation: boolean;
  publishCourses: boolean;
};

type Props = {
  archive: File;
  detectedFormationTitle: string;
  formations: FormationItem[];
  initialFormationChoice?: ImportFormationChoice;
  showAutomaticFormationOptionInitially?: boolean;
  isImporting: boolean;
  onCancel: () => void;
  onImport: (payload: ParcoursImportPayload) => void;
};

const ParcoursImportModal = ({
  archive,
  detectedFormationTitle,
  formations,
  initialFormationChoice,
  showAutomaticFormationOptionInitially = false,
  isImporting,
  onCancel,
  onImport,
}: Props) => {
  const [formationChoice, setFormationChoice] =
    useState<ImportFormationChoice>(initialFormationChoice);
  const [showAutomaticFormationOption, setShowAutomaticFormationOption] =
    useState(showAutomaticFormationOptionInitially);
  const [publishCourses, setPublishCourses] = useState(false);

  const handleImport = () => {
    onImport({
      archive,
      formationId:
        typeof formationChoice === "number" ? formationChoice : undefined,
      createFormation: formationChoice === "create",
      publishCourses,
    });
  };

  return (
    <Modal
      title="Importer un parcours"
      leftLabel="Annuler"
      rightLabel="Importer le parcours"
      onLeftClick={onCancel}
      onRightClick={handleImport}
      isSubmitting={isImporting}
      rightDisabled={formationChoice === undefined}
      modalBoxStyle="w-11/12 max-w-2xl"
    >
      <div className="mt-6 flex flex-col gap-5">
        <p className="text-sm text-base-content/70">
          Archive sélectionnée : {archive.name}
        </p>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-base-300 p-4">
          <span>
            <span className="block text-sm font-semibold">
              Publier tous les cours
            </span>
            <span className="mt-1 block text-xs text-base-content/60">
              Les cours importés seront immédiatement publiés.
            </span>
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={publishCourses}
            onChange={(event) =>
              setPublishCourses(event.currentTarget.checked)
            }
          />
        </label>
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              className="text-sm font-semibold"
              htmlFor="import-formation"
            >
              Formation de destination
            </label>
            <button
              type="button"
              className="btn btn-sm btn-primary btn-soft"
              aria-pressed={formationChoice === "create"}
              onClick={() => {
                setShowAutomaticFormationOption(true);
                setFormationChoice("create");
              }}
            >
              <PlusCircle className="size-4" />
              Créer une formation
            </button>
          </div>
          <select
            id="import-formation"
            className="select select-primary w-full border border-neutral/50 focus:outline-none"
            value={formationChoice ?? ""}
            onChange={(event) => {
              if (event.currentTarget.value === "create") {
                setFormationChoice("create");
                return;
              }
              const value = Number(event.currentTarget.value);
              setFormationChoice(value > 0 ? value : undefined);
            }}
          >
            <option value="">Sélectionner une formation</option>
            {showAutomaticFormationOption ? (
              <option value="create">
                Créer automatiquement « {detectedFormationTitle} »
              </option>
            ) : null}
            {formations.map((formation) => (
              <option key={formation.id} value={formation.id}>
                {formation.title}
              </option>
            ))}
          </select>
          {formationChoice === "create" ? (
            <p className="mt-2 text-xs text-base-content/60">
              Le nom, les informations et les tags de la formation seront
              repris automatiquement depuis l’archive. Si le nom existe déjà,
              il sera numéroté automatiquement.
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default ParcoursImportModal;
