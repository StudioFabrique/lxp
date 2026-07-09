import apiClient from "../../../lib/axios";

const checkEmail = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.post("/user/check-email", { email });
  return res.data;
};

const checkInvitation = async (
  token: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.post("/user/check-invitation", { token });
  return res.data;
};

const activateAccount = async (
  token: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.post("/user/activate", { token, password });
  return res.data;
};

export const accountApi = {
  checkEmail,
  checkInvitation,
  activateAccount,
};
