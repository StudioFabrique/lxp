import { PropsWithChildren, useRef, useState } from "react";

type DropdownSelectorProps = {
  valueList: (string | number)[];
  emptyListMessage?: string;
  onSelect: (value: number) => void;
};

const DropdownSelector = ({
  valueList,
  emptyListMessage,
  onSelect,
  children,
}: PropsWithChildren<DropdownSelectorProps>) => {
  const [isSelecterOpened, setSelecterOpenState] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClickButton = () => {
    setSelecterOpenState(true);
  };

  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    onSelect(event.currentTarget.value);
    setSelecterOpenState(false);
  };

  return (
    <div className="dropdown dropdown-top">
      <div
        tabIndex={0}
        role="button"
        onClick={handleClickButton}
        className="rounded-none btn btn-sm btn-ghost"
      >
        {children ?? "Select a value"}
      </div>

      <ul
        tabIndex={0}
        className="menu dropdown-content bg-primary rounded-box z-[1] w-10 p-2 m-2 shadow"
        hidden={!isSelecterOpened}
        ref={dropdownRef}
      >
        {valueList.length > 0 ? (
          valueList.map((value) => (
            <li key={value} value={value} onClick={handleSelect}>
              <button className="btn btn-ghost btn-sm px-0">{value}</button>
            </li>
          ))
        ) : (
          <li>{emptyListMessage}</li>
        )}
      </ul>
    </div>
  );
};

export default DropdownSelector;
