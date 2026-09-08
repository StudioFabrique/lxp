import type { PropsWithChildren } from "react";
import { Loader2, Minimize2, X } from "lucide-react";
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
  dialogAdditionalClass?: string;
  actionsClassName?: string;
  rightClassName?: string;
  closeButtonAtTop?: boolean;
};

const Modal = (props: PropsWithChildren<ModalProps>) => {
  const isSubmitting =
    props.isSubmitting !== undefined ? props.isSubmitting : false;

  return (
    <dialog
      id="my_modal_4"
      className={`modal modal-open ${props.dialogAdditionalClass}`}
    >
      <div className={`modal-box ${props.modalBoxStyle}`}>
        {props.buttonsBothTopBottom && !props.closeButtonAtTop && (
          <div className={`modal-action mb-4 ${props.actionsClassName ?? ""}`}>
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
                className={`btn flex items-center gap-x-2 ${props.rightClassName ?? "btn-warning"}`}
                disabled={isSubmitting || props.rightDisabled}
                onClick={props.onRightClick}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                <span>{props.rightLabel}</span>
              </button>
            )}
          </div>
        )}
        <div className="flex justify-between gap-5">
          <h3 className="font-bold text-lg">{props.title}</h3>
          {props.titleTooltip && (
            <QuestionMarkTooltip
              tooltipPosition="left"
              tooltipValue={props.titleTooltip}
            />
          )}
          {props.closeButtonAtTop && props.onLeftClick ? (
            <button
              type="button"
              className="btn btn-sm btn-ghost ml-auto gap-2"
              onClick={props.onLeftClick}
            >
              <X className="size-4" />
              {props.leftLabel ?? "Fermer"}
            </button>
          ) : props.onMinimizeClick ? (
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={props.onMinimizeClick}
            >
              <Minimize2 />
            </button>
          ) : null}
        </div>
        {props.children}
        {((props.onLeftClick && !props.closeButtonAtTop) ||
          props.onRightClick) && (
          <div className={`modal-action ${props.actionsClassName ?? ""}`}>
            {props.onLeftClick && !props.closeButtonAtTop && (
              <button
                className="btn btn-outline btn-primary"
                onClick={props.onLeftClick}
              >
                {props.leftLabel}
              </button>
            )}
            {props.onRightClick && (
              <button
                className={`btn flex items-center gap-x-2 ${props.rightClassName ?? "btn-warning"}`}
                disabled={isSubmitting || props.rightDisabled}
                onClick={props.onRightClick}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                <span>{props.rightLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
