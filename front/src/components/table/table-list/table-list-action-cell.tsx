import { Fragment } from "react/jsx-runtime";
import useHttp from "../../../hooks/use-http";
import Can from "../../UI/can/can.component";
import TableListAction from "./interfaces/table-list-action";
import TableListSwitchInput from "./table-list-switch-input";
import { useState } from "react";
import TableActionsModal from "../table-buttons/table-actions-modal";

type TableListActionCellProps = TableListAction & { id: string };

const TableListActionCell = (props: TableListActionCellProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { sendRequest, isLoading } = useHttp();

  const path = props.request
    ? props.request.path.replace("[:id]", props.id ?? "")
    : null;

  const handleRequest = async (value?: string | boolean) => {
    if (path) {
      const applyData = () => {
        props.onSuccessfulSubmit &&
          props.id &&
          props.onSuccessfulSubmit(props.id, value);
      };

      await sendRequest(
        { path: path, method: props.request?.method },
        applyData,
      );
    }
  };

  const handleClick = async () => {
    if (props.request) {
      await handleRequest();
    } else if (props.onSuccessfulSubmit) {
      props.onSuccessfulSubmit(props.id);
    }
  };

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.checked;
    await handleRequest(value);
  };

  const handleToggleModal = async () => {
    setShowModal((prevState) => !prevState);
  };

  const cell = (
    <td className="px-2 w-0 gap-x-2">
      {props.modal && showModal ? (
        <TableActionsModal
          {...props.modal}
          onConfirm={handleClick}
          onCancel={handleToggleModal}
          rightButtonTitle="Confirmer"
        />
      ) : null}
      <div className="flex justify-center">
        <div className="tooltip flex" data-tip={props.tooltip}>
          {
            <TableListSwitchInput
              {...props}
              linkUrl={path}
              onClick={props.modal ? handleToggleModal : handleClick}
              onToggle={handleToggle}
              isLoading={isLoading}
            />
          }
        </div>
      </div>
    </td>
  );

  return props.rbacObject && props.rbacAction ? (
    <Can object={props.rbacObject} action={props.rbacAction} children={cell} />
  ) : (
    <Fragment children={cell} />
  );
};

export default TableListActionCell;
