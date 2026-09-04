import apiClient from "../../../lib/axios";
import { queryOptions } from "@tanstack/react-query";

export type ModuleListItem = {
  id: number;
  title: string;
  parcoursId: number;
  parcours: string;
  formation: string;
  courses: Array<{
    id: number;
    title: string;
    order: number;
    isPublished: boolean;
    visibility: boolean | null;
    firstLessonId?: number;
  }>;
};

const queries = {
  list: () =>
    queryOptions({
      queryKey: ["modules"],
      queryFn: async (): Promise<ModuleListItem[]> => {
        const res = await apiClient.get<{ response: ModuleListItem[] }>(
          "/modules",
        );
        return res.data.response;
      },
    }),
};

const mutations = {
  remove: async (id: number): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/modules/${id}`);
    return res.data;
  },
};

export const moduleApi = { queries, mutations };
