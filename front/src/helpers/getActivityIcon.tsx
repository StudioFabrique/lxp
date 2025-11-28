import { FileStack, Image, TextInitial, Video } from "lucide-react";

export const getActivityIcon = (
  activityType: "text" | "video" | "resource" | "image" | "iframe",
  size: number = 4,
): JSX.Element => {
  let icon: JSX.Element;

  const iconStyle = `w-${size} h-${size} text-primary`;

  switch (activityType) {
    case "text":
      icon = <TextInitial className={iconStyle} />;
      break;
    case "video":
      icon = <Video className={iconStyle} />;
      break;
    case "resource":
      icon = <FileStack className={iconStyle} />;
      break;
    case "image":
      icon = <Image className={iconStyle} />;
      break;
    default:
      icon = <span>❓</span>;
  }

  return icon;
};
