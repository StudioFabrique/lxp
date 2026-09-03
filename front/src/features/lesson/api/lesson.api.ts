import apiClient from "../../../lib/axios";

const queries = {
  getResources: async (
    activityId: number,
    parent: string,
  ): Promise<{ success: boolean; resources: any[] }> => {
    const res = await apiClient.get(
      `/activity/resources/${activityId}/${parent}`,
    );
    return res.data;
  },
};

const mutations = {
  upsertVideoActivity: async (
    id: string | number,
    formData: FormData,
    method: "post" | "put",
  ): Promise<any> => {
    const res = await apiClient[method](`/activity/video/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
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
    return res.data;
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
    return res.data;
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
    return res.data;
  },

  updateResource: async (
    resourceId: number,
    label: string,
  ): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await apiClient.put(`/activity/resource/${resourceId}`, {
      label,
    });
    return res.data;
  },

  deleteResource: async (
    resourceId: number,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete(
      `/activity/activity-resource/${resourceId}`,
    );
    return res.data;
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
    return res.data;
  },
};

export const lessonApi = { queries, mutations };
