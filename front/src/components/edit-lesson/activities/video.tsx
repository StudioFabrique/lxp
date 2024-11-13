/* eslint-disable @typescript-eslint/no-explicit-any */

import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import { useParams } from "react-router-dom";
import VideoEditor from "./video-editor";
import toast from "react-hot-toast";
import { useState } from "react";
import VideoPlayer from "../../UI/video-player";

interface VideoProps {
  activity?: Activity;
  onCancel: () => void;
  isEditing: boolean;
}

function isValidYouTubeUrl(url: string) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return pattern.test(url);
}

export default function Video({ activity, onCancel, isEditing }: VideoProps) {
  const { lessonId } = useParams();
  const { sendRequest } = useHttp();
  const [loading, setLoading] = useState(false);

  const handleCancelEditVideo = () => {
    onCancel();
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
        description: value.description,
        url: value.fileValue ? "" : value.videoValue,
      })
    );
    if (value.fileValue) {
      fd.append("video", value.fileValue);
    }
    if (value.videoValue && !value.fileValue) {
      if (!isValidYouTubeUrl(value.videoValue)) {
        toast.error("URL YouTube invalide");
        setLoading(false);
        return;
      }
    }
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      if (data.success) {
        toast.success(data.message);
        onCancel();
        setLoading(false);
      }
    };
    setLoading(true);
    sendRequest(
      {
        path: `/activity/video/${activity?.id ?? lessonId}`,
        method: activity ? "put" : "post",
        body: fd,
      },
      applyData
    );
    setLoading(false);
    onCancel();
  };

  return (
    <main className="w-full flex justify-center mt-4">
      {activity !== undefined && isEditing ? (
        <VideoEditor
          propVideo={activity.url}
          title={activity.title ?? ""}
          description={activity.description ?? ""}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancelEditVideo}
        />
      ) : null}
      {activity !== undefined && !isEditing ? (
        <VideoPlayer
          source={activity.url}
          title={activity.title!}
          description={activity.description}
        />
      ) : null}
    </main>
  );
}
