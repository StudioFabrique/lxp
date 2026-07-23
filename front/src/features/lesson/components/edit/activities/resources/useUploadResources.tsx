import { useMemo, useState, useCallback, useEffect } from "react";
import { lessonApi } from "../../../../api/lesson.api";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../../../config/constantes";
import { useParams } from "react-router";

export type Resource = {
  name: string;
  file: File;
  hasError: boolean;
};

export const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/markdown",
];

const useUploadResources = (
  onCancel: (value: boolean) => void,
  onSubmit?: () => void,
) => {
  const [filesList, setFilesList] = useState<Resource[] | null>(null);
  const [resourceName, setResourceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { resourceId } = useParams();
  const { lessonId } = useParams();

  let id: number | null = null;
  if (resourceId) id = parseInt(resourceId);
  else if (lessonId) id = parseInt(lessonId);

  const [hasError, setHasError] = useState(false);

  const filesNumber = useMemo(
    () => filesList?.length ?? 0,
    [filesList?.length],
  );

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleFileChange = (selectedFile: File) => {
    let error = !regexGeneric.test(resourceName);

    if (allowedMimeTypes.includes(selectedFile.type)) {
      filesList?.forEach((file) => {
        if (file.file.name === selectedFile.name) {
          error = true;
          toast.error("Ce fichier se trouve déjà dans la liste");
        }
      });
      const resource = [
        ...(filesList ?? []),
        {
          name: resourceName,
          file: selectedFile,
          hasError: error,
        },
      ];
      setFilesList(resource as Resource[]);
      setResourceName("");
    } else {
      toast.error(
        "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX, XLS, XLSX, MD",
      );
      return;
    }
  };

  const handleRemoveResource = (index: number) => {
    setFilesList(filesList!.filter((_, i) => i !== index));
  };

  const resetFilesList = useCallback(() => {
    setFilesList(null);
    setResourceName("");
  }, []);

  const handleSubmit = () => {
    const controller = new AbortController();
    setAbortController(controller);

    const formData = new FormData();

    filesList?.forEach((file) => {
      if (regexGeneric.test(file.name)) {
        formData.append("files", file.file);
      } else {
        toast.error("Le nom de la ressource n'est pas valide");
        return;
      }
    });

    let resources: { label: string; filename: string }[] = [];
    for (const item of filesList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    formData.append(
      "data",
      JSON.stringify({ resources, parent: lessonId ? "lesson" : "resource" }),
    );

    setIsLoading(true);
    setUploadProgress(0);
    lessonApi.mutations
      .uploadResources(id!, formData, controller.signal, (progressEvent: any) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setUploadProgress(progress);
      })
      .then((data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        onCancel(false);
        onSubmit?.();
      })
      .catch((err: any) => {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Une erreur est survenue",
        );
      })
      .finally(() => setIsLoading(false));
  };

  const handleReorder = (
    newList: {
      name: string;
      file: File;
      hasError: boolean;
    }[],
  ) => {
    setFilesList(newList);
  };

  const cancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort();
      resetFilesList();
      onCancel(false);
    }
  }, [abortController, onCancel, resetFilesList]);

  useEffect(() => {
    setHasError(false);
    filesList?.forEach((file) => {
      if (file.hasError) setHasError(true);
    });
  }, [filesList]);

  return {
    resourceName,
    setResourceName,
    filesList,
    filesNumber,
    hasError,
    handleFileChange,
    handleRemoveResource,
    handleReorder,
    handleSubmit,
    isLoading,
    resetFilesList,
    uploadProgress,
    cancelUpload,
  };
};

export default useUploadResources;
