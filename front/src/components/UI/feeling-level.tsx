import {
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  CloudSunRainIcon,
  SunIcon,
} from "lucide-react";

interface FeelingLevelProps {
  value: number;
}

export default function FeelingLevel({ value }: FeelingLevelProps) {
  const iconClassname = "w-10 h-10";

  switch (value) {
    case 1:
      return <CloudLightningIcon className={iconClassname} />;
    case 2:
      return <CloudRainIcon className={iconClassname} />;
    case 3:
      return <CloudSunRainIcon className={iconClassname} />;
    case 4:
      return <CloudSunIcon className={iconClassname} />;
    case 5:
      return <SunIcon className={iconClassname} />;
    default:
      return undefined;
  }
}
