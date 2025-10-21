import { useEffect } from "react";
import ElementNotFound from "../../UI/element-not-found";
import ModulesList from "./modules-list";
import { Copy, PlusCircle } from "lucide-react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModuleMetadatas from "../../../views/module/add/module-metadatas";
import ModuleToParcours from "../../../views/module/add/module-to-parcours";
import useNewModule from "./useNewModule";

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
  } = useNewModule();

  // Handle smooth scrolling behavior when form visibility changes
  useEffect(() => {
    if (showForm) {
      // Scroll to form when it appears
      if (refForm && refForm.current) {
        refForm.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showForm, refForm]);

  return (
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
          <button className="btn btn-primary">
            <Copy />
            Ajouter un module
          </button>
        </span>
      </div>

      {/* Modules display section - responsive grid layout */}
      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <ModulesList {...module} key={module.id} />
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
          <div className="divider text-primary text-xs">Création de module</div>
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
  );
}
