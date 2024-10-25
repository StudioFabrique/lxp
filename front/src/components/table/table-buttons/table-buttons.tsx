import { RefreshCw } from "lucide-react";
import ActionsDropdown from "../../UI/actions-dropdown/actions-dropdown";

type TableButtonsProps = {
  isLoading: boolean;
  onRefreshData: () => void;
  onDeleteUsers: () => void;
};

const TableButtons = (props: TableButtonsProps) => (
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
          actionTitle: "Supprimer les utilisateurs selectionnés",
          data: null,
          onClick: props.onDeleteUsers,
        },
      ]}
      isLoading={props.isLoading}
    />
  </div>
);

export default TableButtons;
