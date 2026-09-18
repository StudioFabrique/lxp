import apiClient from "../../../lib/axios";
import type Skill from "../../../utils/interfaces/skill";

export type InstanceLogoResponse = { message: string };
export type InstanceSettings = {
  name: string;
  setupCompleted: boolean;
  hasLogo: boolean;
  defaultTheme: string;
  welcomeTitles: {
    admin: string;
    teacher: string;
    student: string;
  };
  welcomeMessages: {
    admin: string;
    teacher: string;
    student: string;
  };
};

const queries = {
  getInformation: async () => {
    const res = await apiClient.get("/user/profile/information");
    return res.data;
  },
  getAccomplishments: async () => {
    const res = await apiClient.get("/user/my-accomplishment");
    return res.data;
  },
  getSkills: async (): Promise<Skill[]> => {
    const res = await apiClient.get<{ data: Skill[] }>("/user/profile/skills");
    return res.data.data;
  },
  getInstanceSettings: async (): Promise<InstanceSettings> => {
    const res = await apiClient.get<InstanceSettings>("/instance-settings");
    return res.data;
  },
};

const mutations = {
  updateInformation: async (payload: FormData) => {
    const res = await apiClient.put("/user/profile/information", payload);
    return res.data;
  },
  deleteAvatar: async () => {
    const res = await apiClient.delete("/user/profile/avatar");
    return res.data;
  },
  updatePassword: async (payload: { oldPass: string; newPass: string }) => {
    const res = await apiClient.put("/user/profile/password", payload);
    return res.data;
  },
  promoteToRoot: async (token: string) => {
    const res = await apiClient.post("/auth/promote-root", { token });
    return res.data;
  },

  // Le logo et la couleur de fond sont portés par le même endpoint : la
  // couleur voyage dans le `FormData`, aux côtés du fichier quand il y en a un.
  saveInstanceLogo: async (payload: FormData): Promise<InstanceLogoResponse> => {
    const res = await apiClient.post<InstanceLogoResponse>(
      "/instance-logo",
      payload,
    );
    return res.data;
  },
  deleteInstanceLogo: async (): Promise<InstanceLogoResponse> => {
    const res = await apiClient.delete<InstanceLogoResponse>("/instance-logo");
    return res.data;
  },
  updateInstanceSettings: async (
    payload: FormData,
  ): Promise<InstanceSettings> => {
    const res = await apiClient.put<InstanceSettings>(
      "/instance-settings",
      payload,
    );
    return res.data;
  },
};

export const profileApi = { queries, mutations };
