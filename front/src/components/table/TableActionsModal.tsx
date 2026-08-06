import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";

type TableActionsModalProps = {
  title?: string;
  description?: string;
  descList?: string[];
  error?: string;
  alertMessageBottom?: string;
  isOpen: boolean;
  onCancel: () => void;
};

const TableActionsModal = ({
  children,
  title,
  description,
  descList,
  error,
  alertMessageBottom,
  isOpen,
  onCancel,
}: PropsWithChildren<TableActionsModalProps>) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.body.addEventListener("keydown", handleEscape);
    return () => document.body.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  const modal = (
    <dialog
      id="modal1"
      className="modal z-[100000] bg-black/50"
      open={isOpen}
    >
      <div className="modal-box px-8 w-full">
        <div className="flex gap-x-2">
          <h3 className="font-bold pb-4 text-primary">
            {title || "Confirmation"}
          </h3>
        </div>
        <p className="text-secondary">{description}</p>
        {descList ? (
          <ul className="py-2 flex flex-col gap-1">
            {descList.map((item) => (
              <li
                key={item}
                className="pl-2 opacity-80 capitalize"
              >{`- ${item}`}</li>
            ))}
          </ul>
        ) : null}
        <p className="text-error text-sm pb-2">{alertMessageBottom}</p>
        <div className="modal-action flex justify-end overflow-hidden">
          <button
            className="btn btn-outline btn-primary btn-md"
            onClick={onCancel}
          >
            Annuler
          </button>
          {children}
        </div>
        {error && <p>{error}</p>}
      </div>
    </dialog>
  );

  return typeof document === "undefined"
    ? modal
    : createPortal(modal, document.body);
};

export default TableActionsModal;
