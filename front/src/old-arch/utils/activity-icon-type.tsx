import { FileSpreadsheet, Image, MonitorPlay, Text, Video } from "lucide-react";
import { Activity } from "./interfaces/activity";

const activityIconType = (type: Activity["type"], size?: number) => {
  const iconSize = size ? `w-${size} h-${size}` : "w-5 h-5";
  // const iconSizePlus = size ? `w-${size + 2} h-${size + 2}` : "w-7 h-7";

  switch (type) {
    case "text":
      return <Text className={iconSize} />;
    case "video":
      return <Video className={iconSize} />;
    case "image":
      return <Image className={iconSize} />;
    case "iframe":
      return <MonitorPlay className={iconSize} />;
    case "file":
    case "resource":
      return <FileSpreadsheet className={iconSize} />;
    default:
      return <FileSpreadsheet className={iconSize} />;
  }
};

export default activityIconType;
