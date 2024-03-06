import { FC, ReactNode } from "react";
import { Loader2 } from "lucide-react";

const Modal: FC<{
  onLeftClick?: () => void;
  onRightClick: () => void;
  title: string;
  children: ReactNode;
  leftLabel?: string;
  rightLabel: string;
  isSubmitting?: boolean;
  buttonsBothTopBottom?: boolean;
  modalBoxStyle?: string;
  sendModalBottom?: boolean; // send a modal at z-index 0, useful when a drawer come at the top at the same time
}> = (props) => {
  const isSubmitting =
    props.isSubmitting !== undefined ? props.isSubmitting : false;

  return (
    <dialog
      id="my_modal_4"
      className={`modal modal-open ${props.sendModalBottom && "z-0"}`}
    >
      <div className={`modal-box ${props.modalBoxStyle}`}>
        {props.buttonsBothTopBottom && (
          <div className="modal-action mb-4">
            {/* if there is a button, it will close the modal */}
            {props.leftLabel && (
              <button
                className="btn btn-outline btn-primary"
                onClick={props.onLeftClick}
              >
                {props.leftLabel}
              </button>
            )}
            {props.rightLabel && (
              <button
                className="btn btn-warning flex items-center gap-x-2"
                disabled={isSubmitting}
                onClick={props.onRightClick}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                <span>{props.rightLabel}</span>
              </button>
            )}
          </div>
        )}
        <h3 className="font-bold text-lg">{props.title}</h3>
        {props.children}
        <div className="modal-action">
          {/* if there is a button, it will close the modal */}
          {props.leftLabel && (
            <button
              className="btn btn-outline btn-primary"
              onClick={props.onLeftClick}
            >
              {props.leftLabel}
            </button>
          )}
          {props.rightLabel && (
            <button
              className="btn btn-warning flex items-center gap-x-2"
              disabled={isSubmitting}
              onClick={props.onRightClick}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              <span>{props.rightLabel}</span>
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
