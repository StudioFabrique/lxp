import apiClient from "./axios";

// Utilisé pour tes "mutations" (création, modification, suppression)
export const deleteManyGroups = async (ids: string[]): Promise<void> => {
  const idsQuery = ids.join(",");
  await apiClient.delete(`/group/deleteMany?ids=${idsQuery}`);
};

export const deleteUserFromGroup = async (
  groupId: string,
  userId: string,
): Promise<void> => {
  await apiClient.delete(`/group/user/${groupId}/${userId}`);
};
