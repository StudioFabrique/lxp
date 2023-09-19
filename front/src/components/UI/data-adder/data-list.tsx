import { FC } from "react";
import DataItem from "./data-item";

const DataList: FC<{
  data: any[];
  properties: string[];
  propertyToFilter: string;
  onDelete: (id: string) => void;
}> = ({ data, onDelete, properties, propertyToFilter }) => {
  return (
    <div className="flex flex-col gap-y-2 mt-5">
      {data.map((data) => (
        <DataItem
          data={data}
          onDelete={onDelete}
          key={data[propertyToFilter]}
          properties={properties}
          propertyToFilter={propertyToFilter}
        />
      ))}
    </div>
  );
};

export default DataList;
