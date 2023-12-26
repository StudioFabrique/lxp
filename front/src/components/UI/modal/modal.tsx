import { FC } from "react";
import LoadingIcon from "../svg/loading-icon.component";

const Modal: FC<{
  onLeftClick?: () => void;
  onRightClick: () => void;
  title: string;
  message: string;
  leftLabel?: string;
  rightLabel: string;
  isSubmitting?: boolean;
}> = (props, { isSubmitting = false }) => {
  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{props.title}</h3>
        <p className="py-4">{props.message}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <button className="btn btn-outline btn-primary">
              {props.leftLabel}
            </button>
          </form>
          <button
            className="btn btn-primary flex items-center gap-x-2"
            disabled={isSubmitting}
            onClick={props.onRightClick}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 animate-spin">
                <LoadingIcon />
              </span>
            ) : null}
            <span>{props.rightLabel}</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
