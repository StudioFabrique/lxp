import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VideoPlayer from "../../../../../components/UI/VideoPlayer";
import { toast } from "react-hot-toast";

import { maxSizeError } from "../../../../../utils/helpers/max-size-error";
import { activityVideoSize } from "../../../../../config/images-sizes";
import { Loader2 } from "lucide-react";
import { activiteMetaDataSchema } from "../../../lesson.schema";
import FormTextarea from "../../../../../components/form/FormTextarea";
import FileUpload from "../../../../../components/UI/file-upload/FileUpload";
import ActivityHeader from "./activity-header";

interface VideoEditorProps {
  propVideo?: string;
  loading: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onSubmit: (value: {
    videoValue: string;
    fileValue: File | null;
    title: string;
    description: string | null;
  }) => void;
}

const maxSize = activityVideoSize;

type VideoFormData = {
  title: string;
  description?: string;
};

export default function VideoEditor({
  propVideo = "",
  loading,
  title,
  description,
  onCancel,
  onSubmit,
}: VideoEditorProps) {
  const [origin, setOrigin] = useState("web");
  const [video, setVideo] = useState<string>(propVideo);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>(propVideo);

  const {
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<VideoFormData>({
    resolver: zodResolver(activiteMetaDataSchema),
    defaultValues: { title: "", description: "" },
  });

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    setOrigin(event.currentTarget.value);
  };

  const handleSelectFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("video/")) {
      toast.error("Merci de choisir un fichier de type video.");
      setFile(null);
      return;
    }
    if (selectedFile.size > maxSize) {
      toast.error(maxSizeError(maxSize));
    }
    setFile(selectedFile);
    setVideo(URL.createObjectURL(selectedFile));
  };

  const handleOnChangeUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
    setVideo(url);
  };

  const handleSelectExternalSource = useCallback(() => {
    setVideo(url);
  }, [url]);

  const handleSubmit = rhfHandleSubmit((formData) => {
    if (origin === "web" && !isValidUrl(url)) {
      toast.error("L'URL de la vidéo n'est pas valide.");
      return;
    }
    onSubmit({
      title: formData.title,
      description: formData.description ?? null,
      videoValue: file ? "" : video,
      fileValue: file,
    });
  });

  useEffect(() => {
    reset({ title: title ?? "", description: description ?? "" });
  }, [title, description, reset]);

  useEffect(() => {
    handleSelectExternalSource();
  }, [handleSelectExternalSource, url]);

  return (
    <main className="w-full flex flex-col gap-y-4">
      <ActivityHeader
        title={watch("title") ?? ""}
        activityType="video"
        titleEditable
        titleError={errors.title?.message}
        onEditTitle={(value) =>
          setValue("title", value, { shouldDirty: true, shouldValidate: true })
        }
        titlePlaceholder="Titre de la vidéo"
        onCancel={onCancel}
        cancelDisabled={loading}
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <article>
          <form className="flex flex-col gap-y-2">
            <FormTextarea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
            />
          </form>
        </article>
        <article className="flex flex-col gap-y-4 justify-center">
          <span className="flex items-center justify-between">
            <label className="text-primary" htmlFor="origin">
              Sélectionner la provenance de la vidéo :
            </label>
            <select
              className="pl-2 select select-primary select-sm focus:outline-none"
              name="origin"
              id="origin"
              value={origin}
              onChange={handleOnChangeOrigin}
            >
              <option value="fileSystem">Votre ordinateur</option>
              <option value="web">Un lien externe</option>
            </select>
          </span>
          <span>
            {origin === "fileSystem" ? (
              <FileUpload
                compact
                fileType="video"
                maxSize={maxSize}
                buttonLabel="Sélectionner une vidéo"
                onFileSelect={handleSelectFile}
              />
            ) : (
              <div className="flex items-center gap-x-2">
                <input
                  className="w-full input input-sm input-primary focus:outline-none active:outline-none"
                  type="text"
                  name="httpsLink"
                  id="httpsLink"
                  placeholder="Lien https"
                  value={url}
                  onChange={handleOnChangeUrl}
                />
              </div>
            )}
          </span>
        </article>
      </section>
      {video ? (
        <section className="w-full py-2 flex flex-col items-center gap-y-4">
          <h2 className="w-full">Aperçu de la vidéo</h2>
          <VideoPlayer url={video} size="medium" />
        </section>
      ) : null}
      <section className="flex justify-end items-center gap-x-2">
        <button
          className="btn btn-primary flex items-center gap-x-2"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <span className="flex items-center gap-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p>Sauvegarde en cours...</p>
            </span>
          ) : (
            <p>Sauvegarde</p>
          )}
        </button>
      </section>
    </main>
  );
}
