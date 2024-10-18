import useHttp from "../../../hooks/use-http";
import GenericAction from "./interfaces/generic-action";
import SwitchComponent from "./switch-component";

type ActionCellProps = GenericAction;

const GenericActionCell = (props: ActionCellProps) => {
  const { sendRequest, isLoading } = useHttp();

  const handleRequest = async () => {
    const applyData = () => {
      props.onSuccessfulSubmit &&
        props.id &&
        props.onSuccessfulSubmit(props.id, props.data);
    };
    if (props.request)
      await sendRequest(
        { path: props.request.path.replace("[:id]", props.id ?? "") },
        applyData,
      );
  };

  const handleClick = async () => {
    await handleRequest();
  };

  const handleToggle = async () => {
    await handleRequest();
  };

  return (
    <div>
      {/*  */}
      <SwitchComponent
        type={props.type}
        inputValue={props.inputValue}
        onClick={handleClick}
        onToggle={handleToggle}
        isLoading={isLoading}
        url={props.request?.path}
      />
    </div>
  );
};

export default GenericActionCell;
