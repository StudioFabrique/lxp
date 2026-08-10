import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { groupApi } from "../api/group.api";

export function useAvailableStudents(
  excludedUserIds: string[],
  enabled: boolean,
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const storedValue = localStorage.getItem("itemsPerPage");
    return storedValue ? Number(storedValue) : 10;
  });
  const [sortProperty, setSortProperty] = useState("lastname");
  const [isAscDirection, setIsAscDirection] = useState(true);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const excludedIdsKey = excludedUserIds.join(",");
  const stableExcludedUserIds = useMemo(
    () => excludedIdsKey.split(",").filter(Boolean),
    [excludedIdsKey],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "available-students",
      currentPage,
      itemsPerPage,
      sortProperty,
      isAscDirection,
      searchValue,
      excludedIdsKey,
    ],
    queryFn: () =>
      groupApi.queries.getStudents({
        currentPage,
        itemsPerPage,
        sortProperty,
        isAscDirection,
        searchValue,
        excludedUserIds: stableExcludedUserIds,
      }),
    enabled,
    placeholderData: keepPreviousData,
  });

  const totalItems = data?.total ?? 0;
  const maxPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handleSortProperty = (property: string) => {
    if (property === sortProperty) {
      setIsAscDirection((currentDirection) => !currentDirection);
    } else {
      setSortProperty(property);
      setIsAscDirection(true);
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value.trim() || null);
    setCurrentPage(1);
  };

  const handleSetItemsPerPage = (value: number) => {
    localStorage.setItem("itemsPerPage", String(value));
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return {
    data: data?.list ?? [],
    isLoading: isLoading || isFetching,
    searchValue,
    sortProperty,
    isAscDirection,
    totalItems,
    currentPage,
    maxPage,
    itemsPerPage,
    onSortProperty: handleSortProperty,
    onSubmitSearchValue: handleSearch,
    onSetCurrentPage: setCurrentPage,
    onSetItemsPerPage: handleSetItemsPerPage,
    onSetPreviousPage: () =>
      setCurrentPage((page) => Math.max(page - 1, 1)),
    onSetNextPage: () =>
      setCurrentPage((page) => Math.min(page + 1, maxPage)),
    onResetPagination: () => setCurrentPage(1),
  };
}
