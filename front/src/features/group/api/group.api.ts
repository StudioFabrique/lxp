import apiClient from "../../../lib/axios";
import type Group from "../../../utils/interfaces/group";

const queries = {
  getById: async (id: string): Promise<Group> => {
    const res = await apiClient.get<{ data: Group }>(`/group/${id}`);
    return res.data.data;
  },
};

const mutations = {
  deleteOne: async (id: string): Promise<void> => {
    await apiClient.delete(`/group/${id}`);
  },
  deleteMany: async (ids: string[]): Promise<void> => {
    const idsQuery = ids.join(",");
    await apiClient.delete(`/group/deleteMany?ids=${idsQuery}`);
  },
  create: async (formData: FormData): Promise<void> => {
    await apiClient.post("/group", formData);
  },
  update: async (id: string, formData: FormData): Promise<void> => {
    await apiClient.put(`/group/${id}`, formData);
  },
};

export const groupApi = { queries, mutations };
