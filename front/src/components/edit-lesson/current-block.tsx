import Editor from "../markdown-editor/mark-down-editor";
import Video from "./activities/video";
import ImageActivityEditor from "./activities/image/image-activity-editor";
import { Dispatch, SetStateAction } from "react";

type CurrentBlockProps = {
  activityType: string;
  setActivityType: Dispatch<SetStateAction<string>>;
};

export default function CurrentBlock({
  activityType,
  setActivityType,
}: CurrentBlockProps) {
  const handleCancel = () => {
    setActivityType("");
  };

  return (
    <>
      {activityType ? (
        <>
          {activityType === "text" ? <Editor onCancel={handleCancel} /> : null}
          {activityType === "video" ? (
            <Video onCancel={handleCancel} isEditing={true} />
          ) : null}
          {activityType === "image" ? (
            <ImageActivityEditor onCancel={handleCancel} />
          ) : null}
        </>
      ) : null}
    </>
  );
}
