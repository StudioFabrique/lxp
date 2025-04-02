import { Fragment } from "react/jsx-runtime";
import useHttp from "../../../hooks/use-http";
import Can from "../../UI/can/can.component";
import TableListAction from "./interfaces/table-list-action";
import TableListSwitchInput from "./table-list-switch-input";
import { useState } from "react";
import TableActionsModal from "../table-buttons/table-actions-modal";
import toast from "react-hot-toast";

type TableListActionCellProps = TableListAction & { id: string };

const TableListActionCell = (props: TableListActionCellProps) => {
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const { sendRequest, isLoading } = useHttp(true);

  const path = props.request
    ? props.request.path.replace("[:id]", props.id ?? "")
    : null;

  const handleConfirmAction = async () => {
    setIsModalLoading(true);
    await handleRequest(true);
    setIsModalLoading(false);
    // after completed request, close the modal with onCancel
    setShowModal(false);
  };

  const handleRequest = async (value?: string | boolean) => {
    if (path) {
      const applyData = (data: { message?: string }) => {
        if (data.message) toast.success(data.message);
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

  const handleClickOpenModal = async () => {
    setShowModal(true);
  };

  const handleClickCloseModal = () => {
    setShowModal(false);
  };

  const cell = (
    <td className="px-2 w-0 gap-x-2">
      <TableActionsModal
        {...props.modal}
        isOpen={showModal}
        onCancel={handleClickCloseModal}
      >
        <button
          className={`btn btn-error btn-md text-warning ${isModalLoading && "loading"}`}
          onClick={handleConfirmAction}
        >
          Confirmer
        </button>
      </TableActionsModal>

      <div className="flex justify-center">
        <div className="tooltip flex" data-tip={props.tooltip}>
          {
            <TableListSwitchInput
              {...props}
              linkUrl={path}
              onClick={props.modal ? handleClickOpenModal : handleClick}
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
