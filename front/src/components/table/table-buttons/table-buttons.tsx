import { RefreshCw } from "lucide-react";
import EllipsisIcon from "../../UI/svg/ellipsis-icon";

type TableButtonsProps = {
  isLoading: boolean;
  onRefreshData: () => void;
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
    <button
      disabled={props.isLoading}
      className="btn btn-sm btn-ghost disabled:bg-transparent"
    >
      <EllipsisIcon />
    </button>
  </div>
);

export default TableButtons;
