// Imports des hooks React et des dépendances nécessaires
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../hooks/use-http";
import type {
  Activity,
  Resource as ActivityResource,
} from "../../../../../utils/interfaces/activity";
import { useDragAndDrop } from "../../../../../hooks/useDragAndDrop";
import useForm from "../../../../UI/forms/hooks/use-form";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../../utils/constantes";
import { allowedMimeTypes, Resource } from "../useUploadResources";

// Timer pour le debounce de la réorganisation des ressources
let timer: NodeJS.Timeout | null = null;

/**
 * Hook personnalisé pour gérer la mise à jour des ressources d'une activité
 * Permet d'ajouter, supprimer, réorganiser et mettre à jour les ressources
 * @param activity - L'activité dont les ressources sont à gérer
 * @param onCancel - Fonction de callback appelée lors de l'annulation
 */
const useUpdateResources = (
  activity: Activity,
  onCancel: () => void,
  parent: "lesson" | "resource" = "lesson",
  onSubmit?: () => void,
) => {
  // États pour gérer les ressources et leur manipulation
  const [resources, setResources] = useState<ActivityResource[]>([]); // Liste des ressources existantes
  const [isAdding, setIsAdding] = useState(false); // État indiquant si on est en train d'ajouter une ressource
  const { values, errors, onChangeValue } = useForm(); // Hook pour gérer le formulaire
  const [uploadList, setUploadList] = useState<Resource[]>([]); // Liste des fichiers en attente d'upload
  const { error, isLoading, sendRequest, uploadProgress } = useHttp(); // Hook pour les requêtes HTTP
  const { handleDragEnd, submit, setSubmit } = useDragAndDrop({
    items: resources,
    onReorder: setResources,
  }); // Hook pour gérer le drag & drop
  const [isDeleting, setIsDeleting] = useState<number | null>(null); // ID de la ressource en cours de suppression
  const [isUpdating, setIsUpdating] = useState<ActivityResource | null>(null); // Ressource en cours de modification

  // Regroupement des données du formulaire
  const data = { values, errors, onChangeValue };

  /**
   * Met à jour le titre d'une ressource existante
   * @param value - Nouveau titre de la ressource
   * @param id - ID de la ressource à mettre à jour
   */
  const handleUpdateResource = (value: string, id: number) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      data: ActivityResource;
    }) => {
      if (data.success) {
        // Met à jour la ressource dans la liste locale
        setResources((prevState) =>
          prevState.map((resource) =>
            resource.id === data.data.id ? data.data : resource,
          ),
        );
      }
      setIsUpdating(null);
      onSubmit?.();
    };

    // Envoie la requête de mise à jour
    sendRequest(
      {
        path: `/activity/resource/${id}`,
        method: "put",
        body: { label: value },
      },
      applyData,
    );
  };

  /**
   * Gère la réorganisation des ressources avec un debounce
   * Attend 1 seconde avant d'envoyer la requête pour éviter les appels multiples
   */
  const handleReorderResources = useCallback(() => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      if (timer) clearTimeout(timer);
      onSubmit?.();
    };

    // Utilise un timer pour le debounce
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
    sendRequest(
      { path: `/activity/resources/${activity.id}/${parent}` },
      applyData,
    );
  }, [activity.id, sendRequest, parent]);

  /**
   * Gère l'ajout d'un nouveau fichier à la liste d'upload
   * Vérifie le type MIME et le nom du fichier avant l'ajout
   * @param event - Événement de changement de fichier
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Vérification du format du nom
      let error = !regexGeneric.test(values.name as string);

      if (allowedMimeTypes.includes(event.target.files[0].type)) {
        // Vérifie les doublons dans la liste d'upload
        uploadList?.forEach((file) => {
          if (file.file.name === event.target.files![0].name) {
            error = true;
            toast.error("Ce fichier se trouve déjà dans la liste");
          }
        });

        // Vérifie les doublons avec les ressources existantes
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

        // Ajoute le fichier à la liste d'upload
        const resource = [
          ...(uploadList ?? []),
          {
            name: values.name,
            file: event.target.files[0],
            hasError: error,
          },
        ];
        setUploadList(resource as Resource[]);

        // Réinitialise le formulaire
        event.target.value = "";
        onChangeValue("name", "");
      } else {
        toast.error(
          "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX",
        );
        return;
      }
    }
  };

  /**
   * Gère l'ajout des ressources à l'activité
   * Prépare et envoie les fichiers et leurs métadonnées au serveur
   */
  const handleAddResource = () => {
    const formData = new FormData();

    // Ajoute les fichiers au FormData
    uploadList?.forEach((file) => {
      if (regexGeneric.test(file.name)) {
        formData.append("files", file.file);
      } else {
        toast.error("Le nom de la ressource n'est pas valide");
        return;
      }
    });

    // Callback après succès de la requête
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      setUploadList([]);
      toast.success(data.message);
      handleCancel();
      getResources();
      onSubmit?.();
    };

    // Prépare les métadonnées des ressources
    let resources: { label: string; filename: string }[] = [];
    for (const item of uploadList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    // Ajoute les métadonnées au FormData
    formData.append("data", JSON.stringify(resources));

    // Envoie la requête d'upload
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

  /**
   * Gère l'annulation de l'ajout de ressources
   * Réinitialise l'état et appelle le callback d'annulation
   */
  const handleCancel = () => {
    setIsAdding(false);
    onCancel();
  };

  /**
   * Supprime un fichier de la liste d'upload
   * @param indexToRemove - Index du fichier à supprimer
   */
  const handleRemoveFromUploadList = (indexToRemove: number) => {
    setUploadList((prevState) =>
      prevState.filter((_, index) => index !== indexToRemove),
    );
  };

  /**
   * Marque une ressource pour suppression
   * @param id - ID de la ressource à supprimer
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
   * Envoie une requête DELETE au serveur
   */
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

  /**
   * Met à jour l'ordre des ressources dans la liste d'upload
   * @param newList - Nouvelle liste ordonnée
   */
  const handleReorder = (
    newList: {
      name: string;
      file: File;
      hasError: boolean;
    }[],
  ) => {
    setUploadList(newList);
  };

  // Effets secondaires

  // Charge les ressources au montage du composant
  useEffect(() => {
    getResources();
  }, [getResources]);

  // Gère la réorganisation des ressources quand submit change
  useEffect(() => {
    if (submit) {
      handleReorderResources();
      setSubmit(false);
    }
  }, [submit, handleReorderResources, setSubmit]);

  // Gère l'affichage des erreurs
  useEffect(() => {
    if (error.length > 0) toast.error(error);
    setSubmit(false);
    if (timer) clearTimeout(timer);
  }, [error, setSubmit]);

  // Retourne les fonctions et états nécessaires
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
