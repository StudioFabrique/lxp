import apiClient from "../../../lib/axios";
import type LessonRead from "../../../utils/interfaces/lesson-read";
import type Parcours from "../../../utils/interfaces/parcours";
import type Course from "../../../utils/interfaces/course";
export interface ParcoursStats {
  diplome: string;
  totalWeeks: number;
  totalHours: number;
  totalModules: number;
}

const queries = {
  getLastReadLessons: async (): Promise<LessonRead[]> => {
    const res = await apiClient.get("/lesson/last-read");
    return res.data.data;
  },
  getModuleImage: async (moduleId: number): Promise<string | null> => {
    const res = await apiClient.get(`/modules/image/${moduleId}`);
    return res.data.data?.image ?? null;
  },
  getParcoursAsStudent: async (): Promise<Parcours[]> => {
    const res = await apiClient.get("/parcours/parcours-as-student");
    return res.data;
  },
  getAccomplishments: async (): Promise<{ data: unknown }> => {
    const res = await apiClient.get("/user/accomplishment");
    return res.data;
  },
  getOwnFeedback: async (): Promise<{ data: { feedbackAt: string; feelingLevel: number } | null }> => {
    const res = await apiClient.get("/user/own-feedback");
    return res.data;
  },
  getMostReadCourses: async (): Promise<Course[]> => {
    const res = await apiClient.get("/course/most-read");
    return res.data.data;
  },
  getParcoursStats: async (parcoursId: number): Promise<ParcoursStats> => {
    const res = await apiClient.get(`/stats/parcours/${parcoursId}`);
    return res.data.data;
  },
};

export const dashboardStudentApi = { queries };
