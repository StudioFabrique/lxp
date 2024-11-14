import { ACTIVITIES } from "../../../../config/urls";
import Activity from "../../../../utils/interfaces/activity";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import ImageActivityEditor from "./image-activity-editor";

type Props = {
  activity: Activity;
  isEditing: boolean;
  onCancel: () => void;
};

export default function ImageActivityPreview({
  activity,
  isEditing,
  onCancel,
}: Props) {
  return (
    <>
      {isEditing ? (
        <ImageActivityEditor activity={activity} onCancel={onCancel} />
      ) : null}
      <Wrapper>
        <img src={`${ACTIVITIES}images/${activity.url}`} />
      </Wrapper>
    </>
  );
}
