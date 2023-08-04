import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import SearchDropdownMultiple from "./search-dropdown-multiple/search-dropdown-multiple";
import DataList from "./data-list.component";

const DataAdder: FC<{
  data: any[];
  setData: Dispatch<SetStateAction<any[]>>;
  resetFilter: boolean;
  setResetFilter: Dispatch<SetStateAction<boolean>>;
  dataFromDb: any[];
  propertiesToSearch: string[];
  propertyToFilter: string;
  title: string;
  searchInputPlaceholder: string;
  transparencyOrder: "z-0" | "z-10" | "z-20" | "z-30" | "z-40" | "z-50";
}> = ({
  data,
  setData,
  resetFilter,
  setResetFilter,
  dataFromDb,
  propertiesToSearch,
  propertyToFilter,
  title,
  searchInputPlaceholder = "",
  transparencyOrder,
}) => {
  const [dataAvailables, setDataAvailables] = useState<any[]>(dataFromDb);

  const handleAddData = (id: any) => {
    console.log(id);
    const DataToAdd = dataAvailables.filter(
      (data) => data[propertyToFilter] === id
    );
    setData((data: any) => [...data, ...DataToAdd]);
    setDataAvailables((currentDataAvailable) =>
      currentDataAvailable.filter(
        (currentDataAvailable) => currentDataAvailable[propertyToFilter] !== id
      )
    );
  };

  const handleDeleteData = (id: any) => {
    setData((data) => data.filter((data) => data[propertyToFilter] !== id));

    setDataAvailables((currentDataAvailable) => [
      ...currentDataAvailable,
      ...data.filter((data) => data[propertyToFilter] === id),
    ]);
  };

  useEffect(() => {
    if (resetFilter) {
      setDataAvailables(data.filter((data: any) => !data.includes(data)));
      setResetFilter(false);
    }
  }, [resetFilter, setResetFilter]);

  return (
    <div className="flex flex-col">
      <label>{title}</label>
      <SearchDropdownMultiple
        propertyToFilter={propertyToFilter}
        data={dataAvailables}
        propertiesToSearch={propertiesToSearch}
        placeHolder={searchInputPlaceholder}
        transparencyOrder={transparencyOrder}
        onAddItem={handleAddData}
      />
      <DataList
        data={data}
        properties={propertiesToSearch}
        propertyToFilter={propertyToFilter}
        onDelete={handleDeleteData}
      />
    </div>
  );
};

export default DataAdder;
