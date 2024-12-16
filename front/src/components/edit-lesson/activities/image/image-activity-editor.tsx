// Import des composants UI et des hooks nécessaires
import Field from "../../../UI/forms/field";
import FieldArea from "../../../UI/forms/field-area";
import useForm from "../../../UI/forms/hooks/use-form";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import defaultImage from "../../../../assets/images/bookshelf.jpg";
import { useEffect, useState } from "react";
import { activityImageSize } from "../../../../config/images-sizes";
import MemoizedImageFileUpload from "../../../UI/image-file-upload/image-file-upload";
import { z, ZodError } from "zod";
import { regexGeneric } from "../../../../utils/constantes";
import { validationErrors } from "../../../../helpers/validate";
import SubmitButton from "../../../UI/submit-button";
import toast from "react-hot-toast";
import useHttp from "../../../../hooks/use-http";
import SuccessWithMessage from "../../../../utils/interfaces/success-with-message";
import { useParams } from "react-router-dom";
import Activity from "../../../../utils/interfaces/activity";
import { ACTIVITIES } from "../../../../config/urls";
import DialogImages from "../../../mediatheque/dialog-images";

// Props du composant
type Props = {
  activity?: Activity; // L'activité à éditer (optionnelle)
  onCancel: (value: boolean) => void; // Fonction appelée lors de l'annulation
};

/**
 * Composant d'édition d'une activité de type image
 * Permet de créer ou modifier une activité avec une image, un titre et une description
 */
export default function ImageActivityEditor({ activity, onCancel }: Props) {
  // Gestion du formulaire avec le hook personnalisé useForm
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const data = { values, errors, onChangeValue };

  // États pour gérer l'image
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  // Hooks pour les requêtes HTTP et la navigation
  const { sendRequest } = useHttp();
  const { lessonId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Style pour l'affichage de l'image
  const classImage: React.CSSProperties = {
    backgroundImage: `url('${
      image ??
      (activity
        ? `${ACTIVITIES}images/${selectedImage ?? activity.url}`
        : defaultImage)
    }')`,
    width: "100%",
    height: "100%",
    minHeight: "25rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  // Schéma de validation Zod pour le formulaire
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
   * Valide les données et envoie la requête au serveur
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
    if (!activity && !file) {
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

  // Effet pour afficher la prévisualisation de l'image sélectionnée
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

  // Effet pour initialiser le formulaire avec les données de l'activité existante
  useEffect(() => {
    if (activity) {
      onChangeValue("title", activity.title!);
      onChangeValue("description", activity.description!);
    }
  }, [activity, onChangeValue]);

  useEffect(() => {
    const ecouteur = new BroadcastChannel("clipboardChannel");

    const handleMessage = (event: MessageEvent) => {
      setSelectedImage(event.data); // Met à jour la valeur avec le message reçu
      setShowDialog(false);
    };

    ecouteur.addEventListener("message", handleMessage);

    return () => ecouteur.close(); // Nettoie la chaîne lors du démonta])
  }, []);

  return (
    <div className="w-full h-[30rem] gap-8 grid grid-cols-1 2xl:grid-cols-2 p-6">
      <Wrapper>
        <span className="h-full flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">
            Informations à propos de l'image
          </h2>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <span className="flex flex-col gap-y-4">
              <Field name="title" label="Titre *" data={data} />
              <FieldArea name="description" data={data} label="Description *" />
            </span>
            <span className="flex flex-col gap-y-4">
              <MemoizedImageFileUpload
                onSetFile={setFile}
                label=""
                maxSize={activityImageSize}
              />
              <div className="flex justify-end items-center">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setShowDialog(true)}
                >
                  Importer depuis la médiathèque
                </button>
              </div>
            </span>
            <div className="flex justify-between items-center">
              <button
                className="btn btn-primary btn-outline"
                onClick={() => onCancel(false)}
              >
                Annuler
              </button>
              <span className="flex justify-end items-center gap-x-2">
                <button className="btn btn-secondary" onClick={onResetForm}>
                  Réinitialiser
                </button>
                <SubmitButton
                  label="Sauvegarder"
                  isLoading={false}
                  loadingLabel="En cours..."
                />
              </span>
            </div>
          </form>
        </span>
      </Wrapper>
      <div style={classImage}></div>
      <div className="h-[1rem]" />
      {showDialog ? (
        <DialogImages onClose={() => setShowDialog(false)} />
      ) : null}
    </div>
  );
}
