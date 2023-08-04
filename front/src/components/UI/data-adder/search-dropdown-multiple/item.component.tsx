import { FC, Ref } from "react";

const Item: FC<{
  item: any;
  propertiesToSearch: string[];
  propertyToFilter: string;
  onAddItem: (filter: any) => void;
}> = ({ item, propertiesToSearch, propertyToFilter, onAddItem }) => {
  const handleAddItem = () => {
    onAddItem(item[propertyToFilter]);
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
