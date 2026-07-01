import apiClient from "./axios";

const deleteMany = async (ids: string[]): Promise<void> => {
  const idsQuery = ids.join(",");
  await apiClient.delete(`/group/deleteMany?ids=${idsQuery}`);
};

export const groupMutations = {
  deleteMany,
};
