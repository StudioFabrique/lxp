import apiClient from "../../../lib/axios";
import type { ContentType } from "../interfaces/content-type";

export type CommandResult = { success: boolean; message: string };

const queries = {
  getModuleDetail: async (moduleId: number | string) => {
    const res = await apiClient.get(`/modules/detail/limited/${moduleId}`);
    return res.data;
  },
  getLesson: async (lessonId: number) => {
    const res = await apiClient.get(`/lesson/${lessonId}`);
    return res.data;
  },
  getTags: async () => {
    const res = await apiClient.get("/tag");
    return res.data;
  },
};

/**
 * Suivi de consultation, commun aux quatre niveaux de contenu.
 *
 * Aucun de ces appels ne doit interrompre la lecture : les échecs sont
 * absorbés par les appelants, le suivi n'étant pas une fonctionnalité dont
 * dépend l'apprenant.
 */
const tracking = {
  begin: async (type: ContentType, contentId: number) => {
    const res = await apiClient.post(`/content-read/${type}/${contentId}/begin`);
    return res.data;
  },
  heartbeat: async (type: ContentType, contentId: number) => {
    const res = await apiClient.post(
      `/content-read/${type}/${contentId}/heartbeat`,
    );
    return res.data;
  },
  finish: async (type: ContentType, contentId: number) => {
    const res = await apiClient.put(
      `/content-read/${type}/${contentId}/finish`,
    );
    return res.data;
  },
};

const mutations = {
  // --- Cours
  createCourse: async (payload: { title: string; moduleId: number }) => {
    const res = await apiClient.post<{ course: { id: number } }>(
      "/course",
      payload,
    );
    return res.data;
  },
  updateCourseInfos: async (payload: {
    id: number;
    title: string;
    description: string;
    visibility: boolean;
  }) => {
    const res = await apiClient.put("/course/infos", payload);
    return res.data;
  },
  setCourseTags: async (courseId: number, tagIds: number[]) => {
    const res = await apiClient.put(`/course/tags/${courseId}`, tagIds);
    return res.data;
  },
  enableCourse: async (courseId: number, visibility: boolean) => {
    const res = await apiClient.put<CommandResult>(
      `/course/enable-course/${courseId}`,
      undefined,
      { params: { visibility } },
    );
    return res.data;
  },
  publishCourse: async (courseId: number) => {
    const res = await apiClient.put<CommandResult>(`/course/publish/${courseId}`);
    return res.data;
  },
  deleteCourse: async (courseId: number) => {
    const res = await apiClient.delete<CommandResult>(
      `/course/delete-course/${courseId}`,
    );
    return res.data;
  },

  // --- Leçons
  createLesson: async (courseId: number, payload: unknown) => {
    const res = await apiClient.put<{ id: number }>(
      `/course/new-lesson/${courseId}`,
      payload,
    );
    return res.data;
  },
  updateLesson: async (payload: unknown) => {
    const res = await apiClient.put("/lesson/update", payload);
    return res.data;
  },
  deleteLesson: async (lessonId: number) => {
    const res = await apiClient.delete<CommandResult>(`/lesson/${lessonId}`);
    return res.data;
  },
  duplicateLessons: async (courseId: number, lessonIds: number[]) => {
    const res = await apiClient.post(`/lesson/duplicate/${courseId}`, lessonIds);
    return res.data;
  },
  duplicateResources: async (courseId: number, resourceIds: number[]) => {
    const res = await apiClient.post(
      `/lesson/duplicate-resources/${courseId}`,
      resourceIds,
    );
    return res.data;
  },
  /** Première notation d'une leçon, à sa complétion. */
  rateLesson: async (lessonId: number, rate: number) => {
    const res = await apiClient.post(`/lesson/rate/${lessonId}`, { rate });
    return res.data;
  },
  /** Modification d'une note déjà attribuée. */
  updateLessonRating: async (lessonId: number, rate: number) => {
    const res = await apiClient.put(`/lesson/rate/${lessonId}`, { rate });
    return res.data;
  },

  // --- Activités
  createTextActivity: async (
    lessonId: number,
    payload: { title: string; value: string; parent: "lesson" },
  ) => {
    const res = await apiClient.post(`/activity/text/${lessonId}`, payload);
    return res.data;
  },
  updateTextActivity: async (
    activityId: number,
    payload: { title: string; value: string; parent: "lesson" },
  ) => {
    const res = await apiClient.put(`/activity/text/${activityId}`, payload);
    return res.data;
  },
  createIframeActivity: async (
    lessonId: number,
    payload: { title: string; url?: string },
  ) => {
    const res = await apiClient.post(`/activity/iframe/${lessonId}`, payload);
    return res.data;
  },
  updateIframeActivity: async (
    activityId: number,
    payload: { title: string; url?: string },
  ) => {
    const res = await apiClient.put(`/activity/iframe/${activityId}`, payload);
    return res.data;
  },
  updateResourceActivityTitle: async (
    activityId: number,
    title: string,
    parent: "lesson" | "resource" = "lesson",
  ) => {
    const res = await apiClient.put(
      `/activity/title/${activityId}/${parent}`,
      { title },
    );
    return res.data;
  },
  deleteActivity: async (type: string, activityId: number) => {
    const res = await apiClient.delete(`/activity/${type}/${activityId}/lesson`);
    return res.data;
  },
  reorderActivities: async (lessonId: number, activitiesIds: number[]) => {
    const res = await apiClient.put(`/activity/reorder/${lessonId}`, {
      activitiesIds,
    });
    return res.data;
  },
};

export const modulePreviewApi = { queries, mutations, tracking };
