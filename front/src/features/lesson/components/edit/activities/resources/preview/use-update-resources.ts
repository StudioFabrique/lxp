import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../../../../src.legacy/hooks/use-http";
import type {
  Activity,
  Resource as ActivityResource,
} from "../../../../../../../../src.legacy/utils/interfaces/activity";
import { useDragAndDrop } from "../../../../../../../../src.legacy/hooks/useDragAndDrop";
import useForm from "../../../../../../../../src.legacy/components/UI/forms/hooks/use-form";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../../../../../src.legacy/utils/constantes";
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
  const { values, errors, onChangeValue } = useForm();
  const [uploadList, setUploadList] = useState<Resource[]>([]);
  const { error, isLoading, sendRequest, uploadProgress } = useHttp();
  const { handleDragEnd, submit, setSubmit } = useDragAndDrop({
    items: resources,
    onReorder: setResources,
  });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<ActivityResource | null>(null);

  const data = { values, errors, onChangeValue };

  const handleUpdateResource = (value: string, id: number) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      data: ActivityResource;
    }) => {
      if (data.success) {
        setResources((prevState) =>
          prevState.map((resource) =>
            resource.id === data.data.id ? data.data : resource,
          ),
        );
      }
      setIsUpdating(null);
      onSubmit?.();
    };

    sendRequest(
      {
        path: `/activity/resource/${id}`,
        method: "put",
        body: { label: value },
      },
      applyData,
    );
  };

  const handleReorderResources = useCallback(() => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      if (timer) clearTimeout(timer);
      onSubmit?.();
    };

    timer = setTimeout(() => {
      sendRequest(
        {
          path: `/activity/reorder-resource/${activity.id}`,
          method: "put",
          body: {
            activitiesIds: resources.map((resource) => resource.id),
            parent,
          },
        },
        applyData,
      );
    }, 1000);
  }, [sendRequest, resources, activity.id, onSubmit, parent]);

  const getResources = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      resources: ActivityResource[];
    }) => {
      if (data.success) setResources(data.resources);
    };
    sendRequest(
      { path: `/activity/resources/${activity.id}/${parent}` },
      applyData,
    );
  }, [activity.id, sendRequest, parent]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      let error = !regexGeneric.test(values.name as string);

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
            if (resource.label === values.name) {
              error = true;
              toast.error("Une ressource avec ce nom existe déjà");
            }
          });
        }

        const resource = [
          ...(uploadList ?? []),
          {
            name: values.name,
            file: event.target.files[0],
            hasError: error,
          },
        ];
        setUploadList(resource as Resource[]);

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

    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      setUploadList([]);
      toast.success(data.message);
      handleCancel();
      getResources();
      onSubmit?.();
    };

    let resources: { label: string; filename: string }[] = [];
    for (const item of uploadList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    formData.append("data", JSON.stringify(resources));

    sendRequest(
      {
        path: `/activity/add-resource/${activity.id}/${parent}`,
        method: "put",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
      applyData,
    );
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
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setIsDeleting(null);
        setResources((prevState) =>
          prevState.filter((resource) => resource.id !== isDeleting),
        );
      };
      sendRequest(
        { path: `/activity/activity-resource/${isDeleting}`, method: "delete" },
        applyData,
      );
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
    data,
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
