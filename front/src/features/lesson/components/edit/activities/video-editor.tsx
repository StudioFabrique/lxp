import { ChangeEvent, useCallback, useEffect, useState } from "react";
import VideoPlayer from "../../../../../../src.legacy/components/UI/video-player";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";

import { maxSizeError } from "../../../../../utils/helpers/max-size-error";
import { activityVideoSize } from "../../../../../config/images-sizes";
import useForm from "../../../../../../src.legacy/components/UI/forms/hooks/use-form";
import Field from "../../../../../../src.legacy/components/UI/forms/field";
import FieldArea from "../../../../../../src.legacy/components/UI/forms/field-area";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import { validationErrors } from "../../../../../utils/helpers/validate";
import { Loader2 } from "lucide-react";
import { activiteMetaDataSchema } from "../../../../../../src.legacy/lib/validation/lesson/activite-video";

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

  const { initValues, errors, values, onChangeValue, onValidationErrors } =
    useForm();

  const data = { values, errors, onChangeValue };

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

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
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
    }
  };

  const handleOnChangeUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
    setVideo(url);
  };

  const handleSelectExternalSource = useCallback(() => {
    setVideo(url);
  }, [url]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      activiteMetaDataSchema.parse(values);
      if (origin === "web" && !isValidUrl(url)) {
        toast.error("L'URL de la vidéo n'est pas valide.");
        return;
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    onSubmit({
      title: values.title,
      description: values.description,
      videoValue: file ? "" : video,
      fileValue: file,
    });
  };

  useEffect(() => {
    initValues({
      title,
      description,
    });
  }, [title, description, initValues]);

  useEffect(() => {
    handleSelectExternalSource();
  }, [handleSelectExternalSource, url]);

  return (
    <main className="w-full flex flex-col gap-y-4">
      <Wrapper>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <article>
            <form className="flex flex-col gap-y-2">
              <Field
                label="Titre *"
                placeholder="Titre de la video"
                name="title"
                data={data}
              />
              <FieldArea label="Description" name="description" data={data} />
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
                <input
                  className="w-full file-input file-input-bordered file-input-sm file-input-primary"
                  type="file"
                  name="fileUpload"
                  id="fileUpload"
                  onChange={handleSelectFile}
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
            <VideoPlayer source={video} />
          </section>
        ) : null}
      </Wrapper>
      <section className="flex justify-between items-center gap-x-2">
        <button
          className="btn btn-primary btn-outline"
          disabled={loading}
          onClick={onCancel}
        >
          Annuler
        </button>
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
