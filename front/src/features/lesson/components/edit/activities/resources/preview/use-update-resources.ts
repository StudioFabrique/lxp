import { useCallback, useEffect, useState } from "react";
import { lessonApi } from "../../../../../api/lesson.api";
import type {
  Activity,
  Resource as ActivityResource,
} from "../../../../../../../../src/utils/interfaces/activity";
import { useDragAndDrop } from "../../../../../../../../src/hooks/useDragAndDrop";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../../../../config/constantes";
import { allowedMimeTypes, Resource } from "../useUploadResources";

let timer: NodeJS.Timeout | null = null;

const useUpdateResources = (
  activity: Activity,
  onCancel: () => void,
  parent: "lesson" | "resource" = "lesson",
  onSubmit?: () => void,
) => {
  const [resources, setResources] = useState<ActivityResource[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [uploadList, setUploadList] = useState<Resource[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { handleDragEnd, submit, setSubmit } = useDragAndDrop({
    items: resources,
    onReorder: setResources,
  });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<ActivityResource | null>(null);

  const handleUpdateResource = (value: string, id: number) => {
    lessonApi.mutations.updateResource(id, value).then((data: { success: boolean; message: string; data: any }) => {
      if (data.success) {
        setResources((prevState) =>
          prevState.map((resource) =>
            resource.id === data.data.id ? data.data : resource,
          ),
        );
      }
      setIsUpdating(null);
      onSubmit?.();
    });
  };

  const handleReorderResources = useCallback(() => {
    timer = setTimeout(() => {
      lessonApi.mutations
        .reorderResources(
          activity.id,
          resources.map((resource) => resource.id),
          parent,
        )
        .then((data: { success: boolean; message: string }) => {
          if (data.success) toast.success(data.message);
          if (timer) clearTimeout(timer);
          onSubmit?.();
        });
    }, 1000);
  }, [resources, activity.id, onSubmit, parent]);

  const getResources = useCallback(() => {
    lessonApi.queries
      .getResources(activity.id, parent)
      .then((data: { success: boolean; resources: any[] }) => {
        if (data.success) setResources(data.resources);
      });
  }, [activity.id, parent]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      let error = !regexGeneric.test(resourceName);

      if (allowedMimeTypes.includes(event.target.files[0].type)) {
        uploadList?.forEach((file) => {
          if (file.file.name === event.target.files![0].name) {
            error = true;
            toast.error("Ce fichier se trouve déjà dans la liste");
          }
        });

        if (
          activity.resourceActivities &&
          activity.resourceActivities.length > 0
        ) {
          activity.resourceActivities.forEach((resource) => {
            if (resource.label === resourceName) {
              error = true;
              toast.error("Une ressource avec ce nom existe déjà");
            }
          });
        }

        const resource = [
          ...(uploadList ?? []),
          {
            name: resourceName,
            file: event.target.files[0],
            hasError: error,
          },
        ];
        setUploadList(resource as Resource[]);

        event.target.value = "";
        setResourceName("");
      } else {
        toast.error(
          "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX, XLS, XLSX, MD",
        );
        return;
      }
    }
  };

  const handleAddResource = () => {
    const formData = new FormData();

    uploadList?.forEach((file) => {
      if (regexGeneric.test(file.name)) {
        formData.append("files", file.file);
      } else {
        toast.error("Le nom de la ressource n'est pas valide");
        return;
      }
    });

    let resources: { label: string; filename: string }[] = [];
    for (const item of uploadList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    formData.append("data", JSON.stringify(resources));

    setIsLoading(true);
    setUploadProgress(0);
    lessonApi.mutations
      .addResources(activity.id, parent, formData, (progressEvent: any) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setUploadProgress(progress);
      })
      .then((data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setUploadList([]);
        toast.success(data.message);
        handleCancel();
        getResources();
        onSubmit?.();
      })
      .catch((err: any) => {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Une erreur est survenue",
        );
      })
      .finally(() => setIsLoading(false));
  };

  const handleCancel = () => {
    setIsAdding(false);
    onCancel();
  };

  const handleRemoveFromUploadList = (indexToRemove: number) => {
    setUploadList((prevState) =>
      prevState.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSetResourceToDelete = (id: number) => {
    setIsDeleting(id);
  };

  const handleCancelDelete = () => {
    setIsDeleting(null);
  };

  const handleDeleteResource = () => {
    if (isDeleting) {
      lessonApi.mutations.deleteResource(isDeleting).then((data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setIsDeleting(null);
        setResources((prevState) =>
          prevState.filter((resource) => resource.id !== isDeleting),
        );
      });
    }
  };

  const handleReorder = (
    newList: {
      name: string;
      file: File;
      hasError: boolean;
    }[],
  ) => {
    setUploadList(newList);
  };

  useEffect(() => {
    getResources();
  }, [getResources]);

  useEffect(() => {
    if (submit) {
      handleReorderResources();
      setSubmit(false);
    }
  }, [submit, handleReorderResources, setSubmit]);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
    setSubmit(false);
    if (timer) clearTimeout(timer);
  }, [error, setSubmit]);

  return {
    resourceName,
    setResourceName,
    handleAddResource,
    handleCancel,
    handleCancelDelete,
    handleDeleteResource,
    handleDragEnd,
    handleFileChange,
    handleRemoveFromUploadList,
    handleReorder,
    handleSetResourceToDelete,
    handleUpdateResource,
    isAdding,
    isDeleting,
    isLoading,
    isUpdating,
    resources,
    setIsAdding,
    setIsUpdating,
    setUploadList,
    uploadList,
    uploadProgress,
  };
};

export default useUpdateResources;
