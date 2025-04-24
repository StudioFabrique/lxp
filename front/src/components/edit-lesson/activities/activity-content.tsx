import type { Activity } from "../../../utils/interfaces/activity";
import BlogUpdate from "./blog-update";
import ImageActivityPreview from "./image/image-activity-preview";
import ResourcePreview from "./resources/preview/resource-preview";
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
  if (activity.type === "image") {
    return (
      <ImageActivityPreview
        activity={activity}
        isEditing={isEditing}
        onSubmitted={onSubmitted}
      />
    );
  }

  if (activity.type === "resource") {
    return <ResourcePreview activity={activity} onCancel={onCancel} />;
  }
  return null;
};

export default ActivityContent;
