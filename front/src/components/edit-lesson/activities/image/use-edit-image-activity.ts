import { useEffect, useState } from "react";
import useForm from "../../../UI/forms/hooks/use-form";
import useHttp from "../../../../hooks/use-http";
import { useParams } from "react-router-dom";
import Activity from "../../../../utils/interfaces/activity";
import { regexGeneric } from "../../../../utils/constantes";
import { z, ZodError } from "zod";
import { validationErrors } from "../../../../helpers/validate";
import toast from "react-hot-toast";
import SuccessWithMessage from "../../../../utils/interfaces/success-with-message";

/**
 * Hook personnalisé pour gérer l'édition d'une activité de type image
 * @param activity - L'activité à éditer (optionnel)
 * @param onCancel - Fonction de callback appelée lors de l'annulation
 * @returns Un objet contenant les états et fonctions nécessaires pour gérer le formulaire
 */
const useEditImageActivity = (
  activity: Activity | undefined,
  onCancel: (value: boolean) => void
) => {
  // Initialisation du formulaire avec le hook useForm
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const data = { values, errors, onChangeValue };

  // États pour la gestion des images
  const [image, setImage] = useState<string | null>(null); // Pour la prévisualisation
  const [file, setFile] = useState<File | null>(null); // Pour le fichier uploadé
  const [showDialog, setShowDialog] = useState<boolean>(false); // Pour la modal de sélection

  // Hooks pour les requêtes HTTP et la navigation
  const { error, isLoading, sendRequest } = useHttp();
  const { lessonId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Définition du schéma de validation avec Zod
  const imageActivitySchema = z.object({
    title: z
      .string({ required_error: "Un titre est requis" })
      .regex(regexGeneric, {
        message: "Le titre contient des caractères non autorisés",
      }),
    description: z
      .string({ required_error: "Une description est requise" })
      .regex(regexGeneric, {
        message: "La description contient des caracèteres non autorisés",
      }),
  });

  /**
   * Gère la soumission du formulaire
   * Valide les données, prépare le FormData et envoie la requête
   * @param event - L'événement de soumission du formulaire
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      imageActivitySchema.parse(values);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    if (!activity && !file && !selectedImage) {
      toast.error("Un fichier est requis");
      return;
    }
    if (!file && selectedImage) {
      values.url = selectedImage;
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));
    if (file) {
      formData.append("image", file);
    }
    const applyData = (data: SuccessWithMessage) => {
      if (data.success) {
        toast.success(data.message);
        onCancel(false);
      }
    };
    sendRequest(
      {
        path: `/activity/image/${activity?.id ?? lessonId}`,
        method: activity ? "put" : "post",
        body: formData,
      },
      applyData
    );
  };

  /**
   * Effect pour gérer la prévisualisation de l'image
   * Convertit le fichier en URL base64 pour l'affichage
   */
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageString = reader.result as string;
        setImage(imageString);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  /**
   * Effect pour initialiser le formulaire avec les données existantes
   * si on est en mode édition
   */
  useEffect(() => {
    if (activity) {
      onChangeValue("title", activity.title!);
      onChangeValue("description", activity.description!);
    }
  }, [activity, onChangeValue]);

  /**
   * Effect pour gérer la communication entre fenêtres
   * via BroadcastChannel pour la sélection d'image
   */
  useEffect(() => {
    const ecouteur = new BroadcastChannel("clipboardChannel");

    const handleMessage = (event: MessageEvent) => {
      setSelectedImage(event.data);
      setShowDialog(false);
    };
    ecouteur.addEventListener("message", handleMessage);
    return () => ecouteur.close();
  }, []);

  /**
   * Effect pour afficher les erreurs via toast
   */
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  // Retourne les états et fonctions nécessaires
  return {
    data,
    handleSubmit,
    image,
    setImage,
    file,
    isLoading,
    onResetForm,
    setFile,
    showDialog,
    setShowDialog,
    selectedImage,
    setSelectedImage,
  };
};

export default useEditImageActivity;
