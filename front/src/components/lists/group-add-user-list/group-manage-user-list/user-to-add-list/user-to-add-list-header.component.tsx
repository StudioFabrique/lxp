import { FC, MouseEvent, MouseEventHandler, useState } from "react";
import SortDownIcon from "../../../../UI/svg/sort-down-icon.component";
import SortUpIcon from "../../../../UI/svg/sort-up-icon.component";

const UserToAddListHeader: FC<{
  filters: { filterValue: string; placeholder: string }[];
  value: string;
  order: string;
  sortData: (order: string) => void;
}> = ({ filters, value, order, sortData }) => {
  const [selectedFilter, setSelectedFilter] = useState<{
    filterValue: string;
    placeholder: string;
  }>(filters[0]);

  const [isFilterSelectorOpen, setFilterSelectorState] =
    useState<boolean>(false);

  const handleClickFilterSelectorOpen = () => {
    setFilterSelectorState(true);
  };

  const handleClickFilterSelectorClose: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    const value = event.currentTarget.value;
    setSelectedFilter({
      filterValue: value,
      placeholder: filters.filter((filter) => value === filter.filterValue)[0]
        .placeholder,
    });
    sortData(selectedFilter.filterValue);
    setFilterSelectorState(false);
  };

  const handleClickOrder: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    sortData(selectedFilter.filterValue);
  };

  return (
    <div className="flex items-center justify-between px-5">
      <span className="flex gap-x-5 items-center">
        <input type="checkbox" className="checkbox checkbox-sm" />
        <p>Sélection multiple</p>
      </span>
      <div className="flex items-center">
        <p>Trier par :</p>
        <div className="flex flex-col items-center">
          <button
            onClick={handleClickFilterSelectorOpen}
            className="btn btn-ghost btn-xs capitalize"
          >
            {selectedFilter.placeholder}
          </button>
          {isFilterSelectorOpen && (
            <ul className="fixed mt-8">
              {filters
                .filter(
                  (filter) => filter.filterValue !== selectedFilter.filterValue
                )
                .map((filter) => (
                  <li key={filter.filterValue}>
                    <button
                      onClick={handleClickFilterSelectorClose}
                      type="button"
                      value={filter.filterValue}
                    >
                      {filter.placeholder}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <button
          className="btn btn-ghost btn-xs flex gap-x-5 items-center capitalize"
          onClick={handleClickOrder}
        >
          {order === "desc" ? <SortDownIcon /> : <SortUpIcon />}
        </button>
      </div>
    </div>
  );
};

export default UserToAddListHeader;
