import apiClient from "../../../lib/axios";

export type ModuleListResponse = {
  response: Array<Record<string, unknown> & { id: number; formation?: unknown }>;
};

const queries = {
  getAll: async (): Promise<ModuleListResponse> => {
    const res = await apiClient.get<ModuleListResponse>("/modules");
    return res.data;
  },
};

const mutations = {
  remove: async (id: number): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/modules/${id}`);
    return res.data;
  },
};

export const moduleApi = { queries, mutations };
