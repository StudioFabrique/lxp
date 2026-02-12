import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

export type GroupsStats = {
  _id: string;
  totalTokens: number;
  totalPrompts: number;
  averageTokensPerPrompt: number;
  groupName: string;
};

const useDashboardIA = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [groupsStats, setGroupsStats] = useState<GroupsStats[] | null>(null);

  const groupsTotalTokens =
    groupsStats?.reduce((acc, group) => acc + group.totalTokens, 0) || 0;

  const getTotalTokens = useCallback(() => {
    const applyData = (data: { response: number }) => {
      setTotalTokens(data.response);
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
      console.log(data);
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

  return {
    isLoading,
    error,
    totalTokens,
    getTotalTokens,
    groupsStats,
    groupsTotalTokens,
  };
};
export default useDashboardIA;
