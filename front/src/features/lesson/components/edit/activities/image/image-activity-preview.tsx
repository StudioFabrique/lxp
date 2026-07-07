import { ACTIVITIES } from "../../../../../../../src.legacy/config/urls";
import type { Activity } from "../../../../../../../src.legacy/utils/interfaces/activity";
import ImageActivityEditor from "./image-activity-editor";

type Props = {
  activity: Activity;
  isEditing: boolean;
  onSubmitted: (value: boolean) => void;
};

export default function ImageActivityPreview({
  activity,
  isEditing,
  onSubmitted,
}: Props) {
  return (
    <>
      {isEditing ? (
        <ImageActivityEditor activity={activity} onCancel={onSubmitted} />
      ) : (
        <div className="w-full flex justify-center">
          <img
            className="w-96 h-auto rounded-lg shadow-lg border border-primary/50"
            src={`${ACTIVITIES}images/${activity.url}`}
          />
        </div>
      )}
    </>
  );
}
