import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import Modal from "../../../components/UI/modal/modal";
import FormationForm from "./FormationForm";
import { useFormationForm } from "../hooks/useFormationForm";
import { parcoursApi } from "../../parcours/api/parcours.api";
import {
  readParcoursArchiveFormationTitle,
} from "../../parcours/helpers/read-parcours-archive-formation";
import ParcoursImportModal from "../../parcours/components/import/ParcoursImportModal";
import {
  emitOnboardingEvent,
  subscribeToOnboardingEvents,
} from "../../onboarding/onboarding-events";

type FormationModalProps = {
  formationId?: number | null;
  onClose: () => void;
};

const FormationModal = ({ formationId, onClose }: FormationModalProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pendingArchive, setPendingArchive] = useState<File>();
  const [detectedFormationTitle, setDetectedFormationTitle] = useState("");
  const archiveInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    description,
    setDescription,
    code,
    setCode,
    level,
    setLevel,
    currentTags,
    tagInput,
    setTagInput,
    isEditing,
    isPending,
    isDeleting,
    formationToEdit,
    deleteFormation,
    selectFormation,
    cancelEdit,
    handleTagSubmit,
    handleRemoveTag,
    handleSubmit,
    formationsList,
  } = useFormationForm({ onSaved: onClose });

  const { mutate: importParcours, isPending: isImporting } = useMutation({
    mutationFn: parcoursApi.mutations.importParcours,
    onSuccess: (data) => {
      toast.success(
        `La formation et le parcours « ${data.title} » ont été importés.`,
      );
      if (data.warnings.length > 0) {
        toast(
          `${data.warnings.length} fichier(s) étaient manquants lors de l'export.`,
        );
      }
      void queryClient.invalidateQueries({ queryKey: ["formations"] });
      void queryClient.invalidateQueries({ queryKey: ["formation-list"] });
      void queryClient.invalidateQueries({ queryKey: ["root-parcours"] });
      cancelEdit();
      onClose();
      navigate(`/admin/parcours/edit/${data.parcoursId}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ??
          "La formation n'a pas pu être importée.",
      );
    },
  });

  useEffect(() => {
    if (formationId) selectFormation(formationId);
  }, [formationId, selectFormation]);

  const handleClose = () => {
    if (isImporting) return;
    emitOnboardingEvent({ type: "formation_modal_cancelled" });
    cancelEdit();
    onClose();
  };

  useEffect(
    () =>
      subscribeToOnboardingEvents((event) => {
        if (event.type !== "formation_modal_close_requested") return;
        cancelEdit();
        onClose();
      }),
    [cancelEdit, onClose],
  );

  const confirmDelete = () => {
    if (!formationToEdit || formationToEdit.parcours > 0) return;
    deleteFormation(formationToEdit.id, { onSuccess: onClose });
  };

  const handleArchiveSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const archive = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!archive) return;
    if (!archive.name.toLowerCase().endsWith(".zip")) {
      toast.error("Sélectionnez une archive au format .zip.");
      return;
    }

    try {
      const formationTitle = await readParcoursArchiveFormationTitle(archive);
      setPendingArchive(archive);
      setDetectedFormationTitle(formationTitle);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "La formation n'a pas pu être importée.",
      );
    }
  };

  const closeImportModal = () => {
    if (isImporting) return;
    setPendingArchive(undefined);
    setDetectedFormationTitle("");
  };

  if (pendingArchive) {
    return (
      <ParcoursImportModal
        archive={pendingArchive}
        detectedFormationTitle={detectedFormationTitle}
        formations={formationsList}
        initialFormationChoice="create"
        showAutomaticFormationOptionInitially
        isImporting={isImporting}
        onCancel={closeImportModal}
        onImport={importParcours}
      />
    );
  }

  if (showDeleteConfirmation && formationToEdit) {
    return (
      <Modal
        title="Supprimer la formation"
        leftLabel="Annuler"
        rightLabel="Supprimer"
        isSubmitting={isDeleting}
        onLeftClick={() => setShowDeleteConfirmation(false)}
        onRightClick={confirmDelete}
      >
        <p className="py-5">
          La suppression de la formation « {formationToEdit.title} » est
          définitive.
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      title={isEditing ? "Modifier la formation" : "Créer une formation"}
      modalBoxStyle="max-w-2xl"
    >
      <FormationForm
        title={title}
        onTitle={setTitle}
        description={description}
        onDescription={setDescription}
        code={code}
        onCode={setCode}
        level={level}
        onLevel={setLevel}
        tagInput={tagInput}
        onTagInput={setTagInput}
        currentTags={currentTags}
        onTagSubmit={handleTagSubmit}
        onRemoveTag={handleRemoveTag}
        isEditing={isEditing}
        isPending={isPending || isImporting}
        isDeleting={isDeleting}
        deleteDisabled={(formationToEdit?.parcours ?? 0) > 0}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        onDelete={() => setShowDeleteConfirmation(true)}
        alternativeCreation={
          <div className="flex flex-col gap-3">
            <div className="divider my-0">ou</div>
            <input
              ref={archiveInputRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={handleArchiveSelection}
            />
            <button
              type="button"
              className="btn btn-outline btn-secondary w-full"
              disabled={isPending || isImporting}
              onClick={() => archiveInputRef.current?.click()}
            >
              {isImporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Créer depuis un parcours (.zip)
            </button>
            <p className="text-center text-xs text-base-content/60">
              La formation et toutes les données du parcours seront créées
              automatiquement depuis l’archive.
            </p>
          </div>
        }
      />
    </Modal>
  );
};

export default FormationModal;
