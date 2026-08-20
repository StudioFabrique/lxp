import apiClient from "../../../lib/axios";
import type Role from "../../../utils/interfaces/role";

export type PermissionItem = {
  name: string;
  fullName: string;
  description?: string;
  isRole?: boolean;
};

export type PermissionTypes = "read" | "write" | "update" | "delete";

export type Permissions = Record<PermissionTypes, PermissionItem[]>;

export type RolePermissionsResponse = {
  permissions: string[];
  ressources: {
    ressources: { name: string; description: string }[];
    roles: string[];
  };
  role: Role;
};

export type RoleCounts = {
  _id: string;
  role: string;
  label: string;
  rank: number;
  protection: number;
  countRead: number;
  countWrite: number;
  countUpdate: number;
  countDelete: number;
};

const queries = {
  listRoles: async (searchValue?: string) => {
    const path = searchValue
      ? `/permission/search/role/${searchValue}`
      : "/permission/role";
    const res = await apiClient.get(path);
    return res.data.data;
  },
  getPermissions: async (id: string): Promise<RolePermissionsResponse> => {
    const res = await apiClient.get(`/permission/resources/id/${id}`);
    return res.data.data;
  },
};

const mutations = {
  deleteOne: async (id: string): Promise<void> => {
    await apiClient.delete(`/permission/role/${id}`);
  },
  deleteMany: async (ids: string[]): Promise<void> => {
    const idsQuery = ids.join(",");
    await apiClient.delete(`/permission/roles/?ids=${idsQuery}`);
  },
  createRole: async (body: {
    role: string;
    label: string;
    rank: number;
  }): Promise<{ message: string }> => {
    const res = await apiClient.post("/permission/role", body);
    return res.data;
  },
  updateRole: async (
    id: string,
    body: { role: string; label: string; rank: number },
  ): Promise<{ message: string }> => {
    const res = await apiClient.put(`/permission/role/${id}`, body);
    return res.data;
  },
  addPermission: async (roleId: string, name: string): Promise<void> => {
    await apiClient.post(`/permission/role/${roleId}/permission/${name}`);
  },
  deletePermission: async (roleId: string, name: string): Promise<void> => {
    await apiClient.delete(`/permission/role/${roleId}/permission/${name}`);
  },
  resetPermissions: async (roleId: string): Promise<void> => {
    await apiClient.put(`/permission/role/${roleId}/reset`);
  },
};

export const roleApi = { queries, mutations };
