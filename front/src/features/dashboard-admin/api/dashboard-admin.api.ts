import apiClient from "../../../lib/axios";
import type Parcours from "../../../utils/interfaces/parcours";
import type ParcoursSummary from "../../../utils/interfaces/parcours-summary";
import type LessonsQualityStats from "../../../utils/interfaces/lessons-quality-stats";

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
};

export const dashboardAdminApi = { queries };
