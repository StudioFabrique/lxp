import Video from "./activities/video";
import ImageActivityEditor from "./activities/image/image-activity-editor";
import ResourceUpload from "./activities/resources/resource-upload";
import BlogEditor from "./activities/text-editor/blog-editor";

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
          {activityType === "text" ? <BlogEditor onCancel={onFinish} /> : null}
          {activityType === "video" ? (
            <Video onCancel={onFinish} isEditing={true} />
          ) : null}
          {activityType === "image" ? (
            <ImageActivityEditor onCancel={onFinish} />
          ) : null}
          {activityType === "resource" ? (
            <ResourceUpload onCancel={onFinish} onResetForm={() => {}} />
          ) : null}
        </>
      ) : null}
    </>
  );
}
