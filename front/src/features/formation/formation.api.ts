import apiClient from "../../lib/axios";
import type FormationItem from "../../utils/interfaces/formation-item";
import type Tag from "../../utils/interfaces/tag";

const getTags = async (): Promise<Tag[]> => {
  const res = await apiClient.get("/tag");
  return res.data;
};

const createTags = async (
  tags: { name: string; color: string }[],
): Promise<Tag[]> => {
  const res = await apiClient.post("/tag", { tags });
  return res.data;
};

const getFormationList = async (): Promise<FormationItem[]> => {
  const res = await apiClient.get("/formation/list");
  return res.data.response;
};

const createFormation = async (body: {
  title: string;
  description?: string;
  code?: string;
  level: string;
  tags: number[];
}): Promise<FormationItem> => {
  const res = await apiClient.post("/formation", body);
  return res.data.response;
};

const updateFormation = async (
  id: number,
  body: {
    title: string;
    description?: string;
    code?: string;
    level: string;
    tags: number[];
  },
): Promise<FormationItem> => {
  const res = await apiClient.put(`/formation/${id}`, { formation: body });
  return res.data.response;
};

export const formationApi = {
  getTags,
  createTags,
  getFormationList,
  createFormation,
  updateFormation,
};
