import { FC } from "react";
import Portal from "../Portal/portal";

const Modal: FC<{
  onLeftClick?: () => void;
  onRightClick: () => void;
  title: string;
  message: string;
  leftLabel?: string;
  rightLabel: string;
}> = (props) => {
  return (
    <>
      <Portal>
        <div className="relative left-0 top-0 w-screen h-screen opacity-80" />
        <div className="absolute modal-open z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[30rem]">
          <div className="modal-box  border border-primary">
            <h3 className="font-bold text-primary text-lg">{props.title}</h3>
            <p className="py-4">{props.message}</p>
            <div className="modal-action">
              {props.leftLabel && (
                <button
                  className="btn text-primary border-none bg-base-100"
                  onClick={props.onLeftClick}
                >
                  {props.leftLabel}
                </button>
              )}
              <button className="btn" onClick={props.onRightClick}>
                {props.rightLabel}
              </button>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
};

export default Modal;
