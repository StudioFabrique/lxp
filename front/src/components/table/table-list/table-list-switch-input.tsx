import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChangeEvent, MouseEvent } from "react";
import { TableListActionType } from "./interfaces/table-list-action";

type SwitchComponentProps = {
  type: TableListActionType;
  isLoading?: boolean;
  inputValue?: string;
  icon?: LucideIcon;
  title?: string;
  btnGhost?: boolean;
  additionnalClassname?: string;
  linkUrl: string | null;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  onToggle?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const TableListSwitchInput = (props: SwitchComponentProps) => {
  switch (props.type) {
    case "button":
      return (
        <button
          className={`btn btn-sm btn-primary ${props.additionnalClassname}`}
          disabled={props.isLoading}
          onClick={props.onClick}
        >
          {props.title}
          {props.icon && <props.icon className="w-4 h-4" />}
        </button>
      );
    case "link":
      return (
        <Link
          className={`btn btn-sm btn-primary ${props.additionnalClassname}`}
          to={props.linkUrl ?? "#"}
        >
          {props.title}
          {props.icon && <props.icon className="w-4 h-4" />}
        </Link>
      );
    case "toggle":
      return (
        <input
          type="checkbox"
          className={`mx-2 toggle toggle-sm toggle-primary ${props.additionnalClassname}`}
          disabled={props.isLoading}
          checked={Boolean(props.inputValue)}
          onChange={props.onToggle}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          className={`checkbox checkbox-sm checkbox-primary ${props.additionnalClassname}`}
          checked={Boolean(props.inputValue)}
          onChange={props.onToggle}
        />
      );
    default:
      return null;
  }
};

export default TableListSwitchInput;
