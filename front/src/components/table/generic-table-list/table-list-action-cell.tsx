import useHttp from "../../../hooks/use-http";
import TableListAction from "./interfaces/table-list-action";
import TableListSwitchInput from "./table-list-switch-input";

type TableListActionCellProps = TableListAction & { id: string };

const TableListActionCell = (props: TableListActionCellProps) => {
  const { sendRequest, isLoading } = useHttp();

  const handleRequest = async (value?: string | boolean) => {
    if (props.request) {
      const applyData = () => {
        props.onSuccessfulSubmit &&
          props.id &&
          props.onSuccessfulSubmit(props.id, value);
      };

      await sendRequest(
        { path: props.request.path.replace("[:id]", props.id ?? "") },
        applyData,
      );
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.request) {
      await handleRequest(event.currentTarget.value);
    } else if (props.onSuccessfulSubmit) {
      props.onSuccessfulSubmit(props.id, event.currentTarget.value);
    }
  };

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.checked;
    await handleRequest(value);
  };

  return (
    <>
      {/* {props.withConfirmationModal ? (
        <DeleteModal
          isLoading={isLoading}
          onCancel={() => {}}
          onConfirm={handleClick}
        />
      ) : null} */}
      <TableListSwitchInput
        type={props.type}
        inputValue={props.inputValue}
        isLoading={isLoading}
        url={props.request?.path}
        icon={props.icon}
        onClick={handleClick}
        onToggle={handleToggle}
      />
    </>
  );
};

export default TableListActionCell;
