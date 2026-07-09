import { useMemo } from "react";

type Props = {
  id?: string;
  title: string;
  children: React.ReactNode;
  onRightButtonClick: () => void;
  onLeftButtonClick?: () => void;
  leftLabel?: string;
  rightLabel?: string;
};

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
        <h3 className="font-bold text-lg">{props.title}</h3>
        {props.children}
        <div className="modal-action flex items-center gap-x-4">
          <button className="btn" onClick={props.onLeftButtonClick}>
            {leftLabel}
          </button>
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
