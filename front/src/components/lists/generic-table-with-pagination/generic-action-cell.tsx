import useHttp from "../../../hooks/use-http";
import GenericAction from "./interfaces/generic-action";
import SwitchComponent from "./switch-component";

type ActionCellProps = GenericAction & { id: string };

const GenericActionCell = (props: ActionCellProps) => {
  const { sendRequest, isLoading } = useHttp();

  const handleRequest = async (value?: string | boolean) => {
    const applyData = () => {
      props.onSuccessfulSubmit &&
        props.id &&
        props.onSuccessfulSubmit(props.id, value);
    };
    if (props.request)
      await sendRequest(
        { path: props.request.path.replace("[:id]", props.id ?? "") },
        applyData,
      );
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await handleRequest(event.currentTarget.value);
  };

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.checked;
    await handleRequest(value);
  };

  return (
    <div>
      {/* {props.withConfirmationModal ? (
        <DeleteModal
          isLoading={isLoading}
          onCancel={() => {}}
          onConfirm={handleClick}
        />
      ) : null} */}
      <SwitchComponent
        type={props.type}
        inputValue={props.inputValue}
        isLoading={isLoading}
        url={props.request?.path}
        icon={props.icon}
        onClick={handleClick}
        onToggle={handleToggle}
      />
    </div>
  );
};

export default GenericActionCell;
