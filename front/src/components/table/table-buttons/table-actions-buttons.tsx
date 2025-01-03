import { RefreshCw } from "lucide-react";
import ActionsDropdown from "../../UI/actions-dropdown/actions-dropdown";
import TableActionsModal from "./table-actions-modal";
import { useState } from "react";

type Action<TData> = {
  title: string;
  description: string;
  rightButtonTitle: string;
  alertMessageBottom?: string;
  data?: TData;
  onConfirm: () => Promise<void>;
};

type TableButtonsProps<TData> = {
  isLoading: boolean;
  isDisabled: boolean;
  onRefreshData: () => void;
  actions: Action<TData>[];
  retreiveItemsProperty?: keyof TData;
  onRetreiveItemsValuesByPropertyFromIdList?: (
    property: keyof TData,
  ) => string[];
};

const TableActionsButtons = <TData,>(props: TableButtonsProps<TData>) => {
  const descList =
    props.onRetreiveItemsValuesByPropertyFromIdList &&
    props.retreiveItemsProperty &&
    props.onRetreiveItemsValuesByPropertyFromIdList(
      props.retreiveItemsProperty,
    );

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<Action<TData> | null>(
    null,
  );

  const handleOpenModal = (action: Action<TData>) => {
    setCurrentAction(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAction(null);
  };

  return (
    <>
      {showModal && currentAction ? (
        <TableActionsModal
          title={currentAction.title}
          description={currentAction.description}
          alertMessageBottom={currentAction.alertMessageBottom}
          descList={descList}
          rightButtonTitle={currentAction.rightButtonTitle}
          onConfirm={currentAction.onConfirm}
          onCancel={handleCloseModal}
        />
      ) : null}
      <div className="flex items-center">
        <button
          onClick={props.onRefreshData}
          disabled={props.isLoading}
          className="btn btn-sm btn-ghost disabled:bg-transparent"
        >
          <RefreshCw />
        </button>
        <ActionsDropdown
          actions={props.actions.map((action) => ({
            actionTitle: action.title,
            data: action.data,
            onClick: () => handleOpenModal(action),
          }))}
          isDisabled={props.isLoading || props.isDisabled}
        />
      </div>
    </>
  );
};

export default TableActionsButtons;
