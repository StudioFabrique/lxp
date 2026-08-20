import apiClient from "../../../lib/axios";

export type ResourceMutationResult = { success: boolean; message: string };

const queries = {
  getDetails: async (resourceId: number) => {
    const res = await apiClient.get(`/resources/${resourceId}`);
    return res.data;
  },
  getList: async (params: {
    stype: string;
    sdir: string;
    page: number;
    limit: number;
    searchTerm?: string;
  }) => {
    const { stype, sdir, ...query } = params;
    const res = await apiClient.get(`/resources/${stype}/${sdir}`, {
      params: query,
    });
    return res.data;
  },
};

const mutations = {
  /** Crée la ressource, ou la met à jour quand `resourceId` est fourni. */
  save: async (payload: FormData, resourceId?: number) => {
    const path = resourceId ? `/resources/${resourceId}` : "/resources";
    const res = resourceId
      ? await apiClient.put(path, payload)
      : await apiClient.post(path, payload);
    return res.data;
  },
  remove: async (resourceId: number) => {
    const res = await apiClient.delete(`/resources/${resourceId}`);
    return res.data;
  },

  // Activités rattachées à une ressource. Le segment `resource` distingue le
  // parent, les mêmes routes servant les activités de leçon.
  removeActivity: async (type: string, activityId: number) => {
    const res = await apiClient.delete(`/activity/${type}/${activityId}/resource`);
    return res.data;
  },
  saveTextActivity: async (id: number, body: unknown, isUpdate: boolean) => {
    const res = isUpdate
      ? await apiClient.put(`/activity/text/${id}`, body)
      : await apiClient.post(`/activity/text/${id}`, body);
    return res.data;
  },
  saveVideoActivity: async (id: number, payload: FormData, isUpdate: boolean) => {
    const res = isUpdate
      ? await apiClient.put(`/activity/video/${id}`, payload)
      : await apiClient.post(`/activity/video/${id}`, payload);
    return res.data;
  },
  saveIframeActivity: async (
    id: number,
    body: { title: string; url: string },
    isUpdate: boolean,
  ) => {
    const payload = { ...body, parent: "resource" };
    const res = isUpdate
      ? await apiClient.put(`/activity/iframe/${id}`, payload)
      : await apiClient.post(`/activity/iframe/${id}`, payload);
    return res.data;
  },
  saveImageActivity: async (id: number, payload: FormData, isUpdate: boolean) => {
    const res = await apiClient.request({
      url: `/activity/image/${id}/resource`,
      method: isUpdate ? "put" : "post",
      data: payload,
    });
    return res.data;
  },
};

export const resourcesApi = { queries, mutations };
