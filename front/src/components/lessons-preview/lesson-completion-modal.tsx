import { useState } from "react";
import RatingWithStars from "../UI/lesson-rating/rating-with-stars";
import Modal from "../UI/modal/modal";
import PortalConfetti from "../UI/portal/portal-confetti";
import FeedbacksButton from "../UI/feedbacks/feedbacks-button";

type LessonCompletionModal = {
  onRateContent: (rating: number) => void;
  onClickModalRightButton?: () => void;
};

const LessonCompletionModal = ({
  onRateContent,
  onClickModalRightButton,
}: LessonCompletionModal) => {
  const [selectedStars, setSelectedStars] = useState<number>(3);

  const handleSelectStarRate = (stars: number) => {
    setSelectedStars(stars);
  };

  const handleRateContent = () => {
    onRateContent(selectedStars);
  };

  return (
    <>
      <PortalConfetti />
      <Modal
        title="Leçon terminée !"
        rightLabel="Leçon suivante"
        onRightClick={onClickModalRightButton}
      >
        <div className="flex flex-col items-center gap-20 p-20 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Votre évaluation</h3>
          <RatingWithStars
            selectedStars={selectedStars}
            onSelectStarRate={handleSelectStarRate}
          />
          <FeedbacksButton
            title="Évaluer ce contenu"
            className="btn btn-primary btn-sm text-nowrap"
            feedbackType="stars"
            elementCount={selectedStars}
            enableAnimationOnClick
            onClick={handleRateContent}
          />
        </div>
      </Modal>
    </>
  );
};

export default LessonCompletionModal;
