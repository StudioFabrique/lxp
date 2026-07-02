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

  const pageValueArray = iterateNumberToArray(props.maxPage, 5);

  const isFirstPage = props.currentPage === 1;
  const isLastPage = props.currentPage === props.maxPage;
  const isSinglePage = props.maxPage === 1;

  return (
    <div className="bg-primary text-primary-content w-full rounded-lg px-4 py-2">
      <div className="flex gap-4 flex-row items-center justify-between">
        {/* Section Gauche : Texte informatif */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold opacity-90">{props.leftText}</p>
        </div>

        {/* Section Droite : Contrôles */}
        <div className="flex flex-row gap-4 sm:items-center justify-center">
          {/* Navigation (Pagination) */}
          {!isSinglePage && (
            <div className="join flex items-center justify-center">
              <button
                onClick={props.onSetPreviousPage}
                disabled={isFirstPage}
                className="join-item btn btn-sm btn-ghost text-primary-content disabled:bg-transparent disabled:text-base-100/30"
                aria-label="Page précédente"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="join-item px-2">
                <DropdownSelector
                  onSelect={props.onSetCurrentPage}
                  valueList={pageValueArray}
                >
                  {props.currentPage} / {props.maxPage}
                </DropdownSelector>
              </div>

              <button
                onClick={props.onSetNextPage}
                disabled={isLastPage}
                className="join-item btn btn-sm btn-ghost text-primary-content disabled:bg-transparent disabled:text-base-100/30"
                aria-label="Page suivante"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          {/* Sélecteur d'éléments par page */}
          <div className="flex items-center justify-center gap-2">
            <DropdownSelector
              onSelect={props.onSetItemsPerPage}
              valueList={[5, 10, 15]}
            >
              <div className="flex items-center gap-1">
                {props.itemsPerPage}
                <SolarAltArrowDownBold />
              </div>
            </DropdownSelector>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
