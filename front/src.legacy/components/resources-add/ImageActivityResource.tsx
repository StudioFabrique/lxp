import { Activity } from "../../utils/interfaces/activity";
import ImageActivityEditor from "../../../src/features/lesson/components/edit/activities/image/image-activity-editor";
import SuccessWithMessage from "../../utils/interfaces/success-with-message";
import toast from "react-hot-toast";
import useHttp from "../../hooks/use-http";
import ImageActivityPreview from "../../../src/features/lesson/components/edit/activities/image/image-activity-preview";

type Props = {
  activity?: Activity;
  mode: "read" | "edit" | "write";
  resourceId: number;
  onCancel: (value: boolean) => void;
};

export default function ImageActivityResource(props: Props) {
  const { sendRequest } = useHttp();

  const handleImageSubmit = (fd: FormData) => {
    const applyData = (data: SuccessWithMessage) => {
      if (data.success) {
        toast.success(data.message);
        props.onCancel(false);
      }
    };
    sendRequest(
      {
        path: `/activity/image/${props.activity?.id ?? props.resourceId}/resource`,
        method: props.activity ? "put" : "post",
        body: fd,
      },
      applyData,
    );
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
