import { RefreshCw } from "lucide-react";
import ActionsDropdown from "../../UI/actions-dropdown/actions-dropdown";
import TableActionsModal from "./table-actions-modal";
import { useState } from "react";
import Group from "../../../utils/interfaces/group";

type TableButtonsProps = {
  isLoading: boolean;
  isDisabled: boolean;
  onRefreshData: () => void;
  delete: { actionTitle: string; onDelete: () => Promise<void> };
  onRetreiveItemsByPropertyFromIdList?: (property: keyof Group) => string[];
};

const TableActionsButtons = (props: TableButtonsProps) => {
  const descList =
    props.onRetreiveItemsByPropertyFromIdList &&
    props.onRetreiveItemsByPropertyFromIdList("name");

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal ? (
        <TableActionsModal
          title="Confirmation de suppression"
          description={`${descList?.length} groupes vont être supprimés :`}
          descList={descList}
          onConfirm={props.delete.onDelete}
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
          actions={[
            {
              actionTitle: props.delete.actionTitle,
              data: null,
              onClick: handleOpenModal,
            },
          ]}
          isDisabled={props.isLoading || props.isDisabled}
        />
      </div>
    </>
  );
};

export default TableActionsButtons;
