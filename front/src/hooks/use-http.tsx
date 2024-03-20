/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../store/context.store";
import { BASE_URL } from "../config/urls";
import toast from "react-hot-toast";

const useHttp = (invokeErrorToast?: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useContext(Context);

  /** implémentation de l'intercepteur, une seule instance de l'intercepteur
   *  est crée durant le cycle de vie de ce composant
   */
  const axiosInstance = useMemo(() => {
    return axios.create({ withCredentials: true });
  }, []);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // gestion du rafraîchissement des tokens
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;

        if (
          error.response.status === 403 &&
          originalRequest.url === `${BASE_URL}/auth/refresh`
        ) {
          logout();
          return Promise.reject(error);
        }

        /**
         * ici on vérifie qu'en cas d'erreur 403 ce soit la première fois
         * qu'on tente de rafraichir la requete. Si c'est la première
         * tentative on notifie que la prochaine tentative ne sera plus
         * la premiere fois.
         * Si c'est la première fois on tente de refresh les tokens
         */
        if (error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          const res = await axiosInstance.get(`${BASE_URL}/auth/refresh`);
          if (res.status === 200) {
            // si les tokens sont refresh avec succes on relance la
            return axiosInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    // nettoyage de la mémoire lors du démontage du composant
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance, logout]);

  useEffect(() => {
    if (invokeErrorToast && error.length > 0) {
      toast.error(error);
    }
  }, [error, invokeErrorToast]);

  const sendRequest = useCallback(
    async (
      req: {
        path: string;
        body?: any;
        headers?: any;
        method?: "get" | "post" | "put" | "delete";
      },
      applyData?: (data: any) => void
    ) => {
      setIsLoading(true);
      setError("");
      let response: any;
      try {
        switch (req.method) {
          case "post":
            response = await axiosInstance.post(
              `${BASE_URL}${req.path}`,
              req.body,
              {
                headers: req.headers,
              }
            );
            break;
          case "put":
            response = await axiosInstance.put(
              `${BASE_URL}${req.path}`,
              req.body,
              {}
            );
            break;
          case "delete":
            response = await axiosInstance.delete(`${BASE_URL}${req.path}`, {});
            break;
          default:
            response = await axiosInstance.get(`${BASE_URL}${req.path}`, {});
            break;
        }
        if (applyData) {
          applyData(response.data);
        } else {
          return response.data;
        }
      } catch (err: any) {
        setError(err.response?.data.message ?? "erreur inconnue");

        if (err.response?.status === 403) {
          logout();
        }
      }
      setIsLoading(false);
    },
    [logout, axiosInstance]
  );

  return { isLoading, error, sendRequest, axiosInstance };
};

export default useHttp;
