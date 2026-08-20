import apiClient from "../../../lib/axios";

export type TagRow = {
  id: number;
  name: string;
  color: string;
  totalUses: number;
  parcours: { id: number; title: string }[];
};

const queries = {
  getAll: async (): Promise<TagRow[]> => {
    const res = await apiClient.get<TagRow[]>("/tag");
    return res.data;
  },
};

const mutations = {
  deleteOne: async (id: number): Promise<void> => {
    await apiClient.delete(`/tag/deleteSingle/${id}`);
  },
  deleteMany: async (ids: string[]): Promise<void> => {
    const idsQuery = ids.join(",");
    await apiClient.delete(`/tag/deleteMany/?ids=${idsQuery}`);
  },
  createTags: async (
    tags: { name: string; color: string }[],
  ): Promise<void> => {
    await apiClient.post("/tag", { tags });
  },
  updateTag: async (id: number, name: string): Promise<void> => {
    await apiClient.put(`/tag/${id}`, { name });
  },
};

export const tagApi = {
  queries,
  mutations,
};
