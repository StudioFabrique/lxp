import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
  onClickEvent: () => void;
};

const ButtonNoDecorationIcon: FC<Props> = ({
  children,
  label,
  onClickEvent,
}) => {
  return (
    <button className="w-fit flex gap-x-1 items-center" onClick={onClickEvent}>
      {children}
      {label}
    </button>
  );
};

export default ButtonNoDecorationIcon;
