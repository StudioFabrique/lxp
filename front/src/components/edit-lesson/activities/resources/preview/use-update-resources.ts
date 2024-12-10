import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../hooks/use-http";
import Activity, {
  Resource as ActivityResource,
} from "../../../../../utils/interfaces/activity";
import { useDragAndDrop } from "../../../../../hooks/useDragAndDrop";
import useForm from "../../../../UI/forms/hooks/use-form";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../../utils/constantes";
import { allowedMimeTypes, Resource } from "../post/useUploadResources";

// Timer pour le debounce de la réorganisation des ressources
let timer: NodeJS.Timeout | null = null;

/**
 * Hook personnalisé pour gérer la mise à jour des ressources d'une activité
 * @param activity - L'activité dont les ressources sont à gérer
 * @param onCancel - Fonction de callback appelée lors de l'annulation
 */
const useUpdateResources = (activity: Activity, onCancel: () => void) => {
  // États pour gérer les ressources et leur manipulation
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

  const data = { values, errors, onChangeValue };

  /**
   * Gère la réorganisation des ressources avec un debounce
   */
  const handleReorderResources = useCallback(() => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      if (timer) clearTimeout(timer);
    };
    timer = setTimeout(() => {
      sendRequest(
        {
          path: `/activity/reorder-resource/${activity.id}`,
          method: "put",
          body: resources.map((resource) => resource.id),
        },
        applyData
      );
    }, 1000);
  }, [sendRequest, resources, activity.id]);

  /**
   * Récupère les ressources de l'activité depuis le serveur
   */
  const getResources = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      resources: ActivityResource[];
    }) => {
      if (data.success) setResources(data.resources);
    };
    sendRequest({ path: `/activity/resources/${activity.id}` }, applyData);
  }, [activity.id, sendRequest]);

  /**
   * Gère l'ajout d'un nouveau fichier à la liste
   * Vérifie le type MIME et ajoute le fichier si valide
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Vérification du type de fichier
      let error = !regexGeneric.test(values.name);
      console.log("hello");

      if (allowedMimeTypes.includes(event.target.files[0].type)) {
        // Vérifie si le fichier n'existe pas déjà dans la liste
        uploadList?.forEach((file) => {
          if (file.file.name === event.target.files![0].name) {
            error = true;
            toast.error("Ce fichier se trouve déjà dans la liste");
          }
        });
        // Vérifie si une ressource avec le même nom n'existe pas déjà
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
        setUploadList(resource);
        // Réinitialisation du champ de fichier
        event.target.value = "";
        onChangeValue("name", "");
      } else {
        toast.error(
          "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX"
        );
        return;
      }
    }
  };

  /**
   * Gère l'ajout des ressources à l'activité
   * Envoie les fichiers et leurs métadonnées au serveur
   */
  const handleAddResource = () => {
    const formData = new FormData();

    // Ajout des fichiers au FormData avec validation du nom
    uploadList?.forEach((file) => {
      if (regexGeneric.test(file.name)) {
        formData.append("files", file.file);
      } else {
        toast.error("Le nom de la ressource n'est pas valide");
        return;
      }
    });

    // Callback après la requête réussie
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      setUploadList([]);
      toast.success(data.message);
      handleCancel();
      getResources();
    };

    // Préparation des métadonnées des ressources
    let resources: { label: string; filename: string }[] = [];
    for (const item of uploadList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    // Ajout des métadonnées au FormData
    formData.append("data", JSON.stringify(resources));

    // Envoi de la requête POST au serveur
    sendRequest(
      {
        path: `/activity/add-resource/${activity.id}`,
        method: "put",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
      applyData
    );
  };

  /**
   * Gère l'annulation de l'ajout de ressources
   */
  const handleCancel = () => {
    setIsAdding(false);
    onCancel();
  };

  /**
   * Supprime un fichier de la liste d'upload
   */
  const handleRemoveFromUploadList = (indexToRemove: number) => {
    setUploadList((prevState) =>
      prevState.filter((_, index) => index !== indexToRemove)
    );
  };

  /**
   * Marque une ressource pour suppression
   */
  const handleSetResourceToDelete = (id: number) => {
    setIsDeleting(id);
  };

  /**
   * Annule la suppression d'une ressource
   */
  const handleCancelDelete = () => {
    setIsDeleting(null);
  };

  /**
   * Supprime définitivement une ressource
   */
  const handleDeleteResource = () => {
    if (isDeleting) {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setIsDeleting(null);
        setResources((prevState) =>
          prevState.filter((resource) => resource.id !== isDeleting)
        );
      };
      sendRequest(
        { path: `/activity/resource/${isDeleting}`, method: "delete" },
        applyData
      );
    }
  };

  // Charge les ressources au montage du composant
  useEffect(() => {
    getResources();
  }, [getResources]);

  // Gère la réorganisation des ressources
  useEffect(() => {
    if (submit) {
      handleReorderResources();
      setSubmit(false);
    }
  }, [submit, handleReorderResources, setSubmit]);

  // Gère les erreurs
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
    handleSetResourceToDelete,
    isAdding,
    isDeleting,
    isLoading,
    resources,
    setIsAdding,
    setUploadList,
    uploadList,
    uploadProgress,
  };
};

export default useUpdateResources;
