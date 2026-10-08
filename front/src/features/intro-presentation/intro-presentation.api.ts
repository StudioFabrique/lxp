import { z } from "zod";
import apiClient from "../../lib/axios";
import {
  introLessonSchema,
  introParcoursSchema,
  introModuleDetailSchema,
  introModulesSchema,
  type IntroLesson,
  type IntroParcours,
  type IntroModuleDetail,
  type IntroModules,
} from "./intro-content.schema";

export const introPresentationKeys = {
  all: ["intro-presentation"] as const,
  modules: (parcoursId: number) =>
    [...introPresentationKeys.all, "modules", parcoursId] as const,
  moduleDetail: (moduleId: number) =>
    [...introPresentationKeys.all, "module", moduleId] as const,
  parcours: (parcoursId: number) =>
    [...introPresentationKeys.all, "parcours", parcoursId] as const,
  tags: () => [...introPresentationKeys.all, "tags"] as const,
  groups: () => [...introPresentationKeys.all, "groups"] as const,
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
  getParcours: async (parcoursId: number): Promise<IntroParcours> => {
    const res = await apiClient.get<unknown>(
      `/parcours/parcours-by-id/${parcoursId}`,
    );
    return introParcoursSchema.parse(res.data);
  },
  getTagNames: async (): Promise<string[]> => {
    const res = await apiClient.get<unknown>("/tag");
    return z.array(z.object({ name: z.string() })).parse(res.data).map((tag) => tag.name);
  },
  getGroupNames: async (): Promise<string[]> => {
    const res = await apiClient.get<unknown>("/group/student");
    return z
      .object({ data: z.array(z.object({ name: z.string() })) })
      .parse(res.data)
      .data.map((group) => group.name);
  },
  getLesson: async (lessonId: number): Promise<IntroLesson> => {
    const res = await apiClient.get<unknown>(`/lesson/${lessonId}`);
    return introLessonSchema.parse(res.data);
  },
};
