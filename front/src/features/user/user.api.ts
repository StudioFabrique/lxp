import apiClient from "../../lib/axios";
import type User from "../../utils/interfaces/user";

const create = async (userData: Record<string, unknown>, file: File | null) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ user: userData }));
  if (file) {
    formData.append("image", file);
  }
  const res = await apiClient.post("/user", formData);
  return res.data;
};

const update = async (
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
};

const deleteOne = async (id: string) => {
  const res = await apiClient.delete(`/user/${id}`);
  return res.data;
};

const updateUserStatus = async (id: string, value: boolean) => {
  const res = await apiClient.put("/user/update-user-status", {
    userId: id,
    value,
  });
  return res.data;
};

const updateManyStatus = async (ids: string[], status: string) => {
  const res = await apiClient.put("/user/update-many-status", {
    usersIds: ids,
    status,
  });
  return res.data;
};

const updateUserRoles = async (userIds: string[], roleIds: string[]) => {
  const res = await apiClient.put("/user/user-roles", {
    usersToUpdate: userIds,
    rolesId: roleIds,
  });
  return res.data;
};

const sendInvitation = async (userId: string) => {
  const res = await apiClient.put(`/user/invitation/${userId}`);
  return res.data;
};

const sendManyInvitations = async (userIds: string[]) => {
  const res = await apiClient.post("/user/invitations", { userIds });
  return res.data;
};

const getUserData = async (id: string): Promise<{ user: User }> => {
  const res = await apiClient.get(`/user/data/${id}`);
  return res.data;
};

export const userMutations = {
  create,
  update,
  deleteOne,
  updateUserStatus,
  updateManyStatus,
  updateUserRoles,
  sendInvitation,
  sendManyInvitations,
};

export const userQueries = {
  getUserData,
};
