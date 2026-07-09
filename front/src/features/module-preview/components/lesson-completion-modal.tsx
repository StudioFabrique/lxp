import { useState } from "react";
import RatingWithStars from "../../../../src/components/UI/lesson-rating/rating-with-stars";
import PortalConfetti from "../../../../src/components/wrappers/ConfettiWrapper";
import FeedbacksButton from "../../../../src/components/buttons/FeedbacksButton";
import Lesson from "../../../../src/utils/interfaces/lesson";
import { useNavigate } from "react-router";
import Modal from "../../../components/UI/modal/modal";

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
  const navigate = useNavigate();

  const [selectedStars, setSelectedStars] = useState<number>(3);
  const [canShowButton, setShowButton] = useState<boolean>(false);

  const handleSelectStarRate = (stars: number) => {
    setSelectedStars(stars);
  };

  const handleRateContent = () => {
    onRateAndComplete(selectedStars);
    setShowButton(true);
  };

  const handleNavigateHome = () => {
    navigate("..");
  };

  const canGoToNextLesson =
    isLessonCompleted && !(isLastActivitySelected && isLastLessonSelected);

  return (
    <>
      <PortalConfetti />
      <Modal
        title={`La leçon "${lesson.title}" a été terminée !`}
        rightLabel={canGoToNextLesson ? "Leçon suivante" : "Retour à l'accueil"}
        onRightClick={
          canGoToNextLesson
            ? onClickNextLesson
            : canShowButton
              ? handleNavigateHome
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
