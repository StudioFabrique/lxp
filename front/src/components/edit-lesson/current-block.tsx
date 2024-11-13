import Editor from "../markdown-editor/mark-down-editor";
import Video from "./activities/video";
import ImageActivity from "./activities/image/image-activity-editor";
import { Dispatch, SetStateAction } from "react";

type CurrentBlockProps = {
  activityType: string;
  setActivityType: Dispatch<SetStateAction<string>>;
};

export default function wCurrentBlock({
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
          {activityType === "video" ? <Video /> : null}
          {activityType === "image" ? <ImageActivity /> : null}
        </>
      ) : null}
    </>
  );
}
