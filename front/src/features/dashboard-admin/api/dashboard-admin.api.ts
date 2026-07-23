import apiClient from "../../../lib/axios";
import type Parcours from "../../../utils/interfaces/parcours";
import type ParcoursSummary from "../interfaces/parcours-summary";
import type LessonsQualityStats from "../interfaces/lessons-quality-stats";

export type ModuleSummary = {
  id: number;
  parcoursId: number;
  title: string;
  parcours: string;
  formation: string;
  coursesCount: number;
  createdAt: string;
};

const queries = {
  getLastParcours: async (): Promise<Parcours[] | null> => {
    const res = await apiClient.get("/user/last-parcours");
    return res.data.response;
  },
  getRootParcours: async (): Promise<ParcoursSummary[]> => {
    const res = await apiClient.get("/parcours/root-parcours");
    return res.data;
  },
  getLastFeedbacks: async (): Promise<{ success: boolean; response: unknown[] }> => {
    const res = await apiClient.get("/user/last-feedbacks/false");
    return res.data;
  },
  getBestRatedCourses: async (): Promise<LessonsQualityStats> => {
    const res = await apiClient.get("/course/best-rated");
    return res.data;
  },
  getLastModules: async (): Promise<ModuleSummary[]> => {
    const res = await apiClient.get("/modules");
    return (res.data.response ?? []).slice(0, 5);
  },
};

export const dashboardAdminApi = { queries };
