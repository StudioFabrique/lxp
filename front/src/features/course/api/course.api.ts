import apiClient from "../../../lib/axios";
import { queryOptions } from "@tanstack/react-query";

import type Course from "../../../utils/interfaces/course";
import type Lesson from "../../../utils/interfaces/lesson";
import type CourseDates from "../interfaces/course-dates";
import type { LessonWithActivitiesCount } from "../../../utils/interfaces/lesson";
import type CustomCourse from "../components/list/interfaces/custom-course";

const queries = {
  list: () =>
    queryOptions({
      queryKey: ["courses"],
      queryFn: async (): Promise<CustomCourse[]> => {
        const res = await apiClient.get("/course");
        return res.data.response;
      },
    }),

  infos: (courseId: string) =>
    queryOptions({
      queryKey: ["course", courseId, "infos"],
      queryFn: async (): Promise<Course> => {
        const res = await apiClient.get(`/course/infos/${courseId}`);
        return res.data;
      },
    }),

  scenario: (courseId: string) =>
    queryOptions({
      queryKey: ["course", courseId, "scenario"],
      queryFn: async () => {
        const res = await apiClient.get(`/course/scenario/${courseId}`);
        return res.data;
      },
    }),

  dates: (courseId: string) =>
    queryOptions({
      queryKey: ["course", courseId, "dates"],
      queryFn: async (): Promise<{ dates: CourseDates[] }> => {
        const res = await apiClient.get(`/course/dates/${courseId}`);
        return res.data;
      },
    }),

  lessonsByTag: (tagId: number) =>
    queryOptions({
      queryKey: ["lessons", "tag", tagId],
      queryFn: async (): Promise<{ data: LessonWithActivitiesCount[] }> => {
        const res = await apiClient.get(`/lesson/tag/${tagId}`);
        return res.data;
      },
    }),

  parcoursSelect: () =>
    queryOptions({
      queryKey: ["parcours", "select"],
      queryFn: async () => {
        const res = await apiClient.get("/parcours/select");
        return res.data;
      },
    }),

  modulesByParcours: (parcoursId: number) =>
    queryOptions({
      queryKey: ["modules", "parcours", parcoursId],
      queryFn: async () => {
        const res = await apiClient.get(
          `/modules/parcours-modules/${parcoursId}`,
        );
        return res.data;
      },
    }),

  formations: () =>
    queryOptions({
      queryKey: ["formations"],
      queryFn: async () => {
        const res = await apiClient.get("/formation");
        return res.data;
      },
    }),

  parcoursByFormation: (formationId: number) =>
    queryOptions({
      queryKey: ["parcours", "formation", formationId],
      queryFn: async () => {
        const res = await apiClient.get(
          `/parcours/parcours-by-formation/${formationId}`,
        );
        return res.data;
      },
    }),

  modules: (parcoursId: number) =>
    queryOptions({
      queryKey: ["modules", parcoursId],
      queryFn: async () => {
        const res = await apiClient.get(`/modules/${parcoursId}`);
        return res.data;
      },
    }),
};

const mutations = {
  create: async (body: {
    title: string;
    moduleId: number;
  }): Promise<{ course: { id: number }; message: string; success: boolean }> => {
    const res = await apiClient.post("/course", body);
    return res.data;
  },

  updateInfos: async (body: {
    id: number;
    title: string;
    description?: string;
    visibility: boolean;
  }): Promise<{ success: boolean; message: string; data: unknown }> => {
    const res = await apiClient.put("/course/infos", body);
    return res.data;
  },

  publish: async (courseId: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put(`/course/publish/${courseId}`);
    return res.data;
  },

  updateTags: async (
    courseId: string,
    tagIds: number[],
  ): Promise<void> => {
    const res = await apiClient.put(`/course/tags/${courseId}`, tagIds);
    return res.data;
  },

  updateContacts: async (
    courseId: string,
    contactIds: number[],
  ): Promise<void> => {
    const res = await apiClient.put(
      `/course/contacts/${courseId}`,
      contactIds,
    );
    return res.data;
  },

  updateVirtualClass: async (
    courseId: string,
    virtualClass: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put(`/course/virtual-class/${courseId}`, {
      virtualClass,
    });
    return res.data;
  },

  addDate: async (
    courseId: string,
    date: CourseDates,
  ): Promise<void> => {
    const res = await apiClient.put(`/course/dates/${courseId}`, date);
    return res.data;
  },

  deleteDate: async (
    courseId: string,
    dateId: number,
  ): Promise<void> => {
    const res = await apiClient.delete(`/course/dates/${courseId}/${dateId}`);
    return res.data;
  },

  addLesson: async (courseId: string, body: {
    tagId?: number;
    title: string;
    description: string;
    modalite: string;
  }): Promise<Lesson> => {
    const res = await apiClient.put(`/course/new-lesson/${courseId}`, body);
    return res.data;
  },

  updateLesson: async (body: {
    id: number;
    title: string;
    description: string;
    tagId: number;
    modalite: string;
  }): Promise<Lesson> => {
    const res = await apiClient.put("/lesson/update", body);
    return res.data;
  },

  deleteLesson: async (id: number): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete(`/lesson/${id}`);
    return res.data;
  },

  duplicateLessons: async (
    courseId: string,
    lessonIds: number[],
  ): Promise<{ success: boolean; message: string; response: Lesson }> => {
    const res = await apiClient.post(`/lesson/duplicate/${courseId}`, lessonIds);
    return res.data;
  },

  reorderLessons: async (
    courseId: string,
    lessonIds: number[],
  ): Promise<void> => {
    const res = await apiClient.put(`/lesson/reorder/${courseId}`, lessonIds);
    return res.data;
  },

  importStructure: async (payload: {
    title: string;
    description?: string;
    courseSlug?: string;
    moduleId?: number;
    parcoursId?: number;
    lessons: { id: number; title: string; modalite: string; isSelected: boolean }[];
  }): Promise<{ lessonsMap: { tempId: number; realId: number }[] }> => {
    const res = await apiClient.post("/course/import-structure", payload);
    return res.data;
  },

  createTextActivity: async (
    lessonId: number,
    body: { title: string; description: string; value: string; parent: string },
  ): Promise<void> => {
    const res = await apiClient.post(`/activity/text/${lessonId}`, body);
    return res.data;
  },

  uploadActivityResource: async (
    lessonId: number,
    formData: FormData,
  ): Promise<void> => {
    const res = await apiClient.post(`/activity/resource/${lessonId}`, formData);
    return res.data;
  },

  uploadBlogImage: async (formData: FormData): Promise<{ response: string; url: string }> => {
    const res = await apiClient.post("/activity/blog-image", formData);
    return res.data;
  },
};

export const courseApi = { queries, mutations };
