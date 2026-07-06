import apiClient from "../../lib/axios";

const deleteOne = async (id: string): Promise<void> => {
  await apiClient.delete(`/group/${id}`);
};

const deleteMany = async (ids: string[]): Promise<void> => {
  const idsQuery = ids.join(",");
  await apiClient.delete(`/group/deleteMany?ids=${idsQuery}`);
};

export const groupMutations = {
  deleteOne,
  deleteMany,
};
