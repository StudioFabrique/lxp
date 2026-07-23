import type { PropsWithChildren } from "react";
import { Loader2, Minimize2 } from "lucide-react";
import QuestionMarkTooltip from "../question-mark-tooltip/question-mark-tooltip";

type ModalProps = {
  title: string;
  titleTooltip?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  onMinimizeClick?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  rightDisabled?: boolean;
  isSubmitting?: boolean;
  buttonsBothTopBottom?: boolean;
  modalBoxStyle?: string;
  sendModalBottom?: boolean;
};

const Modal = (props: PropsWithChildren<ModalProps>) => {
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
            {props.leftLabel && (
              <button
                className="btn btn-outline btn-primary"
                onClick={props.onLeftClick}
              >
                {props.leftLabel}
              </button>
            )}
            {props.onRightClick && (
              <button
                className="btn btn-warning flex items-center gap-x-2"
                disabled={isSubmitting || props.rightDisabled}
                onClick={props.onRightClick}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                <span>{props.rightLabel}</span>
              </button>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">{props.title}</h3>
          {props.titleTooltip && (
            <QuestionMarkTooltip
              tooltipPosition="left"
              tooltipValue={props.titleTooltip}
            />
          )}
          {props.onMinimizeClick && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={props.onMinimizeClick}
            >
              <Minimize2 />
            </button>
          )}
        </div>
        {props.children}
        <div className="modal-action">
          {props.onLeftClick && (
            <button
              className="btn btn-outline btn-primary"
              onClick={props.onLeftClick}
            >
              {props.leftLabel}
            </button>
          )}
          {props.onRightClick && (
            <button
              className="btn btn-warning flex items-center gap-x-2"
              disabled={isSubmitting || props.rightDisabled}
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
