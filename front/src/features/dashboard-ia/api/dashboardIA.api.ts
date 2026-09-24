import apiClient from "../../../lib/axios";
import type { GroupsStats, TopUser } from "../types";

export type DropoutPreferences = { enabled: boolean; frequency: "weekly" | "monthly"; hasParcours: boolean; onboardingRequired: boolean };
export type DropoutSummary = { groupId: string; name: string; analyzed: number; critical: number; completedAt: string };

const queries = {
  getTotalTokens: async (): Promise<{
    totalTokens: number;
    totalCurrentMonthTokens: number;
  }> => {
    const res = await apiClient.get("/dashboard-ia/total-tokens");
    return res.data;
  },
  getDropoutPreferences: async (): Promise<DropoutPreferences> =>
    (await apiClient.get("/dashboard-ia/dropout/preferences")).data,
  getDropoutSummaries: async (): Promise<DropoutSummary[]> =>
    (await apiClient.get("/dashboard-ia/dropout/summaries")).data,
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
  updateDropoutPreferences: async (input: Pick<DropoutPreferences, "enabled" | "frequency">): Promise<DropoutPreferences> =>
    (await apiClient.put("/dashboard-ia/dropout/preferences", input)).data,
};
