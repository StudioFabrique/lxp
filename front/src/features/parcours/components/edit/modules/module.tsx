import useNewModule from "./useNewModule";
import DuplicateModuleModal from "./duplicate-module-modal";
import ModuleHeader from "./ModuleHeader";
import ModuleGrid from "./ModuleGrid";
import ModuleForm from "./ModuleForm";
import ModuleDrawer from "./ModuleDrawer";
import Modal from "../../../../../components/UI/modal/modal";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";

type Props = {
  setModuleFormOpened: Dispatch<SetStateAction<boolean>>;
};

/**
 * Module Component - Main container for module management in a parcours
 *
 * This component orchestrates:
 * - Module display in a grid
 * - Module creation form
 * - Module duplication from other parcours
 * - Module deletion with confirmation
 *
 * All business logic is delegated to the useNewModule hook,
 * while UI is split into focused sub-components for better maintainability.
 *
 * @returns JSX.Element - The complete module management interface
 */
export default function ModuleComponent({ setModuleFormOpened }: Props) {
  const {
    currentContacts,
    currentSkills,
    register,
    errors,
    handleCancelDeletion,
    handleCancelForm,
    handleCreateNewModule,
    handleCloseDuplicateModal,
    handleCopyModule,
    handleDeleteModule,
    handleDuplicateModule,
    handleSubmit,
    handleSubmitDuplicateModule,
    handleSubmitUpdateModule,
    handleUpdateModule,
    id,
    isLoading,
    isSubmittingModule,
    sourceModules,
    mode,
    moduleToDuplicate,
    moduleToDelete,
    moduleToUpdate,
    modules,
    parcours,
    refForm,
    setCurrentContacts,
    setCurrentSkills,
    setFile,
    showDeleteModal,
    showForm,
  } = useNewModule();

  const submitFunction = useMemo(() => {
    if (mode === "create") {
      return handleSubmit;
    } else if (mode === "edit" && moduleToDuplicate) {
      return handleSubmitDuplicateModule;
    }
    return handleSubmitUpdateModule;
  }, [
    mode,
    moduleToDuplicate,
    handleSubmitUpdateModule,
    handleSubmit,
    handleSubmitDuplicateModule,
  ]);

  useEffect(() => {
    setModuleFormOpened(showForm);
  }, [setModuleFormOpened, showForm]);

  return (
    <>
      {/* Main content area */}
      <div className="flex flex-col gap-y-4">
        {/* Header with action buttons */}
        <ModuleHeader
          showForm={showForm}
          parcoursId={parcours?.id}
          onCreateNew={handleCreateNewModule}
          onAddExisting={handleDuplicateModule}
          isSubmitting={isSubmittingModule}
        />

        {/* Module grid display */}
        <ModuleGrid
          modules={modules}
          selectedModuleId={moduleToUpdate ?? undefined}
          onUpdate={handleUpdateModule}
          onDelete={showDeleteModal}
        />

        {/* Module creation form (conditional) */}
        {showForm && (
          <ModuleForm
            mode={mode}
            refForm={refForm}
            register={register}
            errors={errors}
            isLoading={isLoading}
            isSubmitting={isSubmittingModule}
            currentContacts={currentContacts ?? []}
            currentSkills={currentSkills ?? []}
            contacts={parcours?.contacts ?? []}
            skills={parcours?.bonusSkills ?? []}
            onSubmit={submitFunction}
            onCancel={handleCancelForm}
            onSetFile={setFile}
            setCurrentContacts={setCurrentContacts}
            setCurrentSkills={setCurrentSkills}
          />
        )}
      </div>

      {/* Deletion confirmation modal */}
      {moduleToDelete ? (
        <Modal
          title="Suppression du module"
          leftLabel="Annuler"
          rightLabel="Supprimer"
          onRightClick={handleDeleteModule}
          onLeftClick={handleCancelDeletion}
        >
          <>
            <p>Êtes-vous sûr de vouloir supprimer ce module ?</p>
            <p>Cette action est irréversible...</p>
          </>
        </Modal>
      ) : null}

      {/* Duplicate warning modal */}
      <DuplicateModuleModal
        onContinue={handleDuplicateModule}
        onClose={handleCloseDuplicateModal}
      />

      {/* Module selection drawer for duplication */}
      <ModuleDrawer
        sourceModules={sourceModules}
        currentParcoursId={+id!}
        onCopyModule={handleCopyModule}
      />
    </>
  );
}
