import apiClient from "../../../lib/axios";
import type Parcours from "../../../utils/interfaces/parcours";

const queries = {
  getAll: async (asStudent = false): Promise<Parcours[]> => {
    const path = asStudent ? "/parcours/parcours-as-student" : "/parcours";
    const res = await apiClient.get<Parcours[]>(path);
    return res.data;
  },
  getById: async (id: number): Promise<Parcours> => {
    const res = await apiClient.get<Parcours>(
      `/parcours/parcours-by-id/${id}`,
    );
    return res.data;
  },
  getByFormation: async (formationId: number) => {
    const res = await apiClient.get(
      `/parcours/parcours-by-formation/${formationId}`,
    );
    return res.data;
  },
  getFormations: async () => {
    const res = await apiClient.get("/formation");
    return res.data;
  },
  getTags: async () => {
    const res = await apiClient.get("/tag");
    return res.data;
  },
  getContacts: async () => {
    const res = await apiClient.get("/user/contacts");
    return res.data;
  },
  getStudentsByGroupIds: async (groupIds: string[]) => {
    const res = await apiClient.post("/user/group", groupIds);
    return res.data;
  },
  getStudentGroups: async () => {
    const res = await apiClient.get("/group/student");
    return res.data;
  },
  getModules: async (parcoursId: number) => {
    const res = await apiClient.get(`/modules/${parcoursId}`);
    return res.data;
  },
  getModulesByFormation: async (formationId: number) => {
    const res = await apiClient.get(`/modules/formation/${formationId}/true`);
    return res.data;
  },
  getCoursesByModule: async (moduleId: number) => {
    const res = await apiClient.get(`/course/${moduleId}`);
    return res.data;
  },
};

const mutations = {
  createParcours: async (data: {
    title: string;
    formation: number;
  }): Promise<{ parcoursId: number }> => {
    const res = await apiClient.post("/parcours", data);
    return res.data;
  },
  deleteParcours: async (id: number) => {
    const res = await apiClient.delete(`/parcours/${id}`);
    return res.data;
  },
  duplicateParcours: async (
    id: number,
  ): Promise<{ success: true; parcoursId: number }> => {
    const res = await apiClient.post(`/parcours/duplicate/${id}`);
    return res.data;
  },
  publishParcours: async (id: string, isPublished: boolean) => {
    const res = await apiClient.put(`/parcours/publish/${id}`, {
      isPublished,
    });
    return res.data;
  },
  updateParcoursImage: async (id: string, formData: FormData) => {
    await apiClient.put(`/parcours/update-image/${id}`, formData);
  },
  updateParcoursInfos: async (data: {
    parcoursId: string;
    title: string;
    description?: string;
    formation: string;
  }) => {
    const res = await apiClient.put("/parcours/update-infos", data);
    return res.data;
  },
  updateParcoursDates: async (data: {
    parcoursId: string;
    startDate: string;
    endDate: string;
  }) => {
    const res = await apiClient.put("/parcours/update-dates", data);
    return res.data;
  },
  updateParcoursVirtualClass: async (data: {
    parcoursId: string;
    virtualClass: string;
  }) => {
    const res = await apiClient.put("/parcours/update-virtual-class", data);
    return res.data;
  },
  updateParcoursTags: async (data: {
    parcoursId: number;
    tags: number[];
  }) => {
    const res = await apiClient.put("/parcours/update-tags", data);
    return res.data;
  },
  updateParcoursContacts: async (data: {
    parcoursId: number;
    contacts: unknown[];
  }) => {
    const res = await apiClient.put("/parcours/update-contacts", data);
    return res.data;
  },
  updateParcoursObjectives: async (data: {
    parcoursId: number;
    objectives: string[];
  }) => {
    const res = await apiClient.put("/parcours/update-objectives", data);
    return res.data;
  },
  updateParcoursGroups: async (data: {
    parcoursId: string;
    groupsIds: string[];
  }) => {
    const res = await apiClient.put("/parcours/groups", data);
    return res.data;
  },
  createTags: async (payload: {
    tags: { name: string; color: string }[];
  }) => {
    const res = await apiClient.post("/tag", payload);
    return res.data;
  },
  createTeacher: async (teacher: {
    firstname: string;
    lastname: string;
    email: string;
  }) => {
    const res = await apiClient.post("/user/new-teacher", teacher);
    return res.data;
  },
  deleteObjective: async (id: number) => {
    const res = await apiClient.delete(`/objective/${id}`);
    return res.data;
  },
  updateObjective: async (objective: Record<string, unknown>) => {
    const res = await apiClient.put("/objective", objective);
    return res.data;
  },
  createBonusSkill: async (data: {
    parcoursId: string;
    skill: { description: string; badge?: unknown };
  }) => {
    const res = await apiClient.post("/bonus-skill", data);
    return res.data;
  },
  updateBonusSkill: async (data: {
    skill: { id: number; description: string; badge?: unknown };
  }) => {
    const res = await apiClient.put("/bonus-skill", data);
    return res.data;
  },
  deleteBonusSkill: async (id: number) => {
    const res = await apiClient.delete(`/bonus-skill/${id}`);
    return res.data;
  },
  importSkills: async (data: {
    parcoursId: number;
    skills: { description: string }[];
  }) => {
    const res = await apiClient.post("/bonus-skill/skills", data);
    return res.data;
  },
  createModule: async (formData: FormData) => {
    const res = await apiClient.post("/formation/new-module", formData);
    return res.data;
  },
  deleteModule: async (id: number) => {
    const res = await apiClient.delete(`/modules/${id}`);
    return res.data;
  },
  duplicateModuleByMetadata: async (data: {
    parcoursId: number;
    moduleId: number;
    contactIds: number[];
    skillIds: number[];
    duration: number;
  }) => {
    const res = await apiClient.post("/modules/metadata", data);
    return res.data;
  },
  duplicateModule: async (
    id: number,
    data: {
      duration: number;
      contactsIds: number[];
      skillsIds: number[];
      parcoursId: number;
    },
  ) => {
    const res = await apiClient.post(`/modules/duplicate/${id}`, data);
    return res.data;
  },
  updateModule: async (data: { module: Record<string, unknown> }) => {
    const res = await apiClient.put("/modules/new-module/update/", data);
    return res.data;
  },
  updateModuleCalendarDates: async (data: {
    moduleId: number;
    minDate: string;
    maxDate: string;
  }) => {
    const res = await apiClient.put("/modules/calendar/dates", data);
    return res.data;
  },
  publishCourse: async (id: number) => {
    const res = await apiClient.put(`/course/publish/${id}`);
    return res.data;
  },
};

export const parcoursApi = { queries, mutations };
