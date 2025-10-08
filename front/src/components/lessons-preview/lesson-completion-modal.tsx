import { useState } from "react";
import RatingWithStars from "../UI/lesson-rating/rating-with-stars";
import Modal from "../UI/modal/modal";
import PortalConfetti from "../UI/portal/portal-confetti";
import FeedbacksButton from "../UI/feedbacks/feedbacks-button";

type LessonCompletionModal = {
  isLessonCompleted: boolean;
  onRateContent: (mode: "create" | "edit", rating: number) => void;
  onClickNextLesson: () => void;
  onClickMinimizeButton: () => void;
};

const LessonCompletionModal = ({
  isLessonCompleted,
  onRateContent,
  onClickNextLesson,
  onClickMinimizeButton,
}: LessonCompletionModal) => {
  const [selectedStars, setSelectedStars] = useState<number>(3);

  const handleSelectStarRate = (stars: number) => {
    setSelectedStars(stars);
  };

  const handleRateContent = () => {
    onRateContent("create", selectedStars);
  };

  return (
    <>
      <PortalConfetti />
      <Modal
        title="Leçon terminée !"
        rightLabel="Leçon suivante"
        onRightClick={onClickNextLesson}
        onMinimizeClick={onClickMinimizeButton}
      >
        <div className="flex flex-col items-center gap-20 p-20 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Votre évaluation</h3>
          <RatingWithStars
            selectedStars={selectedStars}
            onSelectStarRate={handleSelectStarRate}
          />
          <FeedbacksButton
            className="btn btn-primary text-base-100 btn-sm text-nowrap"
            feedbackType="stars"
            elementCount={selectedStars}
            onClick={handleRateContent}
            isLessonCompleted={isLessonCompleted}
            customLabel="Évaluer ce contenu"
          />
        </div>
      </Modal>
    </>
  );
};

export default LessonCompletionModal;
