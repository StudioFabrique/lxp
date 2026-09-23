import { FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  label: string;
  small?: boolean;
  isDisabled?: boolean;
  outline?: boolean;
  loading?: boolean;
  onClickEvent?: () => void;
  type?: "button" | "submit";
};

const ButtonAdd: FC<Props> = ({
  label,
  small = false,
  isDisabled = false,
  loading = false,
  outline = false,
  onClickEvent,
  type = "button",
}) => {
  return (
    <button
      className={cn("btn btn-primary flex gap-x-2", small && "btn-sm", outline && "btn-outline")}
      disabled={isDisabled}
      onClick={onClickEvent}
      type={type}
    >
      {loading ? <div className="loading loading-spinner loading-sm" /> : null}
      {label}
    </button>
  );
};

export default ButtonAdd;
