import apiClient from "../../../lib/axios";

export type CompanyLogoResponse = { message: string };

const queries = {
  getInformation: async () => {
    const res = await apiClient.get("/user/profile/information");
    return res.data;
  },
  getAccomplishments: async () => {
    const res = await apiClient.get("/user/my-accomplishment");
    return res.data;
  },
};

const mutations = {
  updateInformation: async (payload: FormData) => {
    const res = await apiClient.put("/user/profile/information", payload);
    return res.data;
  },
  updatePassword: async (payload: { oldPass: string; newPass: string }) => {
    const res = await apiClient.put("/user/profile/password", payload);
    return res.data;
  },

  // Le logo et la couleur de fond sont portés par le même endpoint : la
  // couleur voyage dans le `FormData`, aux côtés du fichier quand il y en a un.
  saveCompanyLogo: async (payload: FormData): Promise<CompanyLogoResponse> => {
    const res = await apiClient.post<CompanyLogoResponse>(
      "/company-logo",
      payload,
    );
    return res.data;
  },
  deleteCompanyLogo: async (): Promise<CompanyLogoResponse> => {
    const res = await apiClient.delete<CompanyLogoResponse>("/company-logo");
    return res.data;
  },
};

export const profileApi = { queries, mutations };
