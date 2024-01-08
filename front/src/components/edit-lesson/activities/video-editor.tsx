/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";
import VideoPlayer from "../../UI/video-player";
//import { useSelector } from "react-redux";

interface VideoEditorProps {
  propVideo?: string;
  onCancel: () => void;
  onSubmit: (value: { videoValue: string; fileValue: File | null }) => void;
}

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

  const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    //handleReset();
    setOrigin(event.currentTarget.value);
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
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

  const handleSubmit = () => {
    onSubmit({
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
          <article className="py-2">
            <VideoPlayer source={video} />
            <div className="flex justify-between items-center gap-x-2 mt-4">
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
