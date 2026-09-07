import useNewModule from "./useNewModule";
import DuplicateModuleModal from "./duplicate-module-modal";
import ModuleHeader from "./ModuleHeader";
import ModuleGrid from "./ModuleGrid";
import ModuleForm from "./ModuleForm";
import ModuleDrawer from "./ModuleDrawer";
import Modal from "../../../../../components/UI/modal/modal";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AuthContext } from "../../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../../utils/helpers/user-role";

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
  const { user } = useContext(AuthContext);
  const {
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
    isSubmittingModule,
    isAssigningContacts,
    isAssigningSkills,
    highlightedModuleId,
    sourceModules,
    mode,
    moduleToDuplicate,
    moduleToDelete,
    modules,
    parcours,
    existingModuleImage,
    refForm,
    showDeleteModal,
    showForm,
    handleAssignContacts,
    handleAssignSkills,
    setModuleImageFile,
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

  useEffect(
    () => () => {
      setModuleFormOpened(false);
    },
    [setModuleFormOpened],
  );

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
          parcoursContacts={parcours?.contacts ?? []}
          parcoursSkills={parcours?.bonusSkills ?? []}
          isAssigningContacts={isAssigningContacts}
          isAssigningSkills={isAssigningSkills}
          highlightedModuleId={highlightedModuleId}
          emptyMessage={
            isTeacherUser(user) ? "Aucun module affecté" : "Aucun module trouvé"
          }
          onUpdate={handleUpdateModule}
          onDelete={showDeleteModal}
          onAssignContacts={handleAssignContacts}
          onAssignSkills={handleAssignSkills}
        />

        {showForm && (
          <Modal
            title={
              mode === "create"
                ? "Créer un module"
                : moduleToDuplicate
                  ? "Ajouter un module existant"
                  : "Modifier le module"
            }
            modalBoxStyle="max-h-[92dvh] w-11/12 max-w-6xl overflow-y-auto px-5 pt-5 pb-0 sm:px-7 sm:pt-7"
            dialogAdditionalClass="z-[70]"
          >
            <ModuleForm
              mode={mode}
              refForm={refForm}
              register={register}
              errors={errors}
              isSubmitting={isSubmittingModule}
              duplicatedSkills={
                moduleToDuplicate ? (currentSkills ?? []) : undefined
              }
              existingImage={existingModuleImage}
              onSetFile={setModuleImageFile}
              onSubmit={submitFunction}
              onCancel={handleCancelForm}
            />
          </Modal>
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
