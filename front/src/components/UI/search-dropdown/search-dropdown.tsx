import { FC, useEffect, useState } from "react";
import toTitleCase from "../../../utils/toTitleCase";

type Props = {
  addItem: (name: string, property: string) => void;
  filterItems: (name: string, property: string) => void;
  resetFilterItems: () => void;
  filteredItems: Array<any>;
  property: string;
  placeHolder: string;
};

const SearchDropdown: FC<Props> = ({
  addItem,
  filterItems,
  resetFilterItems,
  filteredItems,
  property,
  placeHolder,
}) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  //const btnRef = useRef<any>();

  const handleEnteredValue = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (filteredItems.length > 0) {
      /*      btnRef.current.focus({
        preventScroll: true,
      }); */
      setIsOpen(true);
    }
  }, [filteredItems]);

  /*   const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (enteredValue.length > 0) {
      filterItems(enteredValue, property);
    }
  }; */

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
    <div className="flex items-center gap-x-2 w-full">
      <div className="dropdown dropdown-bottom dropdown-end flex gap-y-4 w-full">
        <input
          type="search"
          name="enteredTagValue"
          placeholder={placeHolder}
          className="input input-bordered input-sm w-full"
          onChange={handleEnteredValue}
          defaultValue={enteredValue}
        />
        {isOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-full mt-4"
          >
            {filteredItems.map((item: any) => (
              <li
                className="text-xs py-1 cursor-pointer"
                key={item[property]}
                onClick={() => handleSelectItem(item[property])}
              >
                <p className="font-bold">{toTitleCase(item[property])}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default SearchDropdown;
