import apiClient from "../../../lib/axios";

type CreateRootResponse = {
  success: boolean;
  pendingActivation?: boolean;
  message: string;
};

const getSetupStatus = async (): Promise<{
  hasAdmins: boolean;
  activationTokenTtlMinutes: number;
  /** Identifiant du conteneur applicatif, servi tant qu'aucun admin n'existe. */
  containerId?: string;
}> => {
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
  themeMode?: "light" | "dark";
}): Promise<CreateRootResponse> => {
  const res = await apiClient.post("/auth/first-admin", data);
  return res.data;
};

const createRootAccount = async (data: {
  token: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  themeMode?: "light" | "dark";
}): Promise<CreateRootResponse> => {
  const res = await apiClient.post("/auth/root-account", data);
  return res.data;
};

type ConfirmEmailResult = { success: boolean; email: string; message: string };

// Le jeton est à usage unique : une requête par jeton, partagée entre les
// montages successifs (React StrictMode exécute l'effet deux fois en dev, le
// second appel recevrait « lien déjà utilisé »).
const confirmEmailRequests = new Map<string, Promise<ConfirmEmailResult>>();

const confirmEmail = (token: string): Promise<ConfirmEmailResult> => {
  const pending = confirmEmailRequests.get(token);
  if (pending) return pending;

  const request = apiClient
    .post("/auth/confirm-email", { token })
    .then((res) => res.data as ConfirmEmailResult);
  confirmEmailRequests.set(token, request);
  return request;
};

export const onboardingApi = {
  getSetupStatus,
  verifyActivationToken,
  createFirstAdmin,
  createRootAccount,
  confirmEmail,
};
