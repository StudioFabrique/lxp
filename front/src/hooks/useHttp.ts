import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient, { injectLogout } from "../lib/axios";
import { AuthContext } from "../store/AuthProvider";

const useHttp = (invokeErrorToast?: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if (logout) {
      injectLogout(logout);
    }
  }, [logout]);

  const sendRequest = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      applyData?: (data: any) => void,
    ) => {
      setIsLoading(true);
      setError("");

      try {
        const config = {
          headers: req.headers,
          signal: req.signal,
          onUploadProgress: (event: { loaded: number; total?: number }) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total ?? 1),
            );
            setUploadProgress(progress);
            req.onUploadProgress?.(progress);
          },
          onDownloadProgress: (event: { loaded: number; total?: number }) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total ?? 1),
            );
            setDownloadProgress(progress);
            req.onDownloadProgress?.(progress);
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let response: any;

        switch (req.method) {
          case "post":
            response = await apiClient.post(req.path, req.body, config);
            break;
          case "put":
            response = await apiClient.put(req.path, req.body, config);
            break;
          case "delete":
            response = await apiClient.delete(req.path, config);
            break;
          case "get":
          default:
            response = await apiClient.get(req.path, config);
            break;
        }

        if (applyData) {
          return applyData(response.data);
        }
        return response.data;
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Erreur inconnue";
        setError(errorMessage);

        if (invokeErrorToast) {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
        setUploadProgress(null);
        setDownloadProgress(null);
      }
    },
    [invokeErrorToast],
  );

  return {
    isLoading,
    error,
    sendRequest,
    uploadProgress,
    downloadProgress,
    apiClient,
  };
};

export default useHttp;
