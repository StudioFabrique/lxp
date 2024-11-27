/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../store/context.store";
import { BASE_URL } from "../config/urls";
import toast from "react-hot-toast";

const useHttp = (invokeErrorToast?: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const { logout } = useContext(Context);

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

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 403 &&
          originalRequest.url === `${BASE_URL}/auth/refresh`
        ) {
          logout();
          return Promise.reject(error);
        }

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          const res = await axiosInstance.get(`${BASE_URL}/auth/refresh`);
          if (res.status === 200) {
            return axiosInstance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

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
        onUploadProgress?: (progress: number) => void;
        onDownloadProgress?: (progress: number) => void;
        signal?: AbortSignal;
      },
      applyData?: (data: any) => void
    ) => {
      setIsLoading(true);
      setError("");
      let response: any;

      try {
        const config = {
          headers: req.headers,
          onUploadProgress: (event: import("axios").AxiosProgressEvent) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total ?? 0)
            );
            setUploadProgress(progress);
            req.onUploadProgress?.(progress);
          },
          onDownloadProgress: (event: import("axios").AxiosProgressEvent) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total ?? 0)
            );
            setDownloadProgress(progress);
            req.onDownloadProgress?.(progress);
          },
        };

        switch (req.method) {
          case "post":
            response = await axiosInstance.post(
              `${BASE_URL}${req.path}`,
              req.body,
              config
            );
            break;
          case "put":
            response = await axiosInstance.put(
              `${BASE_URL}${req.path}`,
              req.body,
              config
            );
            break;
          case "delete":
            response = await axiosInstance.delete(
              `${BASE_URL}${req.path}`,
              config
            );
            break;
          default:
            response = await axiosInstance.get(
              `${BASE_URL}${req.path}`,
              config
            );
            break;
        }

        if (applyData) {
          applyData(response.data);
        } else {
          return response.data;
        }
      } catch (err: any) {
        setError(err.response?.data.message ?? "Erreur inconnue");

        if (err.response?.status === 403) {
          logout();
        }
      } finally {
        setIsLoading(false);
        setUploadProgress(null);
        setDownloadProgress(null);
      }
    },
    [logout, axiosInstance]
  );

  return {
    isLoading,
    error,
    sendRequest,
    uploadProgress,
    downloadProgress,
    axiosInstance,
  };
};

export default useHttp;
