import { useState } from "react";

function useTablePaginatedData() {
  const [data, setData] = useState([
    {
      _id: "rsdgse412213",
      name: "name name",
      avatar: "",
      description: "test",
      formation: "test1234",
      nbStudents: 1,
      desc: "",
      startDate: "",
      endDate: "",
      tags: [],
    },
    {
      _id: "aadw5513awd",
      name: "name name",
      avatar: "",
      description: "test",
      formation: "test1234",
      nbStudents: 1,
      desc: "",
      startDate: "",
      endDate: "",
      tags: [],
    },
  ]);

  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [maxPage, setMaxPage] = useState<number | null>(50);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const handleSetItemsPerPage = (value: number) => {
    console.log(value);
    setItemsPerPage(value);
  };

  const handleSetCurrentPage = (value: number) => {
    setCurrentPage(value);
  };

  const handleSetPreviousPage = () => {
    if (!currentPage) return;
    const newValue = currentPage - 1;
    if (newValue > 0) setCurrentPage(newValue);
  };

  const handleSetNextPage = () => {
    if (!currentPage) return;
    const newValue = currentPage + 1;
    if (maxPage && newValue <= maxPage) setCurrentPage(newValue);
  };

  return {
    data,
    currentPage,
    maxPage,
    itemsPerPage,
    onSetItemsPerPage: handleSetItemsPerPage,
    onSetCurrentPage: handleSetCurrentPage,
    onSetPreviousPage: handleSetPreviousPage,
    onSetNextPage: handleSetNextPage,
  };
}

export default useTablePaginatedData;
