import { HTMLAttributes } from "react";
import { useReward } from "react-rewards";

const thumbsRewardProperties = {
  id: "thumb-up",
  type: "emoji",
  config: {
    emoji: ["🎉", "👍", "⭐", "🌟"],
    spread: 100,
    startVelocity: 20,
    elementCount: 10,
    decay: 0.95,
    rotate: false,
    lifetime: 100,
  },
};

// const totoRewardProperties = {
//   id: "thumb-up",
//   type: "emoji",
//   config: {
//     emoji: ["😈", "👹", "👺", "💩", "☠️"],
//   },
// };

const starsRewardProperties = (starCount: number = 5) => ({
  id: "thumb-up",
  type: "emoji",
  config: {
    emoji: ["⭐", starCount > 2 ? ["🥳", "☺️"] : ["😭", "😭"]],
    spread: 100,
    startVelocity: 20,
    elementCount: starCount * 3,
    decay: 0.95,
    rotate: false,
    lifetime: 100,
  },
});

const confettiRewardProperties = {
  id: "thumb-up",
  type: "confetti",
  config: undefined,
};

const balloonsRewardProperties = {
  id: "thumb-up",
  type: "balloons",
  config: undefined,
};

type RewardType = "thumbUp" | "confetti" | "balloons" | "stars";

const getRewardProperties = (rewardType: RewardType, elementCount?: number) => {
  switch (rewardType) {
    case "thumbUp":
      return thumbsRewardProperties;
    case "balloons":
      return balloonsRewardProperties;
    case "stars":
      return starsRewardProperties(elementCount);
    case "confetti":
    default:
      return confettiRewardProperties;
  }
};

type FeedbackButtonProps<TFunc extends () => void> = {
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  customLabel?: string;
  feedbackType: RewardType;
  elementCount?: number; // Seulement lorsque feedbackType === ""
  isLessonCompleted: boolean;
  disabled?: boolean;
  onClick: TFunc;
};

// Bouton avec un trigger onClick et une animation de feedback au click
const FeedbacksButton = <TFunc extends () => void>({
  className,
  customLabel,
  feedbackType,
  elementCount,
  isLessonCompleted,
  disabled,
  onClick,
}: FeedbackButtonProps<TFunc>) => {
  const rewardProperties = getRewardProperties(feedbackType, elementCount);

  const { reward, isAnimating } = useReward(
    rewardProperties.id,
    rewardProperties.type as "emoji" | "confetti" | "balloons",
    rewardProperties.config
  );

  const handleClick = () => {
    !isLessonCompleted && reward();
    onClick();
  };

  return (
    <div className="relative">
      <span
        id={rewardProperties.id}
        className="absolute -translate-x-1/2 bottom-full"
      />
      <button
        {...{ className }}
        disabled={isAnimating || disabled}
        onClick={handleClick}
      >
        {customLabel
          ? customLabel
          : isLessonCompleted
          ? "Leçon Suivante"
          : "Marquer comme terminé"}
      </button>
    </div>
  );
};

export default FeedbacksButton;
