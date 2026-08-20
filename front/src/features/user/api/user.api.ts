import apiClient from "../../../lib/axios";
import type User from "../../../utils/interfaces/user";
import type { UserDataResponse } from "../interfaces/user-data";

export const queries = {
  list: async (path: string) => {
    const res = await apiClient.get<{ total: number; list: unknown[] }>(path);
    return res.data;
  },
  stats: async () => {
    const res = await apiClient.get("/user/stats");
    return res.data;
  },
  roles: async () => {
    const res = await apiClient.get("/permission/role");
    return res.data;
  },
  getUserData: async (id: string): Promise<UserDataResponse> => {
    const res = await apiClient.get(`/user/data/${id}`);
    return res.data;
  },
  getUsersByIds: async (ids: string[]): Promise<User[]> => {
    const res = await apiClient.get<{ list: User[] }>("/user/byIds", {
      params: { ids: ids.join(",") },
    });
    return res.data.list;
  },
};

export const mutations = {
  createMany: async (users: unknown[]) => {
    const res = await apiClient.post("/user/many", users);
    return res.data;
  },
  create: async (
    userData: Record<string, unknown>,
    file: File | null,
  ): Promise<{ message?: string; userId?: string }> => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ user: userData }));
    if (file) {
      formData.append("image", file);
    }
    const res = await apiClient.post<{ message?: string; userId?: string }>(
      "/user",
      formData,
    );
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
  sendResetPassword: async (userId: string) => {
    const res = await apiClient.put(`/user/reset-password/${userId}`);
    return res.data;
  },
};

export const userApi = {
  queries,
  mutations,
};
