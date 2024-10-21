import { ChevronLeft, ChevronRight } from "lucide-react";
import Selecter from "../../UI/selecter/selecter";

export type TablePaginationProps = {
  onSetItemsPerPage: (itemsPerPage: number) => void;
};

const TablePagination = (props: TablePaginationProps) => {
  const itemsPerPageList = [
    { id: 0, value: "5" },
    { id: 1, value: "10" },
    { id: 2, value: "15" },
  ];

  const handleSetItemsPerPage = (id: number) => {
    const item = itemsPerPageList.find((item) => item.id == id);
    if (item) props.onSetItemsPerPage(+item.value);
  };

  return (
    <div className="flex items-center gap-10 rounded-lg justify-end w-full bg-primary p-1 text-base-100">
      <div className="flex items-center">
        <span>Éléments par pages:</span>
        <Selecter
          list={itemsPerPageList}
          onSelectItem={handleSetItemsPerPage}
          id={0}
          styleGhost
        />
      </div>
      <div className="join">
        <button className="join-item btn btn-sm btn-ghost">
          <ChevronLeft />
        </button>
        <button className="join-item btn btn-sm btn-ghost">1 sur 5</button>
        <button className="join-item btn btn-sm btn-ghost">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
