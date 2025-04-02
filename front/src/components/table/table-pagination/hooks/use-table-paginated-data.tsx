import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";

/**
 * Custom hook pour gérer la pagination des tables avec des données provenant d'une API
 * @param apiPath Chemin de l'API pour récupérer les données
 * @param apiPathSearchValue Chemin de l'API pour la recherche (optionnel)
 */
function useTablePaginatedData<TData>(
  apiEndpoint: string,
  searchOptions: { apiSearchEndpoint?: string; searchProperty?: string },
  options?: {
    apiDataPropertyToRetreive?: string;
    disablePagination: boolean;
    disableSort: boolean;
    invokeErrorToast?: boolean;
  },
) {
  const { sendRequest, isLoading } = useHttp(options?.invokeErrorToast);

  const [data, setData] = useState<TData[]>([]);

  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [maxPage, setMaxPage] = useState<number | null>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    const stored = localStorage.getItem("itemsPerPage");
    return stored ? parseInt(stored) : 5;
  });
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortProperty, setSortProperty] = useState<string | null>(null);
  const [isAscDirection, setAscDirection] = useState<boolean>(true);

  const handleSetItemsPerPage = (value: number) => {
    localStorage.setItem("itemsPerPage", value.toString());
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
    const applyDataPaginated = ({
      total,
      list,
    }: {
      total: number;
      list: TData[];
    }) => {
      setMaxPage(Math.ceil(total / itemsPerPage));
      setTotalItems(total);
      setData(list);
    };

    const applyDataWithoutPagination = options?.apiDataPropertyToRetreive
      ? (data: Record<string, unknown>) => {
          if (options.apiDataPropertyToRetreive) {
            const retrievedData = data[
              options.apiDataPropertyToRetreive
            ] as TData[];
            setData(retrievedData);
          }
        }
      : (data: TData[]) => {
          setData(data);
        };

    const path =
      searchOptions.apiSearchEndpoint && searchValue
        ? `${searchOptions.apiSearchEndpoint}/${searchOptions.searchProperty || null}/${searchValue}`
        : apiEndpoint;

    const sortDirection = isAscDirection ? "asc" : "desc";

    await sendRequest(
      {
        path: options?.disablePagination
          ? path
          : `${path}/${sortProperty}/${sortDirection}${options?.disablePagination ? "" : `?page=${currentPage}&limit=${itemsPerPage}`}`,
      },
      options?.disablePagination
        ? applyDataWithoutPagination
        : applyDataPaginated,
    );
  }, [
    sendRequest,
    searchOptions.apiSearchEndpoint,
    searchOptions.searchProperty,
    currentPage,
    apiEndpoint,
    itemsPerPage,
    searchValue,
    isAscDirection,
    sortProperty,
    options?.apiDataPropertyToRetreive,
    options?.disablePagination,
  ]);

  /**
   * Gère l'envoi des requêtes HTTP pour récupérer les données de la table
   * Utilise un délai de 10ms pour éviter les requêtes répétés au rechargement de la page
   * Nettoie le timeout lors du démontage du composant
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleRequest();
    }, 10);

    return () => clearTimeout(timeout);
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
    searchValue,
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
