import { ChevronLeft, ChevronRight } from "lucide-react";
import DropdownSelector from "../../UI/dropdown-selector/dropdown-selector";
import { SolarAltArrowDownBold } from "../../UI/svg/alt-arrow-icon";
import iterateNumberToArray from "../../../utils/iterate-number-to-array";

export type TablePaginationProps = {
  currentPage: number | null;
  maxPage: number | null;
  itemsPerPage: number;
  onSetCurrentPage: (currentPage: number) => void;
  onSetItemsPerPage: (itemsPerPage: number) => void;
  onSetPreviousPage: () => void;
  onSetNextPage: () => void;
};

const TablePagination = (props: TablePaginationProps) => {
  if (!props.currentPage || !props.maxPage) return null;

  // Génere un tableau qui contient une liste de nombres compté jusque
  // le maximum de pages avec une incrémentation de 5
  // exemple : [1, 5, 10, 15, 16]
  const valueArray = iterateNumberToArray(props.maxPage, 5);

  return (
    <div className="flex items-center gap-10 rounded-lg justify-end w-full bg-primary p-1 text-base-100">
      <div className="flex items-center">
        <span className="text-sm font-semibold">Éléments par page:</span>
        <DropdownSelector
          onSelect={props.onSetItemsPerPage}
          valueList={[5, 10, 15]}
        >
          {props.itemsPerPage}
          <SolarAltArrowDownBold />
        </DropdownSelector>
      </div>
      <div className="join">
        <button
          onClick={props.onSetPreviousPage}
          className="join-item btn btn-sm btn-ghost"
        >
          <ChevronLeft />
        </button>
        <DropdownSelector
          onSelect={props.onSetCurrentPage}
          valueList={valueArray}
        >
          {`${props.currentPage} sur ${props.maxPage}`}
        </DropdownSelector>
        <button
          onClick={props.onSetNextPage}
          className="join-item btn btn-sm btn-ghost"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
