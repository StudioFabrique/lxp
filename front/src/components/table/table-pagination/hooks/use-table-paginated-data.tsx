import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";

function useTablePaginatedData<TData>(
  apiPath: string,
  apiPathSearchValue?: string,
) {
  const { sendRequest, isLoading } = useHttp();

  const [data, setData] = useState<TData[]>([]);

  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [maxPage, setMaxPage] = useState<number | null>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchValue, setSearchValue] = useState<string | null>(null);

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

  const handleSubmitSearchValue = (value: string) => {
    setSearchValue(value.length > 0 ? value : null);
  };

  const handleRequest = useCallback(async () => {
    const applyData = ({ total, list }: { total: number; list: TData[] }) => {
      setMaxPage(Math.ceil(total / itemsPerPage));
      setData(list);
    };

    const path =
      apiPathSearchValue && searchValue
        ? `${apiPathSearchValue}/name/${searchValue}`
        : apiPath;

    await sendRequest(
      { path: `${path}/name/asc?page=${currentPage}&limit=${itemsPerPage}` },
      applyData,
    );
  }, [
    sendRequest,
    currentPage,
    apiPath,
    itemsPerPage,
    apiPathSearchValue,
    searchValue,
  ]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  useEffect(() => {
    if (currentPage && currentPage > 1 && !(data.length > 0)) {
      setCurrentPage(1);
    }
  }, [currentPage, data.length]);

  return {
    data,
    isLoading,
    currentPage,
    maxPage,
    itemsPerPage,
    onSetItemsPerPage: handleSetItemsPerPage,
    onSetCurrentPage: handleSetCurrentPage,
    onSetPreviousPage: handleSetPreviousPage,
    onSetNextPage: handleSetNextPage,
    onRefreshData: handleRequest,
    onSubmitSearchValue: handleSubmitSearchValue,
  };
}

export default useTablePaginatedData;
