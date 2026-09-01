import { useEffect, useState } from "react";

import Modal from "../../../components/UI/modal/modal";
import FormationForm from "./FormationForm";
import { useFormationForm } from "../hooks/useFormationForm";

type FormationModalProps = {
  formationId?: number | null;
  onClose: () => void;
};

const FormationModal = ({ formationId, onClose }: FormationModalProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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
  } = useFormationForm({ onSaved: onClose });

  useEffect(() => {
    if (formationId) selectFormation(formationId);
  }, [formationId, selectFormation]);

  const handleClose = () => {
    cancelEdit();
    onClose();
  };

  const confirmDelete = () => {
    if (!formationToEdit || formationToEdit.parcours > 0) return;
    deleteFormation(formationToEdit.id, { onSuccess: onClose });
  };

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
        isPending={isPending}
        isDeleting={isDeleting}
        deleteDisabled={(formationToEdit?.parcours ?? 0) > 0}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        onDelete={() => setShowDeleteConfirmation(true)}
      />
    </Modal>
  );
};

export default FormationModal;
