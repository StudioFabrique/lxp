type Props = {
  onContinue: () => void; // Optional callback when user chooses to proceed with creation
  onClose: () => void; // Required callback when user closes the modal
};

/**
 * Duplicate Module Modal Component
 *
 * This modal appears when a user attempts to create a module with a title
 * that already exists within the same formation (learning path). It provides
 * two options to the user:
 * 1. Close the modal and modify their input
 * 2. Continue with creation (if onContinue handler is provided)
 *
 * The modal follows DaisyUI modal patterns and is designed to prevent
 * accidental duplicate module creation while still allowing intentional
 * duplicates when needed.
 *
 * @param props.onContinue - Optional callback executed when user chooses to proceed anyway
 * @param props.onClose - Required callback executed when user closes the modal
 * @returns JSX.Element - Modal dialog for handling duplicate module scenarios
 */
export default function DuplicateModuleModal(props: Props) {
  return (
    <dialog
      id="duplicate_module_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        {/* Modal title explaining the conflict */}
        <h3 className="font-bold text-lg">
          Le module existe déjà pour cette formation
        </h3>

        {/* Explanation text suggesting reuse of existing module */}
        <p className="py-4">
          Pour éviter de créer un doublon nous vous suggérons de réutiliser le
          module associé à cette formation qui existe déjà.
        </p>

        {/* Action buttons for user decision */}
        <div className="modal-action flex items-center gap-x-4">
          {/* Close button - cancels the creation process */}
          <button className="btn" onClick={props.onClose}>
            Fermer
          </button>

          {/* Continue button - proceeds with creation despite duplicate */}
          <button className="btn btn-primary" onClick={props.onContinue}>
            Continuer
          </button>
        </div>
      </div>
    </dialog>
  );
}
