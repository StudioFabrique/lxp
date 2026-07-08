import apiClient from "../../../lib/axios";
import type { GroupsStats, TopUser } from "../types";

const queries = {
  getTotalTokens: async (): Promise<{
    totalTokens: number;
    totalCurrentMonthTokens: number;
  }> => {
    const res = await apiClient.get("/dashboard-ia/total-tokens");
    return res.data;
  },
  getGroupsStats: async (): Promise<GroupsStats[]> => {
    const res = await apiClient.get("/dashboard-ia/groups-all-stats");
    return res.data;
  },
  getTopUsers: async (params: {
    sortProperty: string;
    sortDirection: string;
    page: number;
    limit: number;
    searchTerm?: string | null;
  }): Promise<{ list: TopUser[]; total: number }> => {
    const { sortProperty, sortDirection, page, limit, searchTerm } = params;
    let path = `/dashboard-ia/top-users/${sortProperty}/${sortDirection}?page=${page}&limit=${limit}`;
    if (searchTerm) path += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    const res = await apiClient.get(path);
    return res.data;
  },
};

export const dashboardIAApi = {
  queries,
};
