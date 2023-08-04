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

  const handleAddTeacher = (_id: string) => {
    console.log(_id);

    const DataToAdd = dataAvailables.filter((data) => data._id === _id);
    setData((data: any) => [...data, ...DataToAdd]);
    setDataAvailables((currentDataAvailable) =>
      currentDataAvailable.filter(
        (currentDataAvailable) => currentDataAvailable._id !== _id
      )
    );
  };

  const handleDeleteTeacher = (_id: string) => {
    setData((data) => data.filter((data) => data._id !== _id));

    setDataAvailables((currentDataAvailable) => [
      ...currentDataAvailable,
      ...data.filter((data) => data._id === _id),
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
        onAddItem={handleAddTeacher}
      />
      <DataList
        data={data}
        properties={propertiesToSearch}
        propertyToFilter={propertyToFilter}
        onDelete={handleDeleteTeacher}
      />
    </div>
  );
};

export default DataAdder;
