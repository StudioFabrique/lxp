import { FC, ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  addItem: (name: string, property: string) => void;
  filterItems: (name: string, property: string) => void;
  resetFilterItems: () => void;
  filteredItems: Array<any>;
  property: string;
};

const SearchDropdown: FC<Props> = ({
  children,
  addItem,
  filterItems,
  resetFilterItems,
  filteredItems,
  property,
}) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<any>();

  const handleEnteredValue = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (filteredItems.length > 0) {
      btnRef.current.focus({
        preventScroll: true,
      });
      setIsOpen(true);
    }
  }, [filteredItems]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (enteredValue.length > 0) {
      filterItems(enteredValue, property);
    }
  };

  const handleSelectItem = (value: string) => {
    addItem(value, property);
    resetFilterItems();
    setIsOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredValue.length > 0) {
        filterItems(enteredValue, property);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredValue, filterItems, property]);

  return (
    <form className="flex items-center gap-x-2" onSubmit={submitSearch}>
      <input
        type="search"
        name="enteredTagValue"
        placeholder="Ajouter un nouveau tag"
        className="input input-bordered input-sm w-full"
        onChange={handleEnteredValue}
        defaultValue={enteredValue}
      />
      <div className="dropdown dropdown-bottom dropdown-end">
        <button
          ref={btnRef}
          className="btn btn-square btn-sm bg-primary border-none text-base-100 hover:brightness-75 hover:bg-primary"
          type="submit"
        >
          {children}
        </button>
        {isOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 w-32 shadow bg-base-100"
          >
            {filteredItems.map((item: any) => (
              <li
                className="text-xs py-1 cursor-pointer"
                key={item[property]}
                onClick={() => handleSelectItem(item[property])}
              >
                {item[property]}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </form>
  );
};

export default SearchDropdown;
