import apiClient from "../../../lib/axios";
import type Formation from "../../../utils/interfaces/formation";
import type Group from "../../../utils/interfaces/group";
import type Parcours from "../../../utils/interfaces/parcours";
import type User from "../../../utils/interfaces/user";

type StudentsQuery = {
  currentPage: number;
  itemsPerPage: number;
  sortProperty: string;
  isAscDirection: boolean;
  searchValue: string | null;
  excludedUserIds: string[];
};

const queries = {
  getById: async (id: string): Promise<Group> => {
    const res = await apiClient.get<{ data: Group }>(`/group/${id}`);
    return res.data.data;
  },
  getFormations: async (): Promise<Formation[]> => {
    const res = await apiClient.get<Formation[]>("/formation");
    return res.data;
  },
  getParcoursByFormation: async (formationId: number): Promise<Parcours[]> => {
    const res = await apiClient.get<{ data: Parcours[] }>(
      `/parcours/parcours-by-formation/${formationId}`,
    );
    return res.data.data;
  },
  getStudents: async ({
    currentPage,
    itemsPerPage,
    sortProperty,
    isAscDirection,
    searchValue,
    excludedUserIds,
  }: StudentsQuery): Promise<{ total: number; list: User[] }> => {
    const sortDirection = isAscDirection ? "asc" : "desc";
    const res = await apiClient.get<{ total: number; list: User[] }>(
      `/user/byRank/3/${sortProperty}/${sortDirection}`,
      {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchValue || undefined,
          exclude: excludedUserIds.length
            ? excludedUserIds.join(",")
            : undefined,
        },
      },
    );
    return res.data;
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
