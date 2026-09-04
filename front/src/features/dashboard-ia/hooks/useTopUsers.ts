import { useCallback, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { dashboardIAApi } from "../api/dashboardIA.api";
import {
  getStoredItemsPerPage,
  storeItemsPerPage,
} from "../../../components/table/pagination-storage";

const useTopUsers = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState(() =>
    getStoredItemsPerPage("dashboard-ia-users", 10),
  );
  const [sortProperty, setSortProperty] = useState("totalTokens");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const queryKey = [
    "top-users",
    page,
    perPage,
    sortProperty,
    sortDirection,
    searchTerm,
  ];

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      dashboardIAApi.queries.getTopUsers({
        sortProperty,
        sortDirection,
        page,
        limit: perPage,
        searchTerm,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSort = useCallback((property: string) => {
    setSortProperty((prev) => {
      if (property === prev) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDirection("asc");
      return property;
    });
    setPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value || null);
    setPage(1);
  }, []);

  const setPerPage = useCallback((value: number) => {
    storeItemsPerPage("dashboard-ia-users", value);
    setPerPageState(value);
  }, []);

  return {
    dataList: data?.list ?? [],
    totalItems: data?.total ?? 0,
    totalPages: Math.ceil((data?.total ?? 0) / perPage) || 1,
    page,
    perPage,
    sortProperty,
    sortDirection,
    isLoading: isLoading || isFetching,
    setPage,
    setPerPage,
    handleSort,
    handleSearch,
  };
};

export default useTopUsers;
