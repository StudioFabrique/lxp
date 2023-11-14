import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { filterResult, searchResult } from "./filter";
import Item from "./item.component";

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
  transparencyOrder: "z-0" | "z-10" | "z-20" | "z-30" | "z-40" | "z-50";
  onAddItem: (filter: any) => void;
}> = ({
  data,
  propertiesToSearch,
  propertyToFilter,
  placeHolder = "Rechercher Formateur de module",
  transparencyOrder,
  onAddItem,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [itemsAvailables, setItemsAvailables] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (itemsAvailables.length > 0 && inputValue.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    const interval = setInterval(() => {
      setIsOpen(false);
      clearInterval(interval);
    }, 100);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    console.log(data);

    setInputValue(event.currentTarget.value.toLowerCase());
    if (!(inputValue.length > 1)) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (inputValue.length > 0) {
      const dataSearchResult = searchResult(
        inputValue,
        propertiesToSearch,
        data
      );

      const filteredResultIdlist = filterResult(
        dataSearchResult,
        propertyToFilter
      );

      setItemsAvailables(
        data.filter((data) =>
          filteredResultIdlist.includes(data[propertyToFilter])
        )
      );
    }
  }, [
    inputValue.length,
    data,
    inputValue,
    propertiesToSearch,
    propertyToFilter,
  ]);

  return (
    <div className={`flex items-center gap-x-2 w-full ${transparencyOrder}`}>
      <div className="dropdown dropdown-bottom dropdown-end flex gap-y-4 w-full">
        <input
          ref={inputRef}
          type="search"
          name="enteredTagValue"
          placeholder={placeHolder}
          className="input input-bordered input-sm w-full"
          onChange={handleInputChange}
          defaultValue={inputValue}
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isOpen ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-full mt-4"
          >
            {itemsAvailables.map((item: any) => (
              <Item
                item={item}
                propertyToFilter={propertyToFilter}
                onAddItem={onAddItem}
                propertiesToSearch={propertiesToSearch}
                inputRef={inputRef}
                setInputValue={setInputValue}
                key={item[propertyToFilter]}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default SearchDropdownMultiple;
