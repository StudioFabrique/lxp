import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { activityVideoSize } from "../../config/images-sizes";
import { isValidUrl } from "../../helpers/isValidUrl";
import { maxSizeError } from "../../helpers/max-size-error";
import { validationErrors } from "../../helpers/validate";
import { activiteMetaDataSchema } from "../../lib/validation/lesson/activite-video";
import { Activity } from "../../utils/interfaces/activity";
import ElementNotFound from "../UI/element-not-found";
import useForm from "../UI/forms/hooks/use-form";
import VideoPlayer from "../UI/VideoPlayer";
import VideoForm from "./VideoForm";

type Props = {
  parent: "lesson" | "resource";
  activity: Activity | null;
  mode: "read" | "edit" | "write";
  values: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (fd: FormData) => void;
};

export default function VideoActivityResource(props: Props) {
  const maxSize = activityVideoSize;
  // Hook personnalisé pour la gestion du formulaire
  const { initValues, errors, values, onChangeValue, onValidationErrors } =
    useForm({}, activiteMetaDataSchema);

  const data = { values, errors, onChangeValue };

  const [file, setFile] = useState<File | null>(null); // Fichier vidéo sélectionné

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      // Vérification du type de fichier
      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Merci de choisir un fichier de type video.");
        setFile(null);
        return;
      }
      // Vérification de la taille du fichier
      if (selectedFile.size > maxSize) {
        toast.error(maxSizeError(maxSize));
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validation des données du formulaire
      activiteMetaDataSchema.parse(values);
      // Vérification de la validité de l'URL externe
      if (origin === "web" && !isValidUrl(values.url as string)) {
        toast.error("L'URL de la vidéo n'est pas valide.");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        title: values.title,
        description: values.description,
        url: values.file ? "" : values.url,
        parent: props.parent,
      }),
    );
    if (file) fd.append("video", file);
    props.onSubmit(fd);
  };

  useEffect(() => {
    if (props.activity) {
      initValues({
        title: props.activity.title,
        url: props.activity.url,
      });
    }
  }, [props.activity, initValues]);

  return (
    <div>
      {props.mode === "read" ? (
        <div className="flex justify-center">
          {values.url ? (
            <VideoPlayer url={values?.url as string} size="large" />
          ) : (
            <ElementNotFound message="Aucun aperçu disponible, choisissez une vidéo." />
          )}
        </div>
      ) : null}
      {props.mode !== "read" ? (
        <VideoForm
          data={data}
          mode={props.mode}
          onSetFile={handleSelectFile}
          onClose={props.onClose}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
