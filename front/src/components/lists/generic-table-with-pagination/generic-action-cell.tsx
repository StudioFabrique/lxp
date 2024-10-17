import { Link } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { GenericAction } from "./interfaces/generic-action";

type ActionCellProps = GenericAction;

const GenericActionCell = (props: ActionCellProps) => {
  const { sendRequest, isLoading } = useHttp();

  const handleRequest = async () => {
    const applyData = () => {
      props.onSuccessfulSubmit && props.onSuccessfulSubmit(props.data);
    };
    if (props.request)
      await sendRequest({ path: props.request.path }, applyData);
  };

  const handleClick = async () => {
    await handleRequest();
  };

  const handleToggle = async () => {
    await handleRequest();
  };

  switch (props.type) {
    case "button":
      return (
        <td>
          <button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={handleClick}
          >
            Button
          </button>
        </td>
      );
    case "link":
      return <Link to={props.request?.path ?? "#"} />;
    case "toggle":
      return (
        <td>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            disabled={isLoading}
            checked={props.data.state}
            onChange={handleToggle}
          />
        </td>
      );
    case "checkbox":
      return (
        <td>
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={props.data.state}
            onChange={handleToggle}
          />
        </td>
      );
    default:
      return null;
  }
};

export default GenericActionCell;
