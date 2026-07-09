import { Files, Image, MonitorPlay, TextInitial, Video } from "lucide-react";

export const getActivityIcon = (
  activityType: "text" | "video" | "resource" | "image" | "iframe",
  size: number = 4,
): React.JSX.Element => {
  let icon: React.JSX.Element;

  const iconStyle = `w-${size} h-${size} text-primary`;

  switch (activityType) {
    case "text":
      icon = <TextInitial className={iconStyle} />;
      break;
    case "video":
      icon = <Video className={iconStyle} />;
      break;
    case "resource":
      icon = <Files className={iconStyle} />;
      break;
    case "image":
      icon = <Image className={iconStyle} />;
      break;
    case "iframe":
      icon = <MonitorPlay className={iconStyle} />;
      break;
    default:
      icon = <span>❓</span>;
  }

  return icon;
};
