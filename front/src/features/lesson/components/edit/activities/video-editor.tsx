import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VideoPlayer from "../../../../../components/UI/VideoPlayer";
import { toast } from "react-hot-toast";

import { activityVideoSize } from "../../../../../config/images-sizes";
import { videoSchema, videoFileError, type VideoFormValues } from "../../../media.schema";
import { useFormField } from "../../../../../components/form/useFormField";
import { showFormErrors } from "../../../../../components/form/form-errors";
import { Loader2 } from "lucide-react";
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


export default function VideoEditor({
  propVideo = "",
  loading,
  title,
  description,
  onCancel,
  onSubmit,
}: VideoEditorProps) {
  const [video, setVideo] = useState<string>(propVideo);

  const form = useForm<VideoFormValues>({ resolver: zodResolver(videoSchema), defaultValues: { title: "", description: "", origin: "web", url: propVideo, file: null } });
  const [origin, setOrigin] = useFormField(form, "origin");
  const [, setFile] = useFormField(form, "file");
  const [url, setUrl] = useFormField(form, "url");
  const {
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = form;

  const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    setOrigin(event.currentTarget.value as "web" | "file");
  };

  const handleSelectFile = (selectedFile: File) => {
    const error = videoFileError(selectedFile);
    if (error) { toast.error(error); return; }
    setFile(selectedFile);
    setVideo(URL.createObjectURL(selectedFile));
  };

  const handleOnChangeUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
    setVideo(event.currentTarget.value);
  };

  const handleSelectExternalSource = useCallback(() => {
    setVideo(url);
  }, [url]);

  const handleSubmit = rhfHandleSubmit((formData) => {
    onSubmit({
      title: formData.title,
      description: formData.description ?? null,
      videoValue: formData.origin === "file" ? "" : formData.url.trim(),
      fileValue: formData.origin === "file" ? formData.file : null,
    });
  }, showFormErrors);

  useEffect(() => {
    reset({ title: title ?? "", description: description ?? "", origin: "web", url: propVideo, file: null });
  }, [title, description, propVideo, reset]);

  useEffect(() => {
    handleSelectExternalSource();
  }, [handleSelectExternalSource, url]);

  return (
    <form className="w-full flex flex-col gap-y-4" onSubmit={handleSubmit}>
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
          <div className="flex flex-col gap-y-2">
            <FormTextarea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
            />
          </div>
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
              <option value="file">Votre ordinateur</option>
              <option value="web">Un lien externe</option>
            </select>
          </span>
          <span>
            {origin === "file" ? (
              <FileUpload
                compact
                fileType="video"
                maxSize={activityVideoSize}
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
          type="submit"
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
    </form>
  );
}
