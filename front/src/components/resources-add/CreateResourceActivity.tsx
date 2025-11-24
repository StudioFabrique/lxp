import { useMemo } from "react";

type Props = {
  activityType: "text" | "video" | "image" | "file";
};

export default function CreateResourceActivity(props: Props) {
  const content = useMemo(() => {
    switch (props.activityType) {
      case "video":
        return <div>Video Activity Creation Form</div>;
      case "text":
        return <div>Text Activity Creation Form</div>;
      case "image":
        return <div>Image Activity Creation Form</div>;
      case "file":
        return <div>File Activity Creation Form</div>;
      default:
        return <div>Unknown Activity Type</div>;
    }
  }, [props.activityType]);

  return <div>{content}</div>;
}
