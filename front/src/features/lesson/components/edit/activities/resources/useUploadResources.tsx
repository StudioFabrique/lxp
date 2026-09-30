import { useState, useCallback } from "react";
import { lessonApi } from "../../../../api/lesson.api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AxiosProgressEvent } from "axios";
import { documentSchema, documentsSchema, type DocumentValues } from "../../../../document.schema";
import { useFormField } from "../../../../../../components/form/useFormField";
import { showFormErrors } from "../../../../../../components/form/form-errors";
import { getApiErrorMessage } from "../../../../../../utils/helpers/api-error-message";
import { useParams } from "react-router";

export type Resource = DocumentValues;
export { allowedMimeTypes } from "../../../../document.schema";

const useUploadResources = (
  onCancel: (value: boolean) => void,
  onSubmit?: () => void,
  parentId?: number,
  parent: "lesson" | "resource" = "lesson",
  onSaved?: () => void | Promise<void>,
  title?: string,
) => {
  const form = useForm<z.infer<typeof documentsSchema>>({ resolver: zodResolver(documentsSchema), defaultValues: { files: [] } });
  const { setValue } = form;
  const filesList = form.watch("files");
  const setFilesList = useCallback((files: Resource[]) => setValue("files", files, { shouldDirty: true, shouldValidate: true }), [setValue]);
  const draft = useForm({ resolver: zodResolver(documentSchema.pick({ name: true })), defaultValues: { name: "" } });
  const [resourceName, setResourceName] = useFormField(draft, "name");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { resourceId } = useParams();
  const { lessonId } = useParams();

  let id: number | null = parentId ?? null;
  if (id === null && parent === "resource" && resourceId)
    id = parseInt(resourceId);
  else if (id === null && parent === "lesson" && lessonId)
    id = parseInt(lessonId);

  const hasError = filesList.length > 0 && !documentsSchema.safeParse({ files: filesList }).success;
  const filesNumber = filesList.length;

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleFileChange = (selectedFile: File) => {
    const result = documentSchema.safeParse({ name: resourceName, file: selectedFile, hasError: false });
    if (!result.success) { toast.error(result.error.issues[0].message); return; }
    if (filesList.some(({ file }) => file.name === selectedFile.name)) {
      toast.error("Ce fichier se trouve déjà dans la liste"); return;
    }
    setFilesList([...filesList, result.data]);
    draft.reset({ name: "" });
  };

  const handleRemoveResource = (index: number) => {
    setFilesList(filesList.filter((_, i) => i !== index));
  };

  const resetFilesList = useCallback(() => {
    setFilesList([]);
    setResourceName("");
  }, [setFilesList, setResourceName]);

  const handleSubmit = form.handleSubmit(async ({ files }) => {
    if (isLoading) return;
    const controller = new AbortController();
    setAbortController(controller);
    const formData = new FormData();
    files.forEach(({ file }) => formData.append("files", file));
    const resources = files.map(({ name, file }) => ({ label: name, filename: file.name }));
    formData.append("data", JSON.stringify({ resources, parent, title }));

    if (id === null) {
      toast.error("Impossible d'identifier le parent des ressources.");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    await lessonApi.mutations
      .uploadResources(id, formData, controller.signal, (progressEvent: AxiosProgressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1),
        );
        setUploadProgress(progress);
      })
      .then((data: { success: boolean; message: string }) => {
        if (!data.success) return;
        toast.success(data.message);
        if (onSaved) {
          return onSaved();
        }
        onCancel(false);
        onSubmit?.();
      })
      .catch((err: unknown) => toast.error(getApiErrorMessage(err, "Une erreur est survenue")))
      .finally(() => setIsLoading(false));
  }, showFormErrors);

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
