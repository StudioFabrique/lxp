import { FC, useEffect, useRef, useState } from "react";

const SearchDropdown: FC<{
  addItem: (name: string, property: string) => void;
  filterItems: (name: string, property: string) => void;
  resetFilterItems: () => void;
  filteredItems: Array<any>;
  property: string;
}> = ({ addItem, filterItems, resetFilterItems, filteredItems, property }) => {
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
          className="btn btn-square btn-sm bg-primary border-none text-base-100"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 w-32 shadow bg-base-100"
          >
            {filteredItems.map((item: any) => (
              <li
                className="text-xs py-1"
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
