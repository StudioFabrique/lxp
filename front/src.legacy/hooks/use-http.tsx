/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
// Assure-toi que le chemin d'importation correspond à l'emplacement de ton fichier lib
import apiClient, { injectLogout } from "../lib/axios";
import { AuthContext } from "../../src/store/AuthProvider";

const useHttp = (invokeErrorToast?: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const { logout } = useContext(AuthContext);

  // On injecte la fonction de déconnexion dans l'instance globale
  useEffect(() => {
    if (logout) {
      injectLogout(logout);
    }
  }, [logout]);

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
      applyData?: (data: any) => void,
    ) => {
      setIsLoading(true);
      setError("");
      let response: any;

      try {
        const config = {
          headers: req.headers,
          signal: req.signal, // Prise en compte de l'AbortSignal
          onUploadProgress: (event: import("axios").AxiosProgressEvent) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total ?? 1), // Remplacement de 0 par 1 pour éviter division par 0
            );
            setUploadProgress(progress);
            req.onUploadProgress?.(progress);
          },
          onDownloadProgress: (event: import("axios").AxiosProgressEvent) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total ?? 1),
            );
            setDownloadProgress(progress);
            req.onDownloadProgress?.(progress);
          },
        };

        // apiClient gère déjà le BASE_API_URL, on passe juste req.path
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
        } else {
          return response.data;
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message ?? "Erreur inconnue";
        setError(errorMessage);

        // Déclencher le toast
        console.log(
          "useHttp catch - invokeErrorToast:",
          invokeErrorToast,
          "errorMessage:",
          errorMessage,
        );
        if (invokeErrorToast) {
          toast.error(errorMessage);
        }

        // Remarque : Le fallback de déconnexion locale (403) a été retiré ici,
        // car l'intercepteur de apiClient appelle déjà triggerLogout() en cas d'échec de refresh.
      } finally {
        setIsLoading(false);
        setUploadProgress(null);
        setDownloadProgress(null);
      }
    },
    [invokeErrorToast], // Plus besoin d'écouter axiosInstance ou logout ici
  );

  return {
    isLoading,
    error,
    sendRequest,
    uploadProgress,
    downloadProgress,
    apiClient, // Tu peux retourner l'instance globale si un composant a besoin d'un accès direct
  };
};

export default useHttp;
