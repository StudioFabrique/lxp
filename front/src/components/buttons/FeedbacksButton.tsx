import { HTMLAttributes, PropsWithChildren, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useReward } from "react-rewards";
import { useVisualPreferences } from "../../store/VisualPreferences";

const thumbsRewardProperties = {
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
  type: "confetti",
  config: {
    startVelocity: 15,
    spread: 90,
    elementCount: 40,
    decay: 0.92,
  },
};

const balloonsRewardProperties = {
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
  feedbackType: RewardType;
  elementCount?: number; // Seulement lorsque feedbackType === ""
  showFeedback: boolean;
  disabled?: boolean;
  onClick: TFunc;
};

// Bouton avec un trigger onClick et une animation de feedback au click
const FeedbacksButton = <TFunc extends () => void>({
  className,
  feedbackType,
  elementCount,
  showFeedback,
  disabled,
  onClick,
  children,
}: PropsWithChildren<FeedbackButtonProps<TFunc>>) => {
  const { confetti } = useVisualPreferences();
  const rewardProperties = getRewardProperties(feedbackType, elementCount);
  const rewardId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const originRef = useRef<HTMLSpanElement>(null);

  const { reward, isAnimating } = useReward(
    rewardId,
    rewardProperties.type as "emoji" | "confetti" | "balloons",
    { ...rewardProperties.config, position: "absolute" },
  );

  const handleClick = () => {
    if (showFeedback && confetti && buttonRef.current && originRef.current) {
      const { left, top, width } = buttonRef.current.getBoundingClientRect();
      originRef.current.style.left = `${left + width / 2}px`;
      originRef.current.style.top = `${top}px`;
      reward();
    }
    onClick();
  };

  return (
    <div className="relative">
      {/* Keep particles outside scrollable containers, including modal boxes. */}
      {typeof document !== "undefined" && createPortal(
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden"
        >
          <span id={rewardId} ref={originRef} className="absolute size-0" />
        </div>,
        document.body,
      )}
      <button
        ref={buttonRef}
        {...{ className }}
        disabled={isAnimating || disabled}
        onClick={handleClick}
      >
        {children}
      </button>
    </div>
  );
};

export default FeedbacksButton;
