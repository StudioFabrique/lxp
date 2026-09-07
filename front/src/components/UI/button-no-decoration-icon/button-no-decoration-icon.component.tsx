import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
  onClickEvent: () => void;
  disabled?: boolean;
};

const ButtonNoDecorationIcon: FC<Props> = ({
  children,
  label,
  onClickEvent,
  disabled = false,
}) => {
  return (
    <button
      className="w-fit flex gap-x-1 items-center disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClickEvent}
      disabled={disabled}
      type="button"
    >
      {children}
      {label}
    </button>
  );
};

export default ButtonNoDecorationIcon;
