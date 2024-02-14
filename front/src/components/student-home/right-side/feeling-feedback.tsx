import { CloudSunRainIcon } from "lucide-react";
import { useEffect, useState } from "react";

const incrementalValue = 1 / 7;

const FeelingFeedback = () => {
  const [xPos, setXPos] = useState<{ previous?: number; current?: number }>();

  const [currentProgressValue, setCurrentProgressValue] = useState<number>(
    incrementalValue * 4
  );

  const [currentIcon, setCurrentIcon] = useState();

  // watch the xPos and determine if the progress bar increase or decrease
  useEffect(() => {
    if (
      xPos &&
      xPos.previous &&
      xPos.current &&
      xPos.current !== xPos.previous
    ) {
      if (xPos.current > xPos.previous) {
        // + 1
        console.log("+1");
      } else {
        // -1
        console.log("-1");
      }
    }
  }, [xPos]);

  const handleDrag = (xPos: number) => {
    setXPos((previousXPos) => {
      return { previous: previousXPos?.current ?? xPos, current: xPos };
    });
  };

  return (
    <div className="flex flex-col gap-2 bg-secondary text-secondary-content p-5 rounded-lg">
      <span className="flex justify-between">
        <p className="font-bold w-[70%]">
          Comment vous sentez-vous aujourd'hui ?
        </p>
        <CloudSunRainIcon className="w-10 h-10" />
      </span>
      <progress
        className="progress progress-primary bg-secondary-focus cursor-grab"
        value={currentProgressValue}
        onDrag={(e) => handleDrag(e.clientX)}
      />
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
