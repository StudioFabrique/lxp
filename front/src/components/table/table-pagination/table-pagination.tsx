import { ChevronLeft, ChevronRight } from "lucide-react";
import DropdownSelector from "../../UI/dropdown-selector/dropdown-selector";
import { SolarAltArrowDownBold } from "../../UI/svg/alt-arrow-icon";
import iterateNumberToArray from "../../../utils/iterate-number-to-array";

export type TablePaginationProps = {
  currentPage: number | null;
  maxPage: number | null;
  itemsPerPage: number;
  leftText?: string;
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
  const pageValueArray = iterateNumberToArray(props.maxPage, 5);

  return (
    <div className="flex lg:flex-row flex-col gap-5 lg:gap-10 rounded-lg justify-between w-full bg-primary p-1 py-5 lg:py-1 text-base-100">
      <div className="flex justify-center lg:justify-start items-center lg:flex-row w-full">
        <p className="text-sm font-semibold px-4">{props.leftText}</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex items-center justify-center w-full">
          <span className="text-sm font-semibold">Éléments par page:</span>
          <DropdownSelector
            onSelect={props.onSetItemsPerPage}
            valueList={[5, 10, 15]}
          >
            {props.itemsPerPage}
            <SolarAltArrowDownBold />
          </DropdownSelector>
        </div>
        <div className="join justify-center lg:justify-end w-full">
          <button
            onClick={props.onSetPreviousPage}
            className={`join-item btn btn-sm btn-ghost ${props.currentPage === 1 && "invisible"}`}
          >
            <ChevronLeft />
          </button>
          {!(props.maxPage === 1) ? (
            <DropdownSelector
              onSelect={props.onSetCurrentPage}
              valueList={pageValueArray}
            >
              {`${props.currentPage} sur ${props.maxPage}`}
            </DropdownSelector>
          ) : null}
          <button
            onClick={props.onSetNextPage}
            className={`join-item btn btn-sm btn-ghost ${props.currentPage === props.maxPage && "invisible"}`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
