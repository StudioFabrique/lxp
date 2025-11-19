import { useMemo } from "react";

type Props = {
  id?: string; // Optional ID for the modal dialog
  title: string; // Modal title displayed in the header
  children: React.ReactNode; // Content to be displayed inside the modal body
  onRightButtonClick: () => void; // Callback executed when user clicks the confirm button
  onLeftButtonClick?: () => void; // Callback executed when user clicks the cancel button
  leftLabel?: string; // Optional label for the left button (default: "Cancel")
  rightLabel?: string; // Optional label for the right button (default: "Confirm")
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
 * @param props.leftLabel - Optional custom label for the cancel button
 * @param props.rightLabel - Optional custom label for the confirm button
 * @returns JSX.Element - Reusable confirmation modal dialog
 */
export default function TwoButtonsModal(props: Props) {
  const id = useMemo(() => {
    return props.id ?? "two_buttons_modal";
  }, [props.id]);
  const leftLabel = useMemo(() => {
    return props.leftLabel ?? "Cancel";
  }, [props.leftLabel]);
  const rightLabel = useMemo(() => {
    return props.rightLabel ?? "Confirm";
  }, [props.rightLabel]);

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {/* Modal header with dynamic title */}
        <h3 className="font-bold text-lg">{props.title}</h3>

        {/* Modal body with custom content passed as children */}
        {props.children}

        {/* Action buttons section */}
        <div className="modal-action flex items-center gap-x-4">
          {/* Cancel button - neutral action to dismiss modal */}
          <button className="btn" onClick={props.onLeftButtonClick}>
            {leftLabel}
          </button>

          {/* Confirm button - warning style to indicate potential consequences */}
          <button
            className="btn btn-warning"
            onClick={props.onRightButtonClick}
          >
            {rightLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
