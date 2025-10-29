import { useState } from "react";
import RatingWithStars from "../UI/lesson-rating/rating-with-stars";
import Modal from "../UI/modal/modal";
import PortalConfetti from "../UI/portal/portal-confetti";
import FeedbacksButton from "../UI/feedbacks/feedbacks-button";
import Lesson from "../../utils/interfaces/lesson";

type LessonCompletionModal = {
  lesson: Lesson;
  isLessonCompleted: boolean;
  isLastLessonSelected: boolean;
  isLastActivitySelected: boolean;
  onRateAndComplete: (rating: number) => void;
  onClickNextLesson: () => void;
  onClickMinimizeButton: () => void;
};

const LessonCompletionModal = ({
  lesson,
  isLessonCompleted,
  isLastActivitySelected,
  isLastLessonSelected,
  onRateAndComplete,
  onClickNextLesson,
  onClickMinimizeButton,
}: LessonCompletionModal) => {
  const [selectedStars, setSelectedStars] = useState<number>(3);

  const handleSelectStarRate = (stars: number) => {
    setSelectedStars(stars);
  };

  const handleRateContent = () => {
    onRateAndComplete(selectedStars);
  };

  return (
    <>
      <PortalConfetti />
      <Modal
        title={`La leçon "${lesson.title}" a été terminée !`}
        rightLabel="Leçon suivante"
        onRightClick={
          isLessonCompleted && !(isLastActivitySelected && isLastLessonSelected)
            ? onClickNextLesson
            : undefined
        }
        onMinimizeClick={onClickMinimizeButton}
      >
        <div className="flex flex-col items-center gap-20 p-20 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">
            Votre évaluation sur la leçon
          </h3>
          <RatingWithStars
            selectedStars={selectedStars}
            onSelectStarRate={handleSelectStarRate}
          />

          <FeedbacksButton
            className="btn btn-primary text-base-100 btn-sm text-nowrap"
            feedbackType="stars"
            elementCount={selectedStars}
            onClick={handleRateContent}
            showFeedback={!isLessonCompleted}
            disabled={isLessonCompleted}
          >
            Évaluer ce contenu
          </FeedbacksButton>
        </div>
      </Modal>
    </>
  );
};

export default LessonCompletionModal;
