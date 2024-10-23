import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
    console.log("test");
    console.log(event.currentTarget.value);
    onSelect(event.currentTarget.value);
    setSelecterOpenState(false);
  };

  return (
    <div className="dropdown dropdown-top">
      <button
        onClick={handleClickButton}
        className="rounded-none btn btn-sm btn-ghost"
      >
        {children ?? "Select a value"}
      </button>

      <ul
        className="menu dropdown-content bg-primary rounded-box z-[1] w-52 p-2 m-2 shadow"
        hidden={!isSelecterOpened}
        ref={dropdownRef}
      >
        {valueList.length > 0 ? (
          valueList.map((value) => (
            <li key={value} value={value} onClick={handleSelect}>
              <button>{value}</button>
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
