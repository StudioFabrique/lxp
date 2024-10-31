import Editor from "../markdown-editor/mark-down-editor";
import Video from "./activities/video";
import ImageActivity from "./activities/image/image-activity-editor";
import { Dispatch, SetStateAction } from "react";

type CurrentBlockProps = {
  isSubmitting: boolean;
  activityType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (value: any) => void;
  setActivityType: Dispatch<SetStateAction<string>>;
};

export default function CurrentBlock({
  activityType,
  isSubmitting,
  setActivityType,
  onSubmit,
}: CurrentBlockProps) {
  const handleCancel = () => {
    setActivityType("");
  };

  return (
    <>
      {activityType ? (
        <>
          {activityType === "text" ? (
            <Editor
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
            />
          ) : null}
          {activityType === "video" ? <Video /> : null}
          {activityType === "image" ? <ImageActivity /> : null}
        </>
      ) : null}
    </>
  );
}
