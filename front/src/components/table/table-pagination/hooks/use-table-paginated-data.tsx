import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import useHttp from "../../../../hooks/use-http";

/**
 * Custom hook pour gérer la pagination des tables avec des données provenant d'une API
 * @param apiPath Chemin de l'API pour récupérer les données
 * @param apiPathSearchValue Chemin de l'API pour la recherche (optionnel)
 */
function useTablePaginatedData<TData>(
  apiEndpoint: string,
  searchOptions: { apiSearchEndpoint?: string; searchProperty?: string },
  options?: { disablePagination: boolean; disableSort: boolean },
) {
  const { sendRequest, isLoading } = useHttp();
  const isFirstRender = useRef(true);

  const [data, setData] = useState<TData[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [maxPage, setMaxPage] = useState<number | null>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortProperty, setSortProperty] = useState<string | null>(null);
  const [isAscDirection, setAscDirection] = useState<boolean>(true);

  const handleSetItemsPerPage = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  const handleSetCurrentPage = useCallback((value: number) => {
    setCurrentPage(value);
  }, []);

  const handleSetPreviousPage = useCallback(() => {
    if (!currentPage) return;
    const newValue = currentPage - 1;
    if (newValue > 0) setCurrentPage(newValue);
  }, [currentPage]);

  const handleSetNextPage = useCallback(() => {
    if (!currentPage) return;
    const newValue = currentPage + 1;
    if (maxPage && newValue <= maxPage) setCurrentPage(newValue);
  }, [currentPage, maxPage]);

  const handleSortProperty = useCallback(
    (property: string) => {
      if (property === sortProperty) {
        setAscDirection((prevDir) => !prevDir);
      } else {
        setAscDirection(true);
        setSortProperty(property);
      }
      setCurrentPage(1); // Reset to first page when sorting
    },
    [sortProperty],
  );

  const handleSubmitSearchValue = useCallback((value: string) => {
    setSearchValue(value.length > 0 ? value : null);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const applyDataPaginated = useCallback(
    ({ total, list }: { total: number; list: TData[] }) => {
      setMaxPage(Math.ceil(total / itemsPerPage));
      setTotalItems(total);
      setData(list);
    },
    [itemsPerPage],
  );

  const applyDataWithoutPagination = useCallback(
    ({ data }: { data: TData[] }) => {
      setData(data);
    },
    [],
  );

  const requestPath = useMemo(() => {
    const path =
      searchOptions.apiSearchEndpoint && searchValue
        ? `${searchOptions.apiSearchEndpoint}/${searchOptions.searchProperty}/${searchValue}`
        : apiEndpoint;

    const sortDirection = isAscDirection ? "asc" : "desc";

    return options?.disableSort
      ? path
      : `${path}/${sortProperty}/${sortDirection}${options?.disablePagination ? "" : `?page=${currentPage}&limit=${itemsPerPage}`}`;
  }, [
    apiEndpoint,
    currentPage,
    isAscDirection,
    itemsPerPage,
    options,
    searchOptions,
    searchValue,
    sortProperty,
  ]);

  const handleRequest = useCallback(async () => {
    const applyData = options?.disablePagination
      ? applyDataWithoutPagination
      : applyDataPaginated;

    await sendRequest(
      {
        path: requestPath,
      },
      applyData,
    );
  }, [
    requestPath,
    options?.disablePagination,
    applyDataPaginated,
    applyDataWithoutPagination,
    sendRequest,
  ]);

  useEffect(() => {
    if (isFirstRender.current) {
      handleRequest();
      isFirstRender.current = false;
    }
  }, [handleRequest]);

  return {
    data,
    isLoading,
    currentPage,
    maxPage,
    itemsPerPage,
    totalItems,
    sortProperty,
    isAscDirection,
    onSortProperty: handleSortProperty,
    onSetItemsPerPage: handleSetItemsPerPage,
    onSetCurrentPage: handleSetCurrentPage,
    onSetPreviousPage: handleSetPreviousPage,
    onSetNextPage: handleSetNextPage,
    onRefreshData: handleRequest,
    onSubmitSearchValue: handleSubmitSearchValue,
  };
}

export default useTablePaginatedData;
