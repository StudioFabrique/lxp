/**
 * Props for the ButtonButton component
 *
 * Big up to Martin ! 😉
 */

type Props = {
  /** Callback to toggle the confirmation modal visibility */
  toggleModal: () => void;
  /** Callback to toggle the metadata form visibility */
  toggleShowMetadataForm: () => void;
  /** The newly created module data; null if no module has been created yet */
  newModuleData: Record<string, unknown> | null;
};

/**
 * Button group component for module creation workflow
 *
 * This component displays two action buttons:
 * 1. "Back to module list" - Returns to the module list page
 * 2. "Attach to a parcours" - Opens the metadata form to associate the module with a parcours
 *
 * The "Attach to a parcours" button is disabled until a module has been successfully created.
 *
 * Big up to Martin ! 😉
 *
 * @param props Component props containing callbacks and module data
 * @returns JSX.Element Fragment containing two action buttons
 */
export default function ButtonButton(props: Props) {
  return (
    <>
      {/* Button to navigate back to the module list */}
      <button
        className="btn btn-secondary"
        type="button"
        onClick={props.toggleModal}
      >
        Retour à la liste des modules
      </button>

      {/* Button to open metadata form; disabled until module is created */}
      <button
        className="btn btn-info"
        disabled={!props.newModuleData}
        type="button"
        onClick={props.toggleShowMetadataForm}
      >
        Attacher à un parcours
      </button>
    </>
  );
}
