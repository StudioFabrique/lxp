import { Link } from "react-router-dom";
import { GenericActionType } from "./interfaces/generic-action";
import { LucideIcon } from "lucide-react";
import { ChangeEvent, MouseEvent } from "react";

type SwitchComponentProps = {
  type: GenericActionType;
  isLoading?: boolean;
  inputValue?: string;
  url?: string;
  icon?: LucideIcon;
  buttonTitle?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  onToggle?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const SwitchComponent = (props: SwitchComponentProps) => {
  switch (props.type) {
    case "button":
      return (
        <td>
          <button
            className="btn btn-primary"
            disabled={props.isLoading}
            onClick={props.onClick}
          >
            {props.buttonTitle}
            {props.icon && <props.icon />}
            {!(props.buttonTitle && props.icon) && "Button"}
          </button>
        </td>
      );
    case "link":
      return <Link to={props.url ?? "#"} />;
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

export default SwitchComponent;
