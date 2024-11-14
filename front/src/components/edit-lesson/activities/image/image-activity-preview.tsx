import { ACTIVITIES } from "../../../../config/urls";
import Activity from "../../../../utils/interfaces/activity";
import Wrapper from "../../../UI/wrapper/wrapper.component";
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
        <Wrapper>
          <img src={`${ACTIVITIES}images/${activity.url}`} />
        </Wrapper>
      )}
    </>
  );
}
