type Props = {
  title: string; // Modal title displayed in the header
  children: React.ReactNode; // Content to be displayed inside the modal body
  onConfirm: () => void; // Callback executed when user clicks the confirm button
  onCancel: () => void; // Callback executed when user clicks the cancel button
};

/**
 * Reusable Two-Button Modal Component
 *
 * This is a generic confirmation modal that displays a title, custom content,
 * and two action buttons (Cancel and Confirm). It follows the DaisyUI modal
 * pattern and is commonly used for:
 * - Delete confirmations
 * - Action confirmations that require user validation
 * - Warning dialogs before destructive operations
 *
 * The modal uses a warning style for the confirm button to indicate
 * that the action may have consequences.
 *
 * @param props.title - The title displayed at the top of the modal
 * @param props.children - React content to display in the modal body (text, forms, etc.)
 * @param props.onConfirm - Handler called when user confirms the action
 * @param props.onCancel - Handler called when user cancels or closes the modal
 * @returns JSX.Element - Reusable confirmation modal dialog
 */
export default function TwoButtonsModal(props: Props) {
  return (
    <dialog
      id="two_buttons_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        {/* Modal header with dynamic title */}
        <h3 className="font-bold text-lg">{props.title}</h3>

        {/* Modal body with custom content passed as children */}
        {props.children}

        {/* Action buttons section */}
        <div className="modal-action flex items-center gap-x-4">
          {/* Cancel button - neutral action to dismiss modal */}
          <button className="btn" onClick={props.onCancel}>
            Annuler
          </button>

          {/* Confirm button - warning style to indicate potential consequences */}
          <button className="btn btn-warning" onClick={props.onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </dialog>
  );
}
