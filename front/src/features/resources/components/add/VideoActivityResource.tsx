import { ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  videoSchema,
  videoFileError,
  type VideoFormValues,
} from "../../../lesson/media.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { Activity } from "../../../../utils/interfaces/activity";
import ElementNotFound from "../../../../components/UI/element-not-found";
import VideoPlayer from "../../../../components/UI/VideoPlayer";
import VideoForm from "./VideoForm";

type Props = {
  parent: "lesson" | "resource";
  activity: Activity | null;
  mode: "read" | "edit" | "write";
  onClose: () => void;
  onSubmit: (fd: FormData) => void;
};

export default function VideoActivityResource(props: Props) {
  // Hook personnalisé pour la gestion du formulaire
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      origin: "web",
      url: "",
      file: null,
    },
  });
  const [file, setFile] = useFormField(form, "file");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      const error = videoFileError(selectedFile);
      if (error) {
        toast.error(error);
        return;
      }
      setValue("origin", "file");
      setFile(selectedFile);
    }
  };

  const submitForm = (data: VideoFormValues) => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        title: data.title,
        description: data.description,
        url: data.origin === "file" ? "" : data.url.trim(),
        parent: props.parent,
      }),
    );
    if (data.origin === "file" && file) fd.append("video", file);
    props.onSubmit(fd);
  };

  const handleSubmitForm = handleSubmit(submitForm, (errs) => {
    const firstError = Object.values(errs)[0];
    if (firstError?.message) toast.error(firstError.message);
  });

  useEffect(() => {
    if (props.activity) {
      setValue("title", props.activity.title ?? "");
      setValue("url", props.activity.url ?? "");
      setValue("description", props.activity.description ?? "");
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
