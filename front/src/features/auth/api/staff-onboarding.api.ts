import apiClient from "../../../lib/axios";

export const staffOnboardingApi = {
  get: async (): Promise<{ required: boolean }> =>
    (await apiClient.get("/user/profile/staff-onboarding")).data,
  complete: async (): Promise<{ required: boolean }> =>
    (await apiClient.put("/user/profile/staff-onboarding")).data,
};
