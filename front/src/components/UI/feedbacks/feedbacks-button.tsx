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
    emoji: ["⭐"],
    spread: 100,
    startVelocity: 20,
    elementCount: starCount,
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

type TFunction = (...args: unknown[]) => void;

type FeedbackButtonProps<TFunc extends TFunction> = {
  title: string;
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  feedbackType: RewardType;
  elementCount?: number; // Seulement lorsque feedbackType === ""
  enableAnimationOnClick: boolean;
  onClick: TFunc;
};

// Bouton avec un trigger onClick et une animation de feedback au click
const FeedbacksButton = <TFunc extends (...args: unknown[]) => void>({
  title,
  className,
  feedbackType,
  elementCount,
  enableAnimationOnClick,
  onClick,
}: FeedbackButtonProps<TFunc>) => {
  const rewardProperties = getRewardProperties(feedbackType, elementCount);

  const { reward, isAnimating } = useReward(
    rewardProperties.id,
    rewardProperties.type as "emoji" | "confetti" | "balloons",
    rewardProperties.config,
  );

  const handleClick = () => {
    enableAnimationOnClick && reward();
    onClick();
  };

  return (
    <div className="relative">
      <span
        id={rewardProperties.id}
        className="absolute -translate-x-1/2 bottom-full"
      />
      <button {...{ className }} disabled={isAnimating} onClick={handleClick}>
        {title}
      </button>
    </div>
  );
};

export default FeedbacksButton;
