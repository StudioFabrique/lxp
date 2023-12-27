import { ChangeEvent, useState } from "react";
import VideoPlayer from "../../UI/video-player";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import { useParams } from "react-router-dom";

export default function Video() {
  const order = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.lesson.lesson.activities.length
  ) as number;
  const { lessonId } = useParams();
  const { sendRequest } = useHttp();
  const [origin, setOrigin] = useState("fileSystem");
  const [video, setVideo] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    setOrigin(event.currentTarget.value);
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      console.log({ selectedFile });

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

  const handleReset = () => {
    setVideo(null);
    setFile(null);
    setUrl("");
  };

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({ type: "video", order, url: file ? "" : video })
    );
    if (file) {
      fd.append("video", file);
    }
    const applyData = (data: Activity) => {
      console.log({ data });
    };
    sendRequest(
      {
        path: `/activity/video/${lessonId}`,
        method: "post",
        body: JSON.stringify(fd),
      },
      applyData
    );
  };

  return (
    <main>
      <section>
        <label htmlFor="origin">
          Sélectionner la provenance de la vidéo
          <select
            name="origin"
            id="origin"
            value={origin}
            onChange={handleOnChangeOrigin}
          >
            <option value="fileSystem">Votre ordinateur</option>
            <option value="web">Un lien externe</option>
          </select>
        </label>
      </section>
      <section>
        {origin === "fileSystem" ? (
          <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            onChange={handleSelectFile}
          />
        ) : (
          <div className="flex items-center gap-x-2">
            <input
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
          <article>
            <VideoPlayer source={video} />
            <div className="flex justify-end items-center gap-x-2 mt-4">
              <button
                className="btn btn-warning btn-sm btn-outline"
                onClick={handleReset}
              >
                Réinitialiser
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
