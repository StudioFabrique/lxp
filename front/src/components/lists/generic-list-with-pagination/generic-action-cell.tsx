import useHttp from "../../../hooks/use-http";
import GenericAction from "./interfaces/generic-action";

type ActionCellProps = GenericAction;

const GenericActionCell = (props: ActionCellProps) => {
  const { sendRequest } = useHttp();

  switch (props.type) {
    case "button":
      return <button className="btn btn-primary">Button</button>;
    case "toggle":
      return (
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={props.state}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={props.state}
        />
      );
    default:
      return null;
  }
};

export default GenericActionCell;
