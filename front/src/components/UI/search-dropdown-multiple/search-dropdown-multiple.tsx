import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useEffect,
  useState,
} from "react";
import { filterResult, searchResult } from "./filter";

const SearchDropdownMultiple: FC<{
  data: any[];
  /*
  propertiesToSearch :
  Les propriétés à rechercher pour la prise en compte de la recherche à multiple entrées.
  ex : ["firstname", "lastname"] : donc le champ de recherche pourra contenir Jean Dupont. 
  */
  propertiesToSearch: string[];
  propertyToFilter: string;
  placeHolder?: string;
}> = ({
  data,
  propertiesToSearch,
  propertyToFilter,
  placeHolder = "Rechercher Formateur de module",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [itemsAvailables, setItemsAvailables] = useState<any[]>([]);

  const handleFocus = () => {
    if (inputValue.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setIsOpen(false);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsOpen(true);
    setInputValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (inputValue.length > 0) {
      const dataSearchResult = searchResult(
        inputValue,
        propertiesToSearch,
        data
      );
      console.log(dataSearchResult);
      const filteredResultIdlist = filterResult(dataSearchResult);
      setItemsAvailables(
        data.filter((data) =>
          filteredResultIdlist.includes(data[propertyToFilter])
        )
      );
    }
  }, [inputValue.length]);

  return (
    <div className="flex items-center gap-x-2 w-full">
      <div className="dropdown dropdown-bottom dropdown-end flex gap-y-4 w-full">
        <input
          type="search"
          name="enteredTagValue"
          placeholder={placeHolder}
          className="input input-bordered input-sm w-full"
          onChange={handleInputChange}
          defaultValue={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-full mt-4"
          >
            {itemsAvailables.map((item: any) => (
              <li
                className="text-xs py-1 cursor-pointer"
                key={item[propertiesToSearch[0]]}
                /* onClick={() => handleSelectItem(item[getId ? getId : property])} */
              >
                <p className="font-bold">
                  {propertiesToSearch?.map((property) => item[property] + " ")}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default SearchDropdownMultiple;
