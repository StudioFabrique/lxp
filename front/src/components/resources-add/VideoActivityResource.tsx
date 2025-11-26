import { ChangeEvent, useEffect, useState } from "react";
import { activiteMetaDataSchema } from "../../lib/validation/lesson/activite-video";
import { Activity } from "../../utils/interfaces/activity";
import VideoPlayer from "./video-player";
import VideoForm from "./VideoForm";
import useForm from "../UI/forms/hooks/use-form";
import ElementNotFound from "../UI/element-not-found";
import { isValidUrl } from "../../helpers/isValidUrl";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { validationErrors } from "../../helpers/validate";
import { maxSizeError } from "../../helpers/max-size-error";
import { activityVideoSize } from "../../config/images-sizes";

type Props = {
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
      })
    );
    if (file) fd.append("video", file);
    props.onSubmit(fd);
  };

  useEffect(() => {
    if (props.activity) {
      initValues({
        title: props.activity.title,
        description: props.activity.description,
        url: props.activity.url,
      });
    }
  }, [props.activity, initValues]);

  return (
    <div>
      {props.mode === "read" ? (
        <>
          {values.url ? (
            <VideoPlayer
              source={values?.url as string}
              description={(values?.description as string) ?? ""}
            />
          ) : (
            <ElementNotFound message="Aucun aperçu disponible, choisissez une vidéo." />
          )}
        </>
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
