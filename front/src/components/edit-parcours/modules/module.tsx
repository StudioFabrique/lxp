import ElementNotFound from "../../UI/element-not-found";
import ModulesList from "./modules-list";
import { Copy, PlusCircle } from "lucide-react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModuleMetadatas from "../../../views/module/add/module-metadatas";
import ModuleToParcours from "../../../views/module/add/module-to-parcours";
import useNewModule, { MetadataList, Metadatas } from "./useNewModule";
import TwoButtonsModal from "../../UI/modal/two-buttons-modal";
import DuplicateModuleModal from "./duplicate-module-modal";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";

/**
 * Module Component - Displays and manages modules associated with a learning path (parcours)
 *
 * This component provides functionality to:
 * - Display all modules associated with the current parcours in a responsive grid
 * - Create new modules with metadata and associations
 * - Add existing modules to the parcours
 * - Handle form display with smooth scrolling behavior
 *
 * The component includes both viewing (grid of module cards) and creation modes
 * (form with module metadata and parcours associations).
 *
 * @returns JSX.Element - The module management interface
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
  } = useNewModule();
  console.log({ metadataList });

  const placeholder = (
    <div className="flex flex-col items-center justify-center h-64">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-16 h-16 text-base-content/30 mb-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <p className="text-base-content/70 text-center">
        Aucun module disponible pour cette formation
      </p>
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-y-4">
        {/* Header section with title and action buttons */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary">
            Modules associés au Parcours
          </h1>
          <span className="flex gap-x-4 items-center">
            {/* Button to create a new module from scratch */}
            <button
              className="btn btn-primary"
              disabled={showForm} // Disable when form is already open
              onClick={() => setShowForm(true)}
            >
              <PlusCircle />
              Créer un nouveau module
            </button>
            {/* Button to add an existing module to the parcours */}
            <button className="btn btn-primary" onClick={handleDuplicateModule}>
              <Copy />
              Ajouter un module
            </button>
          </span>
        </div>

        {/* Modules display section - responsive grid layout */}
        {modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <ModulesList
                {...module}
                key={module.id}
                onDelete={showDeleteModal}
              />
            ))}
          </div>
        ) : (
          // Show message when no modules are found
          <ElementNotFound message="Aucun module trouvé" />
        )}

        {/* Module creation form - only shown when showForm is true */}
        {showForm ? (
          <>
            {/* Divider to separate content from form */}
            <div className="divider text-primary text-xs">
              Création de module
            </div>
            <Wrapper>
              <form onSubmit={handleSubmit} ref={refForm}>
                {/* Two-column layout for form sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left column: Module metadata (title, description, files) */}
                  <ModuleMetadatas data={data} onSetFile={setFile} />
                  {/* Right column: Parcours associations (contacts, skills) */}
                  <ModuleToParcours
                    currentContacts={currentContacts ?? []}
                    currentSkills={currentSkills ?? []}
                    contacts={parcours?.contacts ?? []}
                    skills={parcours?.bonusSkills ?? []}
                    isLoading={isLoading}
                    setCurrentContacts={setCurrentContacts}
                    setCurrentSkills={setCurrentSkills}
                  />
                </div>
                {/* Form action buttons */}
                <div className="flex gap-x-2 justify-end mt-4">
                  {/* Cancel button - closes form without saving */}
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={handleCancelForm}
                  >
                    Annuler
                  </button>
                  {/* Submit button - saves the new module */}
                  <button type="submit" className="btn btn-primary">
                    Enregistrer le module
                  </button>
                </div>
              </form>
            </Wrapper>
          </>
        ) : null}
      </div>
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
      <DuplicateModuleModal
        onContinue={handleDuplicateModule}
        onClose={handleCloseDuplicateModal}
      />

      <RightSideDrawer
        title="Modules associés à la formation"
        id="duplicate_module_drawer"
        visible={false}
      >
        {metadataList && metadataList.length > 0 ? (
          <ul className="list w-[40rem] gap-y-2">
            {metadataList.map((m: MetadataList) => {
              // ✅ Filtrer les metadatas pour ne garder que ceux des autres parcours
              const otherParcoursMetadatas = m.metadatas?.filter(
                (meta: Metadatas) => meta.parcours?.id !== +id!
              );

              // Si le module n'existe que dans le parcours actuel, ne pas l'afficher
              if (
                !otherParcoursMetadatas ||
                otherParcoursMetadatas.length === 0
              ) {
                return null;
              }

              return (
                <div
                  key={m.id}
                  className="collapse bg-base-100 border border-base-300"
                >
                  <input type="radio" name="my-accordion-1" />
                  <div className="collapse-title font-semibold flex flex-col gap-y-1">
                    <span>{m.title}</span>
                    <span className="font-bold text-xs text-base-content/60">
                      Utilisé dans {otherParcoursMetadatas.length} autre(s)
                      parcours.
                    </span>
                  </div>
                  <div className="collapse-content text-sm">
                    {/* ✅ Afficher uniquement les metadatas des autres parcours */}
                    {otherParcoursMetadatas.map((meta: Metadatas) => (
                      <div
                        className="grid grid-cols-[1fr_auto] gap-4 items-start"
                        key={meta.id}
                      >
                        <div>
                          <p className="font-semibold">
                            Parcours : {meta.parcours?.title ?? "Sans titre"}
                          </p>
                          <div className="text-xs text-base-content/70">
                            {meta.courses?.length ?? 0} cours sont associés au
                            module :
                            {meta.courses?.map(
                              (course: { id: number; title: string }) => (
                                <span
                                  key={course.id}
                                  className="badge badge-secondary mx-1 mb-1 font-normal text-xs"
                                >
                                  {course.title}
                                </span>
                              )
                            )}
                            {meta.courses?.length > 0 ? (
                              <div className="divider" />
                            ) : null}
                          </div>
                        </div>
                        <Copy
                          className="cursor-pointer w-6 h-6 text-primary hover:brightness-125 flex-shrink-0"
                          onClick={() => handleCopyModule(m)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </ul>
        ) : (
          <>{placeholder}</>
        )}
      </RightSideDrawer>
    </>
  );
}
