import apiClient from "../../../lib/axios";

type Item = { id: number; title: string };

const queries = {
  getLessonForEdit: async (lessonId: number | string) => {
    const res = await apiClient.get<{ lesson: unknown }>(
      `/lesson/edit/${lessonId}`,
    );
    return res.data;
  },
  getParcoursSelect: async (): Promise<Item[]> => {
    const res = await apiClient.get<{ data: Item[] }>("/parcours/select");
    return res.data.data;
  },

  getModulesByParcours: async (parcoursId: number): Promise<Item[]> => {
    const res = await apiClient.get<{ data: Item[] }>(
      `/modules/parcours-modules/${parcoursId}`,
    );
    return res.data.data;
  },

  getCoursesByModule: async (moduleId: number): Promise<any[]> => {
    const res = await apiClient.get(`/course/select/${moduleId}`);
    return res.data.data;
  },

  getAllLessons: async (): Promise<{
    success: boolean;
    message: string;
    lessons: any[];
  }> => {
    const res = await apiClient.get("/lesson");
    return res.data;
  },

  getLessonById: async (id: number | string): Promise<any> => {
    const res = await apiClient.get(`/lesson/${id}`);
    return res.data.data;
  },

  getActivity: async (
    activityId: string,
  ): Promise<{ success: boolean; activity: any }> => {
    const res = await apiClient.get(`/activity/${activityId}`);
    return res.data.data;
  },

  getResources: async (
    activityId: number,
    parent: string,
  ): Promise<{ success: boolean; resources: any[] }> => {
    const res = await apiClient.get(
      `/activity/resources/${activityId}/${parent}`,
    );
    return res.data.data;
  },
};

const mutations = {
  updateLesson: async (body: {
    id?: number;
    title: string;
    description: string;
    tagId?: number;
    modalite: string;
  }) => {
    const res = await apiClient.put("/lesson/update", body);
    return res.data;
  },
  createLesson: async (
    courseId: number,
    data: {
      tagId?: number;
      title: string;
      description: string;
      modalite: string;
    },
  ): Promise<any> => {
    const res = await apiClient.put(`/course/new-lesson/${courseId}`, data);
    return res.data.data;
  },

  deleteLesson: async (
    id: number,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete(`/lesson/${id}`);
    return res.data.data;
  },

  reorderActivities: async (
    lessonId: number,
    activitiesIds: number[],
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put(`/activity/reorder/${lessonId}`, {
      activitiesIds,
    });
    return res.data.data;
  },

  deleteActivity: async (
    type: string,
    activityId: number,
  ): Promise<{ message: string }> => {
    const res = await apiClient.delete(
      `/activity/${type}/${activityId}/lesson`,
    );
    return res.data.data;
  },

  upsertTextActivity: async (
    id: string,
    data: { value: string; title: string },
    method: "post" | "put",
  ): Promise<any> => {
    const res = await apiClient[method](`/activity/text/${id}`, data);
    return res.data.data;
  },

  upsertVideoActivity: async (
    id: string | number,
    formData: FormData,
    method: "post" | "put",
  ): Promise<any> => {
    const res = await apiClient[method](`/activity/video/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  upsertImageActivity: async (
    id: string | number,
    parent: string,
    formData: FormData,
    method: "post" | "put",
  ): Promise<any> => {
    const res = await apiClient[method](
      `/activity/image/${id}/${parent}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.data;
  },

  createBlogActivity: async (
    lessonId: number,
    data: {
      description: string;
      value: string;
      title: string;
      type: string;
    },
  ): Promise<any> => {
    const res = await apiClient.post(`/activity/${lessonId}`, data);
    return res.data.data;
  },

  uploadResources: async (
    id: number,
    formData: FormData,
    signal?: AbortSignal,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post(`/activity/resource/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      signal,
      onUploadProgress,
    });
    return res.data.data;
  },

  addResources: async (
    activityId: number,
    parent: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put(
      `/activity/add-resource/${activityId}/${parent}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      },
    );
    return res.data.data;
  },

  updateResource: async (
    resourceId: number,
    label: string,
  ): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await apiClient.put(`/activity/resource/${resourceId}`, {
      label,
    });
    return res.data.data;
  },

  deleteResource: async (
    resourceId: number,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete(
      `/activity/activity-resource/${resourceId}`,
    );
    return res.data.data;
  },

  reorderResources: async (
    activityId: number,
    activitiesIds: number[],
    parent: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put(
      `/activity/reorder-resource/${activityId}`,
      { activitiesIds, parent },
    );
    return res.data.data;
  },
};

export const lessonApi = { queries, mutations };
