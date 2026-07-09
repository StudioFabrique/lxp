import { useCallback, useEffect, useRef, useState } from "react";
import usePagination from "../../../hooks/use-pagination";
import { regexGeneric } from "../../../config/constantes";

const useStudentResources = () => {
  const {
    page,
    totalPages,
    dataList,
    setPerPage,
    setPage,
    perPage,
    handleSearch,
  } = usePagination("title", "/resources");
  const [searchTerm, setSearchTerm] = useState("");
  const initialRender = useRef(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleOnChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!regexGeneric.test(event.currentTarget.value))
      setSearchError("Caractères non autorisés.");
    setSearchTerm(event.target.value);
  };

  const getFilteredData = useCallback(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    console.log("Hello world!");
    if (initialRender.current) {
      console.log("FAUX");
      initialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      getFilteredData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, getFilteredData]);

  console.log("SEARCHTERM : ", searchTerm);

  return {
    page,
    totalPages,
    dataList,
    setPage,
    perPage,
    setPerPage,
    handleOnChangeValue,
    searchTerm,
    searchError,
  };
};
export default useStudentResources;
