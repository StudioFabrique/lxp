import { Activity } from "../../utils/interfaces/activity";
import ImageActivityEditor from "../edit-lesson/activities/image/image-activity-editor";

type Props = {
  activity: Activity | null;
  mode: "read" | "edit" | "write";
};

export default function ImageActivityResource(props: Props) {
  if (props.mode === "read") {
    return (
      <div>
        <h2>Admire Image Activity Resource</h2>
        <p>This is a placeholder for the ImageActivityResource component.</p>
      </div>
    );
  }

  if (props.mode === "edit") {
    return (
      <div>
        <h2>UpdateImage Activity Resource</h2>
        <p>This is a placeholder for the ImageActivityResource component.</p>
      </div>
    );
  }

  if (props.mode === "write") {
    return <ImageActivityEditor onCancel={() => {}} parent="resource" />;
  }
}
