import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudSunIcon,
  CloudSunRainIcon,
  SunIcon,
} from "lucide-react";
import { ChangeEvent, useState } from "react";

const maxIcon = 7;
const baseIncrementalValue = (1 * 100) / maxIcon;

const roundedIconValue = (index: number, precision: number = 100) =>
  Math.floor((index / maxIcon) * precision);

const FeelingFeedback = () => {
  /* const [xPos, setXPos] = useState<{ previous?: number; current?: number }>(); */

  const [currentProgressValue, setCurrentProgressValue] = useState<number>(
    baseIncrementalValue * 4
  );

  console.log(currentProgressValue);

  const CurrentIcon = () => {
    switch (Math.floor(currentProgressValue)) {
      case roundedIconValue(1):
        return <CloudLightningIcon />;
      case roundedIconValue(2):
        return <CloudFogIcon />;
      case roundedIconValue(3):
        return <CloudRainIcon />;
      case roundedIconValue(4):
        return <CloudSnowIcon />;
      case roundedIconValue(5):
        return <CloudSunRainIcon />;
      case roundedIconValue(6):
        return <CloudSunIcon />;
      case roundedIconValue(7):
        return <SunIcon />;
      default:
        return undefined;
    }
  };

  // watch the xPos and determine if the progress bar increase or decrease
  /* useEffect(() => {
    if (
      xPos &&
      xPos.previous &&
      xPos.current &&
      xPos.current !== xPos.previous
    ) {
      if (xPos.current > xPos.previous) {
        setCurrentProgressValue((previousValue) => {
          const calculation = previousValue + baseIncrementalValue;

          return Math.floor(calculation * 100) > roundedIconValue(6)
            ? baseIncrementalValue * maxIcon
            : calculation;
        });
      } else {
        setCurrentProgressValue((previousValue) => {
          const calculation = previousValue - baseIncrementalValue;

          return calculation < baseIncrementalValue
            ? baseIncrementalValue
            : calculation;
        });
      }
    }
  }, [xPos]); */

  /* const handleDrag = (xPos: number) => {
    setXPos((previousXPos) => {
      return { previous: previousXPos?.current ?? xPos, current: xPos };
    });
  }; */

  return (
    <div className="flex flex-col gap-4 bg-secondary text-secondary-content p-5 rounded-lg">
      <span className="flex justify-between">
        <p className="font-bold w-[70%]">
          Comment vous sentez-vous aujourd'hui ?
        </p>
        <CurrentIcon />
      </span>
      <input
        type="range"
        className="range range-xs range-primary my-2 bg-secondary-focus"
        value={currentProgressValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCurrentProgressValue(e.currentTarget.valueAsNumber)
        }
        min={baseIncrementalValue * 1}
        max={baseIncrementalValue * 7.1}
        step={baseIncrementalValue}
      />
      <p>{"Commentaire (facultatif)"}</p>
      <textarea className="textarea resize-none text-black" />
      <button
        type="button"
        className="btn btn-xs self-end btn-primary text-white"
      >
        Envoyer
      </button>
    </div>
  );
};

export default FeelingFeedback;
