import useNewModule from "./useNewModule";
import TwoButtonsModal from "../../UI/modal/two-buttons-modal";
import DuplicateModuleModal from "./duplicate-module-modal";
import ModuleHeader from "./ModuleHeader";
import ModuleGrid from "./ModuleGrid";
import ModuleForm from "./ModuleForm";
import ModuleDrawer from "./ModuleDrawer";

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
export default function ModuleComponent() {
  const {
    id,
    showForm,
    setShowForm,
    modules,
    data,
    isLoading,
    refForm,
    handleSubmit,
    handleCancelForm,
    currentContacts,
    setCurrentContacts,
    currentSkills,
    setCurrentSkills,
    parcours,
    setFile,
    showDeleteModal,
    handleDeleteModule,
    handleCancelDeletion,
    handleDuplicateModule,
    metadataList,
    handleCopyModule,
    handleCloseDuplicateModal,
    handleUpdateModule,
    mode,
  } = useNewModule();

  return (
    <>
      {/* Main content area */}
      <div className="flex flex-col gap-y-4">
        {/* Header with action buttons */}
        <ModuleHeader
          showForm={showForm}
          onCreateNew={() => setShowForm(true)}
          onAddExisting={handleDuplicateModule}
        />

        {/* Module grid display */}
        <ModuleGrid
          modules={modules}
          onUpdate={handleUpdateModule}
          onDelete={showDeleteModal}
        />

        {/* Module creation form (conditional) */}
        {showForm && (
          <ModuleForm
            mode={mode}
            refForm={refForm}
            data={data}
            isLoading={isLoading}
            currentContacts={currentContacts ?? []}
            currentSkills={currentSkills ?? []}
            contacts={parcours?.contacts ?? []}
            skills={parcours?.bonusSkills ?? []}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            onSetFile={setFile}
            setCurrentContacts={setCurrentContacts}
            setCurrentSkills={setCurrentSkills}
          />
        )}
      </div>

      {/* Deletion confirmation modal */}
      <TwoButtonsModal
        title="Suppression du module"
        onConfirm={handleDeleteModule}
        onCancel={handleCancelDeletion}
      >
        <>
          <p>Êtes-vous sûr de vouloir supprimer ce module ?</p>
          <p>Cette action est irréversible...</p>
        </>
      </TwoButtonsModal>

      {/* Duplicate warning modal */}
      <DuplicateModuleModal
        onContinue={handleDuplicateModule}
        onClose={handleCloseDuplicateModal}
      />

      {/* Module selection drawer for duplication */}
      <ModuleDrawer
        metadataList={metadataList}
        currentParcoursId={+id!}
        onCopyModule={handleCopyModule}
      />
    </>
  );
}
