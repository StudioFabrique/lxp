import { FC } from "react";
import DeleteButton from "./buttons/delete-button";

const DataItem: FC<{
  data: any;
  propertyToFilter: string;
  properties: string[];
  onDelete: (id: string) => void;
}> = ({ data, propertyToFilter, properties, onDelete }) => {
  const handleDelete = () => {
    onDelete(data[propertyToFilter]);
  };
  return (
    <div className="flex justify-between bg-secondary-content p-2 rounded-lg w-full items-center">
      <p>{properties.map((propertie) => `${data[propertie]} `)}</p>
      <DeleteButton onDelete={handleDelete} color="red" />
    </div>
  );
};

export default DataItem;
