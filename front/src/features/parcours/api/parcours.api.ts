import apiClient from "../../../lib/axios";
import type Parcours from "../../../utils/interfaces/parcours";
import type Skill from "../../../utils/interfaces/skill";

export type UpdateParcoursPayload = Partial<{
  title: string;
  description: string | null;
  formationId: number;
  startDate: string | null;
  endDate: string | null;
  virtualClass: string | null;
  tagIds: number[];
  contactIds: number[];
  objectives: string[];
}>;

export type UpdateParcoursResponse = {
  success: true;
  message: string;
  parcours: Pick<
    Parcours,
    | "id"
    | "title"
    | "description"
    | "startDate"
    | "endDate"
    | "virtualClass"
    | "formation"
    | "tags"
    | "contacts"
    | "objectives"
  >;
};

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
  updateParcours: async (
    id: number,
    data: UpdateParcoursPayload,
  ): Promise<UpdateParcoursResponse> => {
    const res = await apiClient.patch<UpdateParcoursResponse>(
      `/parcours/${id}`,
      data,
    );
    return res.data;
  },
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
  }): Promise<{ success: true; skill: Skill }> => {
    const res = await apiClient.post("/bonus-skill", data);
    return res.data;
  },
  updateBonusSkill: async (data: {
    skill: { id: number; description: string; badge?: unknown };
  }): Promise<{ success: true; message: string; updatedSkill: Skill }> => {
    const res = await apiClient.put("/bonus-skill", data);
    return res.data;
  },
  deleteBonusSkill: async (id: number): Promise<{ success: true }> => {
    const res = await apiClient.delete(`/bonus-skill/${id}`);
    return res.data;
  },
  importSkills: async (data: {
    parcoursId: number;
    skills: { description: string }[];
  }): Promise<{ success: true; skills: Skill[] }> => {
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
  updateModule: async (data: FormData) => {
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
