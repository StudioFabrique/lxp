/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import { useParams } from "react-router-dom";
import VideoEditor from "./video-editor";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import toast from "react-hot-toast";
import VideoPlayer from "../../UI/video-player";

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

  const handleCancelNewVideo = () => {
    dispatch(lessonActions.resetCurrentType());
  };

  const handleCancelEditVideo = () => {
    dispatch(lessonActions.setBlogEdition(null));
  };

  const handleSubmit = (value: {
    videoValue: string;
    fileValue: File | null;
  }) => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
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
      }
    };
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
  }) => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        id: activity!.id,
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
      //console.log(data);
      if (data.success) {
        toast.success(data.message);
      }
      dispatch(lessonActions.updateActivity(data.response));
      dispatch(lessonActions.setBlogEdition(null));
    };
    sendRequest(
      {
        path: "/activity/video",
        method: "put",
        body: fd,
      },
      applyData
    );
  };

  return (
    <main>
      {activity === undefined ? (
        <VideoEditor onSubmit={handleSubmit} onCancel={handleCancelNewVideo} />
      ) : null}
      {activity !== undefined && blogEdition === activity.id ? (
        <VideoEditor
          propVideo={activity.url}
          onSubmit={handleUpdate}
          onCancel={handleCancelEditVideo}
        />
      ) : null}
      {activity !== undefined && blogEdition !== activity.id ? (
        <VideoPlayer source={activity.url} />
      ) : null}
    </main>
  );
}
