import apiClient from "../../lib/axios";
import {
  introLessonSchema,
  introModuleDetailSchema,
  introModulesSchema,
  type IntroLesson,
  type IntroModuleDetail,
  type IntroModules,
} from "./intro-content.schema";

export const introPresentationKeys = {
  all: ["intro-presentation"] as const,
  modules: (parcoursId: number) =>
    [...introPresentationKeys.all, "modules", parcoursId] as const,
  moduleDetail: (moduleId: number) =>
    [...introPresentationKeys.all, "module", moduleId] as const,
  lesson: (lessonId: number) =>
    [...introPresentationKeys.all, "lesson", lessonId] as const,
};

/**
 * Lectures décoratives : les réponses sont validées, et un échec de validation
 * rejette la requête pour que la présentation retombe sur ses exemples.
 */
export const introPresentationApi = {
  getModules: async (parcoursId: number): Promise<IntroModules> => {
    const res = await apiClient.get<unknown>(`/modules/${parcoursId}`);
    return introModulesSchema.parse(res.data);
  },
  getModuleDetail: async (moduleId: number): Promise<IntroModuleDetail> => {
    const res = await apiClient.get<unknown>(
      `/modules/detail/limited/${moduleId}`,
    );
    return introModuleDetailSchema.parse(res.data);
  },
  getLesson: async (lessonId: number): Promise<IntroLesson> => {
    const res = await apiClient.get<unknown>(`/lesson/${lessonId}`);
    return introLessonSchema.parse(res.data);
  },
};
