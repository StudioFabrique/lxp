import useHttp from "../../../hooks/use-http";
import GenericAction from "./interfaces/generic-action";

type ActionCellProps = GenericAction;

const GenericActionCell = (props: ActionCellProps) => {
  const { sendRequest, isLoading } = useHttp();

  const handleClick = () => {};

  const handleToggle = () => {};

  switch (props.type) {
    case "button":
      return (
        <button
          className="btn btn-primary"
          disabled={isLoading}
          onClick={handleClick}
        >
          Button
        </button>
      );
    case "toggle":
      return (
        <input
          type="checkbox"
          className="toggle toggle-primary"
          disabled={isLoading}
          checked={props.state}
          onChange={handleToggle}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={props.state}
          onChange={handleToggle}
        />
      );
    default:
      return null;
  }
};

export default GenericActionCell;
