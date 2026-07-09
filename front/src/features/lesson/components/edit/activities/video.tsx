import { lessonApi } from "../../../api/lesson.api";
import type { Activity } from "../../../../../../src/utils/interfaces/activity";
import { useParams } from "react-router";
import VideoEditor from "./video-editor";
import toast from "react-hot-toast";
import { useState, useCallback, useEffect } from "react";
import VideoPlayer from "../../../../../components/UI/VideoPlayer";

interface VideoProps {
  activity?: Activity;
  onCancel: () => void;
  isEditing: boolean;
}

const isValidYouTubeUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return pattern.test(url);
};

export default function Video({ activity, onCancel, isEditing }: VideoProps) {
  const { lessonId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (value: {
      title: string;
      description: string | null;
      videoValue: string;
      fileValue: File | null;
    }) => {
      if (
        value.videoValue &&
        !value.fileValue &&
        !isValidYouTubeUrl(value.videoValue)
      ) {
        toast.error("URL YouTube invalide");
        return;
      }

      setLoading(true);

      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          title: value.title,
          description: value.description,
          url: value.fileValue ? "" : value.videoValue,
        }),
      );

      if (value.fileValue) {
        fd.append("video", value.fileValue);
      }

      const id = activity?.id ?? lessonId!;

      lessonApi.mutations
        .upsertVideoActivity(id, fd, activity ? "put" : "post")
        .then((data: { success: boolean; message: string }) => {
          if (data.success) {
            toast.success(data.message);
            onCancel();
          }
        })
        .catch((err: any) => {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Une erreur est survenue"
          );
        })
        .finally(() => setLoading(false));
    },
    [activity, lessonId, onCancel],
  );

  const renderContent = () => {
    if (activity && isEditing) {
      return (
        <VideoEditor
          propVideo={activity.url}
          title={activity.title ?? ""}
          description={activity.description ?? ""}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      );
    }

    if (activity && !isEditing) {
      return (
        <VideoPlayer
          source={activity.url}
          title={activity.title!}
          description={activity.description}
        />
      );
    }

    return (
      <VideoEditor
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
      />
    );
  };

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <main className="w-full flex justify-center mt-4">{renderContent()}</main>
  );
}
