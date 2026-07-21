import apiClient from "../../../lib/axios";
import type FormationItem from "../interfaces/formation-item";
import type Tag from "../../../utils/interfaces/tag";

const queries = {
  getTags: async (): Promise<Tag[]> => {
    const res = await apiClient.get("/tag");
    return res.data;
  },
  getFormationList: async (): Promise<FormationItem[]> => {
    const res = await apiClient.get("/formation/list");
    return res.data.response;
  },
};

const mutations = {
  createTags: async (
    tags: { name: string; color: string }[],
  ): Promise<Tag[]> => {
    const res = await apiClient.post("/tag", { tags });
    return res.data;
  },
  createFormation: async (body: {
    title: string;
    description?: string;
    code?: string;
    level: string;
    tags: number[];
  }): Promise<FormationItem> => {
    const res = await apiClient.post("/formation", body);
    return res.data.response;
  },
  updateFormation: async (
    id: number,
    body: {
      title: string;
      description?: string;
      code?: string;
      level: string;
      tags: number[];
    },
  ): Promise<FormationItem> => {
    const res = await apiClient.put(`/formation/${id}`, { formation: body });
    return res.data.response;
  },
  deleteFormation: async (id: number): Promise<void> => {
    await apiClient.delete(`/formation/${id}`);
  },
};

export const formationApi = {
  queries,
  mutations,
};
