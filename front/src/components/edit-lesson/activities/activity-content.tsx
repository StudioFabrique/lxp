import Activity from "../../../utils/interfaces/activity";
import BlogUpdate from "./blog-update";
import Video from "./video";

const ActivityContent = ({
  activity,
  isEditing,
  onSubmitted,
  onCancel,
}: {
  activity: Activity;
  isEditing: boolean;
  onSubmitted: (value: boolean) => void;
  onCancel: () => void;
}) => {
  if (activity.type === "text") {
    return (
      <BlogUpdate
        activity={activity}
        isEditing={isEditing}
        onSubmitted={onSubmitted}
      />
    );
  }
  if (activity.type === "video") {
    return (
      <Video activity={activity} onCancel={onCancel} isEditing={isEditing} />
    );
  }
  return null;
};

export default ActivityContent;
