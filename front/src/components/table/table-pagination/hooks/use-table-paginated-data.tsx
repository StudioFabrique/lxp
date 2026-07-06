import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { tableQueries } from "../../table.api";

function useTablePaginatedData<TData>(
  apiEndpoint: string,
  searchOptions: { apiSearchEndpoint?: string; searchProperty?: string },
  options?: {
    disablePagination?: boolean;
    invokeErrorToast?: boolean;
    queryKeyPrefix?: string;
  },
) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortProperty, setSortProperty] = useState<string | null>("name");
  const [isAscDirection, setAscDirection] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    const stored = localStorage.getItem("itemsPerPage");
    return stored ? parseInt(stored) : 5;
  });

  const handleSetItemsPerPage = (value: number) => {
    localStorage.setItem("itemsPerPage", value.toString());
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSortProperty = (property: string) => {
    if (property === sortProperty) {
      setAscDirection((prevDir) => !prevDir);
    } else {
      setAscDirection(true);
      setSortProperty(property);
    }
  };

  const handleSubmitSearchValue = (value: string) => {
    setSearchValue(value.length > 0 ? value : null);
    setCurrentPage(1);
  };

  const { data, isLoading, isFetching, refetch } = useQuery(
    tableQueries.getPaginatedData<TData>(
      apiEndpoint,
      currentPage,
      itemsPerPage,
      sortProperty,
      isAscDirection,
      searchValue,
      searchOptions,
      options,
    ),
  );

  const totalItems = data?.total ?? 0;
  const listData = data?.list ?? [];
  const maxPage = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, maxPage]);

  return {
    data: listData,
    searchValue,
    isLoading: isLoading || isFetching,
    currentPage,
    maxPage,
    itemsPerPage,
    totalItems,
    sortProperty,
    isAscDirection,
    onSortProperty: handleSortProperty,
    onSetItemsPerPage: handleSetItemsPerPage,
    onSetCurrentPage: setCurrentPage,
    onSetPreviousPage: () => setCurrentPage((p) => Math.max(p - 1, 1)),
    onSetNextPage: () => setCurrentPage((p) => Math.min(p + 1, maxPage)),
    onRefreshData: refetch,
    onSubmitSearchValue: handleSubmitSearchValue,
  };
}

export default useTablePaginatedData;
