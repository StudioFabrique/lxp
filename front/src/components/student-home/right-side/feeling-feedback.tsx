import { CloudSunRainIcon } from "lucide-react";

const FeelingFeedback = () => {
  return (
    <div className="flex flex-col bg-secondary text-secondary-content p-5 rounded-lg">
      <span className="flex justify-between">
        <p className="font-bold w-[70%]">
          Comment vous sentez-vous aujourd'hui ?
        </p>
        <CloudSunRainIcon className="w-10 h-10" />
      </span>
      <progress className="progress" value={0.3} />
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
