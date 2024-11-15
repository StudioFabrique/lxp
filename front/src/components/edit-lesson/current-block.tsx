import Editor from "../markdown-editor/mark-down-editor";
import Video from "./activities/video";
import ImageActivityEditor from "./activities/image/image-activity-editor";

type CurrentBlockProps = {
  activityType: string;
  onFinish: () => void;
};

export default function CurrentBlock({
  activityType,
  onFinish,
}: CurrentBlockProps) {
  return (
    <>
      {activityType ? (
        <>
          {activityType === "text" ? <Editor onCancel={onFinish} /> : null}
          {activityType === "video" ? (
            <Video onCancel={onFinish} isEditing={true} />
          ) : null}
          {activityType === "image" ? (
            <ImageActivityEditor onCancel={onFinish} />
          ) : null}
        </>
      ) : null}
    </>
  );
}
