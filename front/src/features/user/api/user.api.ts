import apiClient from "../../../lib/axios";
import type User from "../../../utils/interfaces/user";

export const queries = {
  getUserData: async (id: string): Promise<{ user: User }> => {
    const res = await apiClient.get(`/user/data/${id}`);
    return res.data;
  },
};

export const mutations = {
  create: async (userData: Record<string, unknown>, file: File | null) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ user: userData }));
    if (file) {
      formData.append("image", file);
    }
    const res = await apiClient.post("/user", formData);
    return res.data;
  },
  update: async (
    id: string,
    userData: Record<string, unknown>,
    file: File | null,
  ) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ user: userData }));
    if (file) {
      formData.append("image", file);
    }
    const res = await apiClient.put(`/user/${id}`, formData);
    return res.data;
  },
  deleteOne: async (id: string) => {
    const res = await apiClient.delete(`/user/${id}`);
    return res.data;
  },
  updateUserStatus: async (id: string, value: boolean) => {
    const res = await apiClient.put("/user/update-user-status", {
      userId: id,
      value,
    });
    return res.data;
  },
  updateManyStatus: async (ids: string[], status: string) => {
    const res = await apiClient.put("/user/update-many-status", {
      usersIds: ids,
      status,
    });
    return res.data;
  },
  updateUserRoles: async (userIds: string[], roleIds: string[]) => {
    const res = await apiClient.put("/user/user-roles", {
      usersToUpdate: userIds,
      rolesId: roleIds,
    });
    return res.data;
  },
  sendInvitation: async (userId: string) => {
    const res = await apiClient.put(`/user/invitation/${userId}`);
    return res.data;
  },
  sendManyInvitations: async (userIds: string[]) => {
    const res = await apiClient.post("/user/invitations", { userIds });
    return res.data;
  },
};

export const userApi = {
  queries,
  mutations,
};
