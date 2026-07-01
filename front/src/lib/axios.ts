import axios from "axios";
import { BASE_API_URL } from "../config/urls";

// Création de l'instance Axios globale avec la configuration de base
const apiClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

// Intercepteur de requête
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Gestionnaire de déconnexion
let logoutHandler: (() => void) | null = null;

export const injectLogout = (fn: () => void) => {
  logoutHandler = fn;
};

const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  } else {
    console.warn("Logout handler non injecté dans l'instance Axios.");
  }
};

// Intercepteur de réponse du Refresh Token automatique (403)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cas A : Le 403 provient de la route de rafraîchissement elle-même -> Déconnexion immédiate
    if (
      error.response?.status === 403 &&
      originalRequest.url === `${BASE_API_URL}/auth/refresh`
    ) {
      triggerLogout();
      return Promise.reject(error);
    }

    // Cas B : Le 403 provient d'une autre route -> Ttente un refresh token une seule fois
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${BASE_API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue (ex: refresh token expiré), déconnection
        triggerLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
