import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queries } from "../api/user.api";
import type User from "../../../utils/interfaces/user";
import type UsersStats from "../interfaces/users-stats";
import type Role from "../../../utils/interfaces/role";

export function useUserList(role: Role | null) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const stored = localStorage.getItem("itemsPerPage");
    return stored ? parseInt(stored) : 10;
  });
  const [sortProperty, setSortProperty] = useState<string | null>("lastname");
  const [isAscDirection, setIsAscDirection] = useState(true);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const roleName = role?.role ?? "everything";

  const handleSortProperty = (property: string) => {
    if (property === sortProperty) {
      setIsAscDirection((prev) => !prev);
    } else {
      setIsAscDirection(true);
      setSortProperty(property);
    }
  };

  const handleSearchValue = (value: string) => {
    setSearchValue(value.length > 0 ? value : null);
    setCurrentPage(1);
  };

  const handleSetItemsPerPage = (value: number) => {
    localStorage.setItem("itemsPerPage", value.toString());
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const baseEndpoint = searchValue
    ? `/user/search/${roleName}/lastname/${searchValue}`
    : `/user/list/${roleName}`;

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "users",
      roleName,
      currentPage,
      itemsPerPage,
      sortProperty,
      isAscDirection,
      searchValue,
    ],
    queryFn: async () => {
      const sortDir = isAscDirection ? "asc" : "desc";
      const path = `${baseEndpoint}/${sortProperty}/${sortDir}?page=${currentPage}&limit=${itemsPerPage}`;
      const res = { data: (await queries.list(path)) as { total: number; list: User[] } };
      return res.data;
    },
    enabled: !!role,
    placeholderData: keepPreviousData,
  });

  const listData = useMemo(() => data?.list ?? [], [data]);
  const totalItems = data?.total ?? 0;
  const maxPage = Math.ceil(totalItems / itemsPerPage) || 1;

  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = { data: (await queries.stats()) as UsersStats[] };
      return res.data;
    },
  });

  return {
    data: listData,
    isLoading: isLoading || isFetching,
    searchValue,
    currentPage,
    maxPage,
    itemsPerPage,
    totalItems,
    sortProperty,
    isAscDirection,
    stats: statsData ?? null,
    onSortProperty: handleSortProperty,
    onSetItemsPerPage: handleSetItemsPerPage,
    onSetCurrentPage: setCurrentPage,
    onSetPreviousPage: () => setCurrentPage((p) => Math.max(p - 1, 1)),
    onSetNextPage: () => setCurrentPage((p) => Math.min(p + 1, maxPage)),
    onRefreshData: refetch,
    onSubmitSearchValue: handleSearchValue,
  };
}
