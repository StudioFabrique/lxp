import { useMemo, useState, useCallback, useEffect } from "react";
import useForm from "../../../UI/forms/hooks/use-form";
import useHttp from "../../../../hooks/use-http";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../utils/constantes";
import { useParams } from "react-router-dom";

// Type définissant la structure d'une ressource
export type Resource = {
  name: string; // Nom de la ressource
  file: File; // Fichier associé
  hasError: boolean; // Indique si la ressource contient une erreur
  //minUpload: number; // Valeur en pourcentage à laquelle l'upload commence par rapport au pourcentage total de tous les fichiers
  //maxUpload: number; // Valeur en pourcentage à laquelle l'upload se termine par rapport au pourcentage total de tous les fichiers
};

// Types de fichiers autorisés pour l'upload
export const allowedMimeTypes = [
  "application/pdf", // PDF
  "application/vnd.ms-powerpoint", // PPT
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "text/plain", // TXT
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
];

/**
 * Hook personnalisé pour gérer l'upload des ressources
 * @param onCancel - Fonction appelée pour annuler l'upload
 * @returns Objet contenant les fonctions et données nécessaires pour gérer l'upload
 */
const useUploadResources = (
  onCancel: (value: boolean) => void,
  onSubmit?: () => void,
) => {
  // État pour stocker la liste des fichiers
  const [filesList, setFilesList] = useState<Resource[] | null>(null);

  const { resourceId } = useParams();
  const { lessonId } = useParams();

  let id: number | null = null;
  if (resourceId) id = parseInt(resourceId);
  else if (lessonId) id = parseInt(lessonId);
  // Hook pour gérer le formulaire (validation, valeurs, etc.)
  const { errors, values, onChangeValue } = useForm();
  const data = { values, errors, onChangeValue };

  // Hook pour les requêtes HTTP et récupération de l'ID de la leçon
  const { isLoading, sendRequest, uploadProgress } = useHttp();
  const [hasError, setHasError] = useState(false);

  // Mémoisation du nombre de fichiers pour éviter des re-renders inutiles
  const filesNumber = useMemo(
    () => filesList?.length ?? 0,
    [filesList?.length],
  );

  // Ajout d'un état pour le contrôleur d'annulation
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  /**
   * Gère l'ajout d'un nouveau fichier à la liste
   * Vérifie le type MIME et ajoute le fichier si valide
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Vérification du type de fichier
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
        // Réinitialisation du champ de fichier
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
   * Supprime une ressource de la liste à l'index spécifié
   */
  const handleRemoveResource = (index: number) => {
    setFilesList(filesList!.filter((_, i) => i !== index));
  };

  /**
   * Réinitialise complètement le formulaire et la liste des fichiers
   */
  const resetFilesList = useCallback(() => {
    setFilesList(null);
    onChangeValue("name", "");
  }, [onChangeValue]);

  /**
   * Gère la soumission du formulaire
   * Prépare les données et envoie la requête au serveur
   */
  const handleSubmit = () => {
    const controller = new AbortController();
    setAbortController(controller);

    const formData = new FormData();

    // Ajout des fichiers au FormData avec validation du nom
    filesList?.forEach((file) => {
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
      onCancel(false);
      onSubmit?.();
    };

    // Préparation des métadonnées des ressources
    let resources: { label: string; filename: string }[] = [];
    for (const item of filesList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    // Ajout des métadonnées au FormData
    formData.append(
      "data",
      JSON.stringify({ resources, parent: lessonId ? "lesson" : "resource" }),
    );

    // Envoi de la requête POST au serveur
    sendRequest(
      {
        path: `/activity/resource/${id}`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        signal: controller.signal, // Ajout du signal pour l'annulation
      },
      applyData,
    );
  };

  /**
   * Met à jour l'ordre des ressources dans la liste
   */
  const handleReorder = (
    newList: {
      name: string;
      file: File;
      hasError: boolean;
    }[],
  ) => {
    setFilesList(newList);
  };

  // Fonction pour annuler la requête en cours
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

  // Retourne les fonctions et données nécessaires pour le composant
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
