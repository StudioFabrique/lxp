import { ChevronLeft, ChevronRight } from "lucide-react";
import DropdownSelector from "../../UI/dropdown-selector/dropdown-selector";
import { SolarAltArrowDownBold } from "../../UI/svg/alt-arrow-icon";

export type TablePaginationProps = {
  page: number;
  maxPage: number;
  itemsPerPage: number;
  onSetItemsPerPage: (itemsPerPage: number) => void;
};

const TablePagination = (props: TablePaginationProps) => {
  const handleSetItemsPerPage = (value: string) => {
    if (value) props.onSetItemsPerPage(+value);
  };

  // add a const with generated number list of page with a interval of 5 from the max page value
  // example : [1,5, 10]

  return (
    <div className="flex items-center gap-10 rounded-lg justify-end w-full bg-primary p-1 text-base-100">
      <div className="flex items-center">
        <span className="text-sm font-semibold">Éléments par pages:</span>
        <DropdownSelector valueList={[5, 10, 15]}>
          {props.itemsPerPage}
          <SolarAltArrowDownBold />
        </DropdownSelector>
      </div>
      <div className="join">
        <button className="join-item btn btn-sm btn-ghost">
          <ChevronLeft />
        </button>
        <DropdownSelector valueList={[1]}>
          {`${props.page} sur ${props.maxPage}`}
        </DropdownSelector>
        <button className="join-item btn btn-sm btn-ghost">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
