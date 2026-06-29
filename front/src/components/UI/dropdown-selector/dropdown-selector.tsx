import { PropsWithChildren, useId } from "react";

// 1. Types plus flexibles
type DropdownSelectorProps = {
  valueList: (string | number)[];
  emptyListMessage?: string;
  onSelect: (value: string | number) => void;
};

const DropdownSelector = ({
  valueList,
  emptyListMessage = "Aucune option",
  onSelect,
  children,
}: PropsWithChildren<DropdownSelectorProps>) => {
  const id = useId();

  return (
    <div className="dropdown dropdown-top">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-sm btn-ghost text-primary-content rounded-none"
      >
        {children ?? "Select a value"}
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-secondary rounded-box z-50 p-2 mb-2 shadow-lg"
      >
        {valueList.length > 0 ? (
          valueList.map((value) => (
            <li key={`${id}-${value}`}>
              <button className="text-left" onClick={() => onSelect(value)}>
                {value}
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-400 p-2 text-sm">{emptyListMessage}</li>
        )}
      </ul>
    </div>
  );
};

export default DropdownSelector;
