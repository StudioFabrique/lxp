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
}> = (props) => {
  const isSubmitting =
    props.isSubmitting !== undefined ? props.isSubmitting : false;

  console.log({ isSubmitting });

  return (
    <dialog id="my_modal_4" className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{props.title}</h3>
        {props.children}
        <div className="modal-action">
          {/* if there is a button, it will close the modal */}
          <button
            className="btn btn-outline btn-primary"
            onClick={props.onLeftClick}
          >
            {props.leftLabel}
          </button>
          <button
            className="btn btn-warning flex items-center gap-x-2"
            disabled={isSubmitting}
            onClick={props.onRightClick}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            <span>{props.rightLabel}</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
