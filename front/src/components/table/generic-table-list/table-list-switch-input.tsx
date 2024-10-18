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
  tooltip?: string;
  btnGhost?: boolean;
  linkUrl: string | null;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  onToggle?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const TableListSwitchInput = (props: SwitchComponentProps) => {
  switch (props.type) {
    case "button":
      return (
        <td>
          <button
            className={`btn btn-sm ${props.btnGhost && "btn-ghost"} btn-primary`}
            disabled={props.isLoading}
            onClick={props.onClick}
          >
            {props.title}
            {props.icon && <props.icon className="w-5 h-5" />}
          </button>
        </td>
      );
    case "link":
      return (
        <Link to={props.linkUrl ?? "#"}>
          {props.title}
          {props.icon && <props.icon className="w-5 h-5" />}
        </Link>
      );
    case "toggle":
      return (
        <td>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            disabled={props.isLoading}
            checked={Boolean(props.inputValue)}
            onChange={props.onToggle}
          />
        </td>
      );
    case "checkbox":
      return (
        <td>
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={Boolean(props.inputValue)}
            onChange={props.onToggle}
          />
        </td>
      );
    default:
      return null;
  }
};

export default TableListSwitchInput;
