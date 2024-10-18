import { Link } from "react-router-dom";
import { GenericActionType } from "./interfaces/generic-action";

type SwitchComponentProps = {
  type: GenericActionType;
  isLoading?: boolean;
  inputValue?: string;
  url?: string;
  onClick?: () => Promise<void>;
  onToggle?: () => Promise<void>;
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
            Button
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
