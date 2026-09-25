import apiClient from "../../../lib/axios";
import type { GroupsStats, TopUser } from "../types";

export type DropoutPreferences = { enabled: boolean; frequency: "weekly" | "monthly"; minCritical?: 1 | 2; hasParcours: boolean; onboardingRequired: boolean };
export type DropoutSummary = { groupId: string; name: string; analyzed: number; critical: number; alertCritical: number; completedAt: string; weekKey: string; reviewed: boolean };
export type DropoutStudent = { userId: string; name: string; critical: boolean; effectiveLevel: number; indicators: {
  pass_rate: number | null; monthly_connection_days: number | null; days_since_last_activity: number | null;
} | null; coverage: { available: number; total: number } | null };
export type GroupDropoutAnalysis = DropoutSummary & { students: DropoutStudent[]; canReview: boolean; canManageAlerts: boolean; disabledStudentIds: string[] };

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
  getGroupDropoutAnalysis: async (groupId: string): Promise<GroupDropoutAnalysis> =>
    (await apiClient.get(`/dashboard-ia/dropout/groups/${encodeURIComponent(groupId)}`)).data,
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
  reviewGroupDropoutAlert: async (groupId: string, weekKey: string): Promise<{ reviewed: boolean }> =>
    (await apiClient.post(`/dashboard-ia/dropout/groups/${encodeURIComponent(groupId)}/review`, { weekKey })).data,
  updateGroupDropoutAlertSettings: async (groupId: string, disabledStudentIds: string[]): Promise<{ disabledStudentIds: string[] }> =>
    (await apiClient.put(`/dashboard-ia/dropout/groups/${encodeURIComponent(groupId)}/alert-settings`, { disabledStudentIds })).data,
  updateDropoutPreferences: async (input: Pick<DropoutPreferences, "enabled" | "frequency" | "minCritical"> & { completeOnboarding?: boolean }): Promise<DropoutPreferences> =>
    (await apiClient.put("/dashboard-ia/dropout/preferences", input)).data,
};
