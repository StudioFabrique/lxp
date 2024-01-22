/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";
import VideoPlayer from "../../UI/video-player";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";

import { maxSizeError } from "../../../helpers/max-size-error";
import { activityVideoSize } from "../../../config/images-sizes";
import useForm from "../../UI/forms/hooks/use-form";
import Field from "../../UI/forms/field";
import FieldArea from "../../UI/forms/field-area";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { activiteVideo } from "../../../lib/validation/lesson/activite-video";
import { validationErrors } from "../../../helpers/validate";

interface VideoEditorProps {
  propVideo?: string;
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
  onCancel,
  onSubmit,
}: VideoEditorProps) {
  /*   const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number; */
  const [origin, setOrigin] = useState("fileSystem");
  const [video, setVideo] = useState<string>(propVideo);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const { errors, values, onChangeValue, onValidationErrors } = useForm();

  const data = { values, errors, onChangeValue };

  const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    //handleReset();
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
  };

  const handleSelectExternalSource = () => {
    setVideo(url);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      activiteVideo.parse(values);
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

  return (
    <main className="flex flex-col gap-y-4">
      <section className="flex items-center gap-x-4">
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
      </section>
      <section>
        {origin === "fileSystem" ? (
          <input
            className="file-input file-input-bordered file-input-sm file-input-primary"
            type="file"
            name="fileUpload"
            id="fileUpload"
            onChange={handleSelectFile}
          />
        ) : (
          <div className="flex items-center gap-x-2">
            <input
              className="input input-sm input-primary focus:outline-none"
              type="text"
              name="httpsLink"
              id="httpsLink"
              placeholder="Lien https"
              value={url}
              onChange={handleOnChangeUrl}
            />
            <button
              className="btn btn-sm btn-primary btn-outline"
              onClick={handleSelectExternalSource}
            >
              Aperçu
            </button>
          </div>
        )}
      </section>
      <section>
        {video ? (
          <article className="py-2 flex flex-col gap-y-4">
            <VideoPlayer source={video} />
            <Wrapper>
              <form>
                <Field
                  label="Titre *"
                  placeholder="Titre de la video"
                  name="title"
                  data={data}
                />
                <FieldArea label="Description" name="description" data={data} />
              </form>
            </Wrapper>
            <div className="flex justify-between items-center gap-x-2">
              <button
                className="btn btn-primary btn-sm btn-outline"
                onClick={onCancel}
              >
                Annuler
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                Sauvegarder
              </button>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
