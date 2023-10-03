import { useCallback, useContext, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../store/context.store";
import { BASE_URL } from "../config/urls";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useContext(Context);

  const axiosInstance = useMemo(() => {
    return axios.create({ withCredentials: true });
  }, []);

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
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

      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        const res = await axiosInstance.get(`${BASE_URL}/auth/refresh`);
        if (res.status === 200) {
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

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
        applyData!(response.data);
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
