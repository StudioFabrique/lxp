import { useState, useEffect, useCallback } from "react";
import type { Activity } from "../../../utils/interfaces/activity";
import ImageActivityEditor from "../../edit-lesson/activities/image/image-activity-editor";

type ImageActivityEditingProps = {
  activity: Activity;
  onRefreshAllData?: () => void;
  onActivityEditChange?: (isEditing: boolean) => void;
  shouldStartEdit?: boolean;
  forceStopEdit?: boolean;
};

const ImageActivityEditing = ({
  activity,
  onRefreshAllData,
  onActivityEditChange,
  shouldStartEdit = false,
  forceStopEdit = false,
}: ImageActivityEditingProps) => {
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

  const handleCancel = useCallback(
    (submitted: boolean) => {
      setIsEditingActivity(false);
      if (submitted) {
        onRefreshAllData?.();
      }
    },
    [onRefreshAllData]
  );

  if (!isEditingActivity) {
    return null;
  }

  return (
    <div className="mt-4 w-full bg-base-200 rounded-lg p-4">
      <ImageActivityEditor activity={activity} onCancel={handleCancel} />
    </div>
  );
};

export default ImageActivityEditing;
