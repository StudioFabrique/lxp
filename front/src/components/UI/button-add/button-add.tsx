import { FC } from "react";

type Props = {
  label: string;
  small?: boolean;
  isDisabled?: boolean;
  outline?: boolean;
  loading?: boolean;
  onClickEvent: () => void;
};

const ButtonAdd: FC<Props> = ({
  label,
  small = false,
  isDisabled = false,
  loading = false,
  outline = false,
  onClickEvent,
}) => {
  let style = "btn btn-primary flex gap-x-2";

  const setStyle = () => {
    if (small) {
      style += " btn-sm";
    }
    return outline ? style + " btn-outline" : style;
  };

  return (
    <button className={setStyle()} disabled={isDisabled} onClick={onClickEvent}>
      {loading ? <div className="loading loading-spinner loading-sm" /> : null}
      {label}
    </button>
  );
};

export default ButtonAdd;
