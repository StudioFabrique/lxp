import {
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  CloudSunRainIcon,
  SunIcon,
} from "lucide-react";

import { iconSizeStyle } from "../../utils/icon-size-style";

interface FeelingLevelProps {
  value: number;
  size?: number;
}

export default function FeelingLevel({ value, size = 10 }: FeelingLevelProps) {
  const iconStyle = iconSizeStyle(size);

  switch (value) {
    case 1:
      return <CloudLightningIcon style={iconStyle} />;
    case 2:
      return <CloudRainIcon style={iconStyle} />;
    case 3:
      return <CloudSunRainIcon style={iconStyle} />;
    case 4:
      return <CloudSunIcon style={iconStyle} />;
    case 5:
      return <SunIcon style={iconStyle} />;
    default:
      return undefined;
  }
}
