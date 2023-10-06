import { FC } from "react";

type Props = {
  label: string;
  small?: boolean;
  isDisabled?: boolean;
  outline?: boolean;
  onClickEvent: () => void;
};

const ButtonAdd: FC<Props> = ({
  label,
  small = false,
  isDisabled = false,
  outline = false,
  onClickEvent,
}) => {
  let style = "btn btn-primary flex gap-x-2 capitalize";

  const setStyle = () => {
    if (small) {
      style += " btn-sm";
    }
    return outline ? style + " btn-outline" : style;
  };

  return (
    <button className={setStyle()} disabled={isDisabled} onClick={onClickEvent}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {label}
    </button>
  );
};

export default ButtonAdd;
