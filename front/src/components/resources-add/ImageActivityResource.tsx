import { Activity } from "../../../src/utils/interfaces/activity";
import ImageActivityEditor from "../../features/lesson/components/edit/activities/image/image-activity-editor";
import toast from "react-hot-toast";
import apiClient from "../../lib/axios";
import ImageActivityPreview from "../../features/lesson/components/edit/activities/image/image-activity-preview";

type Props = {
  activity?: Activity;
  mode: "read" | "edit" | "write";
  resourceId: number;
  onCancel: (value: boolean) => void;
};

export default function ImageActivityResource(props: Props) {
  const handleImageSubmit = async (fd: FormData) => {
    try {
      const { data } = await apiClient.request({
        url: `/activity/image/${props.activity?.id ?? props.resourceId}/resource`,
        method: props.activity ? "put" : "post",
        data: fd,
      });
      if (data.success) {
        toast.success(data.message);
        props.onCancel(false);
      }
    } catch {
      // silently fail
    }
  };

  if (props.mode === "read" && props.activity) {
    return (
      <ImageActivityPreview
        activity={props.activity}
        isEditing={false}
        onSubmitted={props.onCancel}
      />
    );
  }

  return (
    <ImageActivityEditor
      activity={props.activity}
      onCancel={props.onCancel}
      parent="resource"
      onSubmit={handleImageSubmit}
    />
  );
}
