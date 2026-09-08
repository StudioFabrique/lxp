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
  } = usePagination("title", "/resources", "student-resources");
  const [searchTerm, setSearchTerm] = useState("");
  const initialRender = useRef(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleOnChangeValue = (value: string) => {
    if (!regexGeneric.test(value)) {
      setSearchError("Caractères non autorisés.");
    } else {
      setSearchError(null);
    }
    setSearchTerm(value);
  };

  const getFilteredData = useCallback(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      getFilteredData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, getFilteredData]);

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
