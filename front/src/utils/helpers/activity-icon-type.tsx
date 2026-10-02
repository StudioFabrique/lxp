import { FileSpreadsheet, Image, MonitorPlay, Text, Video } from "lucide-react";
import { iconSizeStyle } from "../icon-size-style";
import type { Activity } from "../interfaces/activity";

const activityIconType = (type: Activity["type"], size?: number) => {
  const style = iconSizeStyle(size || 5);

  switch (type) {
    case "text":
      return <Text style={style} />;
    case "video":
      return <Video style={style} />;
    case "image":
      return <Image style={style} />;
    case "iframe":
      return <MonitorPlay style={style} />;
    case "file":
    case "resource":
      return <FileSpreadsheet style={style} />;
    default:
      return <FileSpreadsheet style={style} />;
  }
};

export default activityIconType;
