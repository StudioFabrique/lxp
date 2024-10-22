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
    setSelecterOpenState((prevValue) => !prevValue);
  };

  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    onSelect(event.currentTarget.value);
    setSelecterOpenState(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setSelecterOpenState(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative">
      <button
        onClick={handleClickButton}
        className="join-item btn btn-sm btn-ghost"
      >
        {children ?? "Select a value"}
      </button>
      {
        <ul
          className="absolute bg-white border border-gray-300 mt-1 rounded shadow"
          hidden={!isSelecterOpened}
          ref={dropdownRef}
        >
          {valueList.length > 0 ? (
            valueList.map((value) => (
              <li
                key={value}
                value={value}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleSelect}
              >
                {value}
              </li>
            ))
          ) : (
            <li className="p-2 hover:bg-gray-100 cursor-pointer">
              {emptyListMessage}
            </li>
          )}
        </ul>
      }
    </div>
  );
};

export default DropdownSelector;
