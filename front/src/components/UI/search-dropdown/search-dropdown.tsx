/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef, useState } from "react";

import toTitleCase from "../../../utils/toTitleCase";

type Props = {
  addItem: (name: string, property: string) => void;
  filterItems: (name: string, property: string) => void;
  resetFilterItems: () => void;
  filteredItems: Array<any>;
  property: string;
  placeHolder: string;
  propertiesToRender?: Array<string>;
  getId?: "_id" | "id";
};

const SearchDropdown: FC<Props> = ({
  addItem,
  filterItems,
  filteredItems,
  property,
  placeHolder,
  propertiesToRender,
  getId,
}) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEnteredValue = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (filteredItems && filteredItems.length > 0) {
      setIsOpen(true);
    }
  }, [filteredItems]);

  const handleSelectItem = (value: string) => {
    addItem(value, property);
    setIsOpen(false);
    if (inputRef) {
      inputRef.current!.focus();
      inputRef.current!.value = "";
    }
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
  }, [enteredValue, filterItems, property, getId]);

  return (
    <div className="w-full flex items-center gap-x-2">
      <div className="w-full dropdown dropdown-bottom dropdown-end flex gap-y-4">
        <input
          ref={inputRef}
          type="search"
          name="enteredTagValue"
          placeholder={placeHolder}
          className="flex-1 w-full input input-bordered input-sm focus:outline-none"
          onChange={handleEnteredValue}
          defaultValue={enteredValue}
        />
        {isOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-full mt-4 z-50"
          >
            {filteredItems.map((item: any) => (
              <li
                className="text-xs py-1 cursor-pointer"
                key={item[property]}
                onClick={() => handleSelectItem(item[getId ? getId : property])}
              >
                <p className="font-bold">
                  {propertiesToRender?.map(
                    (property) => item[property] + " "
                  ) ?? toTitleCase(item[property])}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default SearchDropdown;
