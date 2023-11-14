import { Dispatch, FC, RefObject, SetStateAction } from "react";

const Item: FC<{
  item: any;
  propertiesToSearch: string[];
  propertyToFilter: string;
  inputRef: RefObject<HTMLInputElement>;
  setInputValue: Dispatch<SetStateAction<string>>;
  onAddItem: (filter: any) => void;
}> = ({
  item,
  propertiesToSearch,
  propertyToFilter,
  inputRef,
  setInputValue,
  onAddItem,
}) => {
  const handleAddItem = () => {
    onAddItem(item[propertyToFilter]);
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <li className="text-xs py-1 cursor-pointer" onClick={handleAddItem}>
      <p className="font-bold">
        {propertiesToSearch?.map((property) => item[property] + " ")}
      </p>
    </li>
  );
};

export default Item;
