import { useState, useEffect, useCallback } from "react";
import type { Activity } from "../../../utils/interfaces/activity";
import VideoEditor from "../../edit-lesson/activities/video-editor";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";

type VideoActivityEditingProps = {
  activity: Activity;
  onRefreshAllData?: () => void;
  onActivityEditChange?: (isEditing: boolean) => void;
  shouldStartEdit?: boolean;
  forceStopEdit?: boolean;
};

const VideoActivityEditing = ({
  activity,
  onRefreshAllData,
  onActivityEditChange,
  shouldStartEdit = false,
  forceStopEdit = false,
}: VideoActivityEditingProps) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [isEditingActivity, setIsEditingActivity] = useState<boolean>(false);

  // Effet pour déclencher l'édition depuis l'extérieur
  useEffect(() => {
    if (shouldStartEdit && !isEditingActivity) {
      setIsEditingActivity(true);
    }
  }, [shouldStartEdit, isEditingActivity]);

  // Effet pour forcer l'arrêt de l'édition depuis l'extérieur
  useEffect(() => {
    if (forceStopEdit && isEditingActivity) {
      setIsEditingActivity(false);
    }
  }, [forceStopEdit, isEditingActivity]);

  // Notifier le parent du changement d'état d'édition
  useEffect(() => {
    onActivityEditChange?.(isEditingActivity);
  }, [isEditingActivity, onActivityEditChange]);

  const handleSubmit = useCallback(
    (value: {
      videoValue: string;
      fileValue: File | null;
      title: string;
      description: string | null;
    }) => {
      // Créer le FormData pour l'envoi
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          title: value.title,
          description: value.description,
          url: value.fileValue ? "" : value.videoValue,
        })
      );

      // Ajout du fichier vidéo si présent
      if (value.fileValue) {
        fd.append("video", value.fileValue);
      }

      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
          setIsEditingActivity(false);
          onRefreshAllData?.();
        }
      };

      sendRequest(
        {
          path: `/activity/video/${activity.id}`,
          method: "put",
          body: fd,
        },
        applyData
      );
    },
    [activity.id, sendRequest, onRefreshAllData]
  );

  const handleCancel = useCallback(() => {
    setIsEditingActivity(false);
  }, []);

  if (!isEditingActivity) {
    return null;
  }

  return (
    <div className="mt-4 w-full bg-base-200 rounded-lg p-4">
      <VideoEditor
        propVideo={activity.url || ""}
        title={activity.title || ""}
        description={activity.description || ""}
        loading={isLoading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default VideoActivityEditing;
