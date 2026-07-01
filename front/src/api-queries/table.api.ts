import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import apiClient from "./axios";

export interface PaginatedResponse<T> {
  total: number;
  list: T[];
}

export interface SearchParams {
  apiSearchEndpoint?: string;
  searchProperty?: string;
}

const fetchPaginatedData = async <T>({
  apiEndpoint,
  currentPage,
  itemsPerPage,
  sortProperty,
  isAscDirection,
  searchValue,
  searchOptions,
  disablePagination,
}: {
  apiEndpoint: string;
  currentPage: number;
  itemsPerPage: number;
  sortProperty: string | null;
  isAscDirection: boolean;
  searchValue: string | null;
  searchOptions: SearchParams;
  disablePagination?: boolean;
}): Promise<PaginatedResponse<T>> => {
  // Détermination du chemin de base dynamique
  const basePath =
    searchOptions.apiSearchEndpoint && searchValue
      ? `${searchOptions.apiSearchEndpoint}/${searchOptions.searchProperty || "null"}/${searchValue}`
      : apiEndpoint;

  const sortDirection = isAscDirection ? "asc" : "desc";

  // Construction de l'URL finale
  let finalPath = basePath;
  if (!disablePagination && sortProperty) {
    finalPath = `${basePath}/${sortProperty}/${sortDirection}?page=${currentPage}&limit=${itemsPerPage}`;
  }

  // Requête
  const response = await apiClient.get<PaginatedResponse<T>>(finalPath);
  return response.data;
};

export const paginatedQueries = {
  getPaginatedData: <TData>(
    apiEndpoint: string,
    currentPage: number,
    itemsPerPage: number,
    sortProperty: string | null,
    isAscDirection: boolean,
    searchValue: string | null,
    searchOptions: {
      apiSearchEndpoint?: string;
      searchProperty?: string;
    },
    options?: {
      disablePagination?: boolean;
      invokeErrorToast?: boolean;
      queryKeyPrefix?: string;
    },
  ) =>
    queryOptions({
      queryKey: [
        options?.queryKeyPrefix || apiEndpoint,
        currentPage,
        itemsPerPage,
        sortProperty,
        isAscDirection,
        searchValue,
      ],

      queryFn: () =>
        fetchPaginatedData<TData>({
          apiEndpoint,
          currentPage,
          itemsPerPage,
          sortProperty,
          isAscDirection,
          searchValue,
          searchOptions,
          disablePagination: options?.disablePagination,
        }),
      placeholderData: keepPreviousData,
    }),
};
