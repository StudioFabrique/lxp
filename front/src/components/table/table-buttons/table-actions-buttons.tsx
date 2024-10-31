import { RefreshCw } from "lucide-react";
import ActionsDropdown from "../../UI/actions-dropdown/actions-dropdown";

type TableButtonsProps = {
  isLoading: boolean;
  isDisabled: boolean;
  onRefreshData: () => void;
  delete: { actionTitle: string; onDelete: () => void };
};

const TableActionsButtons = (props: TableButtonsProps) => (
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
          onClick: props.delete.onDelete,
        },
      ]}
      isDisabled={props.isLoading || props.isDisabled}
    />
  </div>
);

export default TableActionsButtons;
