import apiClient from "../../../lib/axios";

const getSetupStatus = async (): Promise<{ hasAdmins: boolean }> => {
  const res = await apiClient.get("/auth/setup-status");
  return res.data;
};

const verifyActivationToken = async (
  token: string,
): Promise<{ valid: boolean }> => {
  const res = await apiClient.post("/auth/verify-activation-token", { token });
  return res.data;
};

const createFirstAdmin = async (data: {
  token: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.post("/auth/first-admin", data);
  return res.data;
};

export const onboardingApi = {
  getSetupStatus,
  verifyActivationToken,
  createFirstAdmin,
};
