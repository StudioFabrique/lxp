import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudSunIcon,
  CloudSunRainIcon,
  SunIcon,
} from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context.store";
import useHttp from "../../../hooks/use-http";

const FeelingFeedback = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { socket } = useContext(Context);

  /* const [xPos, setXPos] = useState<{ previous?: number; current?: number }>(); */

  const [currentProgressValue, setCurrentProgressValue] = useState<number>(4);

  const [commentValue, setCommentValue] = useState<string>();

  const CurrentIcon = () => {
    switch (currentProgressValue) {
      case 1:
        return <CloudLightningIcon />;
      case 2:
        return <CloudFogIcon />;
      case 3:
        return <CloudRainIcon />;
      case 4:
        return <CloudSnowIcon />;
      case 5:
        return <CloudSunRainIcon />;
      case 6:
        return <CloudSunIcon />;
      case 7:
        return <SunIcon />;
      default:
        return undefined;
    }
  };

  const handleSubmitFeedback = () => {};

  useEffect(() => {
    sendRequest({ path: "/user/feedback", method: "get" });
  }, [sendRequest]);

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
        min={1}
        max={7}
        step={1}
      />
      <p>{"Commentaire (facultatif)"}</p>
      <textarea
        onChange={(e) => setCommentValue(e.currentTarget.value)}
        value={commentValue}
        className="textarea text-base-content resize-none"
      />
      <button
        type="button"
        className="btn btn-xs self-end btn-primary text-white"
        onClick={handleSubmitFeedback}
      >
        Envoyer
      </button>
    </div>
  );
};

export default FeelingFeedback;
