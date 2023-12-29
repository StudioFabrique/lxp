/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react";
import VideoPlayer from "../../UI/video-player";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import { useParams } from "react-router-dom";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import toast from "react-hot-toast";
import VideoEditor from "./video-editor";
import { ACTIVITIES_VIDEOS } from "../../../config/urls";

interface VideoProps {
  activity?: Activity;
}

export default function Video({ activity }: VideoProps) {
  const dispatch = useDispatch();
  const order = useSelector(
    (state: any) => state.lesson.lesson.activities.length + 1
  ) as number;
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;
  const { lessonId } = useParams();
  const { sendRequest } = useHttp();
  const [origin, setOrigin] = useState("fileSystem");
  const [video, setVideo] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  console.log(video);

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

  const handleReset = () => {
    setVideo(null);
    setFile(null);
    setUrl("");
  };

  const handleSubmit = () => {
    const fd = new FormData();
    if (activity !== undefined) {
      fd.append("data", JSON.stringify({ ...activity, url }));
    } else {
      fd.append(
        "data",
        JSON.stringify({ type: "video", order, url: file ? "" : video })
      );
    }
    if (file) {
      fd.append("video", file);
    }
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      if (data.success) {
        toast.success(data.message);
        handleReset();
        dispatch(lessonActions.addActivity(data.response));
        dispatch(lessonActions.resetCurrentType());
      }
    };
    sendRequest(
      {
        path: `/activity/video/${lessonId}`,
        method: activity !== undefined ? "put" : "post",
        body: fd,
      },
      applyData
    );
  };

  const handleCancel = () => {
    if (activity !== undefined) {
      if (activity.url.startsWith("http")) {
        setVideo(activity.url);
      } else {
        setVideo(ACTIVITIES_VIDEOS + activity.url);
      }
    }
    dispatch(lessonActions.setBlogEdition(null));
  };

  useEffect(() => {
    if (activity !== undefined) {
      if (activity.url.startsWith("http")) {
        setVideo(activity.url);
      } else {
        setVideo(ACTIVITIES_VIDEOS + activity.url);
      }
    }
  }, [activity]);

  return (
    <main>
      {activity !== undefined && blogEdition === activity.id ? (
        <VideoEditor
          origin={origin}
          file={file}
          url={url}
          onChangeOrigin={handleOnChangeOrigin}
          onSelectFile={handleSelectFile}
          onChangeUrl={handleOnChangeUrl}
          onSelectExternalSource={handleSelectExternalSource}
        />
      ) : null}

      {activity === undefined && !video ? (
        <VideoEditor
          origin={origin}
          file={file}
          url={url}
          onChangeOrigin={handleOnChangeOrigin}
          onSelectFile={handleSelectFile}
          onChangeUrl={handleOnChangeUrl}
          onSelectExternalSource={handleSelectExternalSource}
        />
      ) : null}

      <section>
        {video ? (
          <article className="py-2">
            <VideoPlayer source={video} />
            {(activity !== undefined && blogEdition === activity.id) ||
            activity === undefined ? (
              <div className="flex justify-between items-center gap-x-2 mt-4">
                <button
                  className="btn btn-primary btn-sm btn-outline"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmit}
                >
                  Sauvegarder
                </button>
              </div>
            ) : null}
          </article>
        ) : null}
      </section>
    </main>
  );
}
