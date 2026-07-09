import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { activityVideoSize } from "../../config/images-sizes";
import { maxSizeError } from "../../../src/utils/helpers/max-size-error";
import { activiteMetaDataSchema } from "../../../src/config/validation/lesson/activite-video";
import { Activity } from "../../../src/utils/interfaces/activity";
import ElementNotFound from "../UI/element-not-found";
import VideoPlayer from "../../components/UI/VideoPlayer";
import VideoForm from "./VideoForm";

type Props = {
  parent: "lesson" | "resource";
  activity: Activity | null;
  mode: "read" | "edit" | "write";
  onClose: () => void;
  onSubmit: (fd: FormData) => void;
};

export default function VideoActivityResource(props: Props) {
  const maxSize = activityVideoSize;
  // Hook personnalisé pour la gestion du formulaire
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(activiteMetaDataSchema),
    defaultValues: { title: "", description: "", url: "" },
  });

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

  const submitForm = (data: Record<string, any>) => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        title: data.title,
        description: data.description,
        url: file ? "" : data.url,
        parent: props.parent,
      }),
    );
    if (file) fd.append("video", file);
    props.onSubmit(fd);
  };

  const handleSubmitForm = handleSubmit(
    submitForm,
    (errs) => {
      const firstError = Object.values(errs)[0];
      if (firstError?.message) toast.error(firstError.message);
    },
  );

  useEffect(() => {
    if (props.activity) {
      setValue("title", props.activity.title ?? "");
      setValue("url", props.activity.url ?? "");
    }
  }, [props.activity, setValue]);

  return (
    <div>
      {props.mode === "read" ? (
        <div className="flex justify-center">
          {watch("url") ? (
            <VideoPlayer url={watch("url") as string} size="large" />
          ) : (
            <ElementNotFound message="Aucun aperçu disponible, choisissez une vidéo." />
          )}
        </div>
      ) : null}
      {props.mode !== "read" ? (
        <VideoForm
          data={{ register, errors, watch }}
          mode={props.mode}
          onSetFile={handleSelectFile}
          onClose={props.onClose}
          onSubmit={handleSubmitForm}
        />
      ) : null}
    </div>
  );
}
