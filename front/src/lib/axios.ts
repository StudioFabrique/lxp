import axios from "axios";
import { BASE_API_URL } from "../config/urls";

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

let logoutHandler: (() => void) | null = null;
let abilityResyncHandler: ((user: unknown) => void) | null = null;
let refreshPromise: Promise<void> | null = null;
let resyncPromise: Promise<void> | null = null;

export const injectLogout = (handler: () => void) => {
  logoutHandler = handler;
};

export const injectAbilityResync = (handler: (user: unknown) => void) => {
  abilityResyncHandler = handler;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const status = error.response?.status;
    const url = String(request?.url || "");
    const isRefresh = url.includes("/auth/refresh");
    const isLogin = url.includes("/auth/login");

    if (status === 401 && isRefresh) {
      logoutHandler?.();
      return Promise.reject(error);
    }

    if (status === 401 && !isLogin && !request?._retry) {
      request._retry = true;
      refreshPromise ??= axios
        .get(`${BASE_API_URL}/auth/refresh`, { withCredentials: true })
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });

      try {
        await refreshPromise;
        return apiClient(request);
      } catch (refreshError) {
        logoutHandler?.();
        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && !isLogin && !url.includes("/auth/handshake")) {
      resyncPromise ??= axios
        .get(`${BASE_API_URL}/auth/handshake`, { withCredentials: true })
        .then((response) => {
          abilityResyncHandler?.(response.data);
        })
        .catch(() => undefined)
        .finally(() => {
          resyncPromise = null;
        });
      await resyncPromise;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
