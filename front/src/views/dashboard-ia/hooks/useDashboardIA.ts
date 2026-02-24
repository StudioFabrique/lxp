import { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/use-http";
import usePagination from "../../../hooks/use-pagination";

export type GroupsStats = {
  _id: string;
  totalTokens: number;
  totalPrompts: number;
  averageTokensPerPrompt: number;
  groupName: string;
};

export type TopUser = {
  _id: string;
  name: string;
  totalTokens: number;
  groupName: string | null;
  lastActivity: string;
};

const useDashboardIA = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [totalCurrentMonthTokens, setTotalCurrentMonthTokens] =
    useState<number>(0);
  const [groupsStats, setGroupsStats] = useState<GroupsStats[] | null>(null);
  const [top5Users, setTop5Users] = useState<TopUser[] | null>(null);
  const { dataList, perPage, totalPages, page, setPage, setPerPage } =
    usePagination("totalTokens", "/dashboard-ia/top-users");
  const refFirstRender = useRef(true);

  const groupsTotalTokens =
    groupsStats?.reduce((acc, group) => acc + group.totalTokens, 0) || 0;

  const getTotalTokens = useCallback(() => {
    const applyData = (data: {
      totalTokens: number;
      totalCurrentMonthTokens: number;
    }) => {
      setTotalTokens(data.totalTokens);
      setTotalCurrentMonthTokens(data.totalCurrentMonthTokens);
    };
    sendRequest(
      {
        path: "/dashboard-ia/total-tokens",
      },
      applyData,
    );
  }, [sendRequest]);

  const getAllGroupsStats = useCallback(() => {
    const applyData = (data: GroupsStats[]) => {
      setGroupsStats(data);
    };
    sendRequest(
      {
        path: "/dashboard-ia/groups-all-stats",
      },
      applyData,
    );
  }, [sendRequest]);

  useEffect(() => {
    getTotalTokens();
    getAllGroupsStats();
  }, [getTotalTokens, getAllGroupsStats]);

  useEffect(() => {
    if (refFirstRender.current && dataList && dataList.length > 0) {
      refFirstRender.current = false;
      setTop5Users(dataList.slice(0, 5));

      return;
    } else return;
  }, [dataList]);

  return {
    dataList,
    setPerPage,
    setPage,
    isLoading,
    error,
    totalTokens,
    totalCurrentMonthTokens,
    getTotalTokens,
    groupsStats,
    groupsTotalTokens,
    page,
    perPage,
    totalPages,
    top5Users,
  };
};
export default useDashboardIA;
