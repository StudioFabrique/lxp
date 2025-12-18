import { useRef, useState } from "react";
import usePagination from "../../../hooks/use-pagination";

const useStudentResources = () => {
  const { page, totalPages, dataList, setPerPage, setPage, perPage } =
    usePagination("title", "/resources");
  const [searchTerm, setSearchTerm] = useState("");
  const tags: string[] = [];
  const initialRender = useRef(null);

  const handleOnChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return {
    page,
    totalPages,
    dataList,
    setPage,
    perPage,
    setPerPage,
  };
};
export default useStudentResources;
