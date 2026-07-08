import { useMemo, useState, useCallback, useEffect } from "react";
import useForm from "../../../../../../../src.legacy/components/UI/forms/hooks/use-form";
import useHttp from "../../../../../../../src/hooks/useHttp";
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

  const { resourceId } = useParams();
  const { lessonId } = useParams();

  let id: number | null = null;
  if (resourceId) id = parseInt(resourceId);
  else if (lessonId) id = parseInt(lessonId);

  const { errors, values, onChangeValue } = useForm();
  const data = { values, errors, onChangeValue };

  const { isLoading, sendRequest, uploadProgress } = useHttp();
  const [hasError, setHasError] = useState(false);

  const filesNumber = useMemo(
    () => filesList?.length ?? 0,
    [filesList?.length],
  );

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      let error = !regexGeneric.test(values.name as string);

      if (allowedMimeTypes.includes(event.target.files[0].type)) {
        filesList?.forEach((file) => {
          if (file.file.name === event.target.files![0].name) {
            error = true;
            toast.error("Ce fichier se trouve déjà dans la liste");
          }
        });
        const resource = [
          ...(filesList ?? []),
          {
            name: values.name,
            file: event.target.files[0],
            hasError: error,
          },
        ];
        setFilesList(resource as Resource[]);
        event.target.value = "";
        onChangeValue("name", "");
      } else {
        toast.error(
          "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX, XLS, XLSX, MD",
        );
        return;
      }
    }
  };

  const handleRemoveResource = (index: number) => {
    setFilesList(filesList!.filter((_, i) => i !== index));
  };

  const resetFilesList = useCallback(() => {
    setFilesList(null);
    onChangeValue("name", "");
  }, [onChangeValue]);

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

    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      onCancel(false);
      onSubmit?.();
    };

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

    sendRequest(
      {
        path: `/activity/resource/${id}`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        signal: controller.signal,
      },
      applyData,
    );
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
    data,
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
