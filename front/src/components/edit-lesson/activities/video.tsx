/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import { useParams } from "react-router-dom";
import VideoEditor from "./video-editor";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import toast from "react-hot-toast";
import VideoPlayer from "../../UI/video-player";
import { useEffect, useState } from "react";

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
  const { sendRequest, error } = useHttp();
  const [loading, setLoading] = useState(false);

  const handleCancelNewVideo = () => {
    dispatch(lessonActions.resetCurrentType());
  };

  const handleCancelEditVideo = () => {
    dispatch(lessonActions.setBlogEdition(null));
  };

  const handleSubmit = (value: {
    title: string;
    description: string | null;
    videoValue: string;
    fileValue: File | null;
  }) => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        title: value.title,
        description: value.description ?? "",
        type: "video",
        order,
        url: value.fileValue ? "" : value.videoValue,
      })
    );
    if (value.fileValue) {
      fd.append("video", value.fileValue);
    }
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      if (data.success) {
        toast.success(data.message);
        dispatch(lessonActions.addActivity(data.response));
        dispatch(lessonActions.resetCurrentType());
        setLoading(false);
      }
    };
    setLoading(true);
    sendRequest(
      {
        path: `/activity/video/${lessonId}`,
        method: "post",
        body: fd,
      },
      applyData
    );
  };

  const handleUpdate = (value: {
    videoValue: string;
    fileValue: File | null;
    title: string;
    description: string | null;
  }) => {
    console.log({ value });

    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        id: activity!.id,
        url: value.fileValue ? "" : value.videoValue,
        title: value.title,
        description: value.description,
      })
    );
    if (value.fileValue) {
      fd.append("video", value.fileValue);
    }
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      //console.log(data);
      if (data.success) {
        toast.success(data.message);
        setLoading(false);
      }
      dispatch(lessonActions.updateActivity(data.response));
      dispatch(lessonActions.setBlogEdition(null));
    };
    setLoading(true);
    sendRequest(
      {
        path: "/activity/video",
        method: "put",
        body: fd,
      },
      applyData
    );
  };

  // affichage des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
    }
  }, [error]);

  return (
    <main className="w-full flex justify-center">
      {activity === undefined ? (
        <VideoEditor
          title={""}
          description={""}
          onSubmit={handleSubmit}
          onCancel={handleCancelNewVideo}
          loading={loading}
        />
      ) : null}
      {activity !== undefined && blogEdition === activity.id ? (
        <VideoEditor
          propVideo={activity.url}
          title={activity.title ?? ""}
          description={activity.description ?? ""}
          loading={loading}
          onSubmit={handleUpdate}
          onCancel={handleCancelEditVideo}
        />
      ) : null}
      {activity !== undefined && blogEdition !== activity.id ? (
        <VideoPlayer
          source={activity.url}
          title={activity.title!}
          description={activity.description}
        />
      ) : null}
    </main>
  );
}
