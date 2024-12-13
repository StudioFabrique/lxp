import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";

/**
 * Custom hook pour gérer la pagination des tables avec des données provenant d'une API
 * @param apiPath Chemin de l'API pour récupérer les données
 * @param apiPathSearchValue Chemin de l'API pour la recherche (optionnel)
 */
function useTablePaginatedData<TData>(
  apiPath: string,
  searchOptions: { apiPathSearchValue?: string; searchProperty?: string },
  options?: { disablePagination: boolean; disableSort: boolean },
) {
  const { sendRequest, isLoading } = useHttp();

  const [data, setData] = useState<TData[]>([]);

  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [maxPage, setMaxPage] = useState<number | null>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortProperty, setSortProperty] = useState<string | null>(null);
  const [isAscDirection, setAscDirection] = useState<boolean>(true);

  const handleSetItemsPerPage = (value: number) => {
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

  const handleSortProperty = (property: string) => {
    if (property === sortProperty) {
      setAscDirection((prevDir) => !prevDir);
    } else setAscDirection(true);

    setSortProperty(property);
  };

  const handleSubmitSearchValue = (value: string) => {
    setSearchValue(value.length > 0 ? value : null);
  };

  /**
   * Gère la récupération des données avec la pagination depuis l'API
   * Lance une nouvelle requête à chaque changement des paramètres
   * (numéro de page, nombre d'éléments par page, recherche)
   */
  const handleRequest = useCallback(async () => {
    const applyData = ({ total, list }: { total: number; list: TData[] }) => {
      setMaxPage(Math.ceil(total / itemsPerPage));
      setTotalItems(total);
      setData(list);
    };

    const path =
      searchOptions.apiPathSearchValue && searchValue
        ? `${searchOptions.apiPathSearchValue}/${searchOptions.searchProperty}/${searchValue}`
        : apiPath;

    const sortDirection = isAscDirection ? "asc" : "desc";

    await sendRequest(
      {
        path: options?.disablePagination
          ? ``
          : `${path}/${sortProperty}/${sortDirection}${options?.disablePagination ? "path" : `?page=${currentPage}&limit=${itemsPerPage}`}`,
      },
      applyData,
    );
  }, [
    sendRequest,
    searchOptions,
    currentPage,
    apiPath,
    itemsPerPage,
    searchValue,
    isAscDirection,
    sortProperty,
    options,
  ]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  /**
   * Réinitialise la page actuelle à 1 lorsque il n'y a plus de données
   * sur la page actuelle supérieure à 1
   */
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
