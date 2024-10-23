import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";

function useTablePaginatedData<TData>(apiPath: string) {
  const { sendRequest, isLoading } = useHttp();

  const [data, setData] = useState<TData[]>([]);

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

  const handleRequest = useCallback(async () => {
    const applyData = (data: { list: TData[] }) => {
      console.log(data);
      setData(data.list);
    };

    await sendRequest(
      { path: `${apiPath}/?page=${currentPage}&limit=${itemsPerPage}` },
      applyData,
    );
  }, [sendRequest, currentPage, apiPath, itemsPerPage]);

  const refreshData = async () => {
    await handleRequest();
  };

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

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
    onRefreshData: refreshData,
  };
}

export default useTablePaginatedData;
