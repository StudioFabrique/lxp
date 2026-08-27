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
  onSaved?: (activity?: Activity) => void | Promise<void>;
  isEditing: boolean;
  parentId?: number;
  parent?: "lesson" | "resource";
}

const isValidYouTubeUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return pattern.test(url);
};

export default function Video({
  activity,
  onCancel,
  onSaved,
  isEditing,
  parentId,
  parent = "lesson",
}: VideoProps) {
  const { lessonId, resourceId } = useParams();
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
          parent,
          parentType: parent,
        }),
      );

      if (value.fileValue) {
        fd.append("video", value.fileValue);
      }

      const routeParentId = parent === "resource" ? resourceId : lessonId;
      const id = activity?.id ?? parentId ?? routeParentId;

      if (id === undefined) {
        setLoading(false);
        toast.error("Impossible d'identifier le parent de la vidéo.");
        return;
      }

      try {
        const data = (await lessonApi.mutations.upsertVideoActivity(
          id,
          fd,
          activity ? "put" : "post",
        )) as {
          success: boolean;
          message: string;
          response?: Activity;
        };

        if (data.success) {
          toast.success(data.message);
          if (onSaved) await onSaved(data.response);
          else onCancel();
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    },
    [activity, lessonId, onCancel, onSaved, parent, parentId, resourceId],
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
        <VideoPlayer url={activity.url} size="medium" />
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
