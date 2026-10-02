import { formatTitle } from "../../../utils/helpers/text-helpers";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import RatingWithStars from "../../../../src/components/UI/lesson-rating/rating-with-stars";
import PortalConfetti from "../../../../src/components/wrappers/ConfettiWrapper";
import FeedbacksButton from "../../../../src/components/buttons/FeedbacksButton";
import Lesson from "../../../../src/utils/interfaces/lesson";
import { useNavigate } from "react-router";
import Modal from "../../../components/UI/modal/modal";
import { Plus } from "lucide-react";

type LessonCompletionModal = {
  lesson: Lesson;
  isLessonCompleted: boolean;
  isLastLessonSelected: boolean;
  isLastActivitySelected: boolean;
  onRateAndComplete: (rating?: number, comment?: string) => Promise<void>;
  onClickNextLesson: () => void;
  onClickMinimizeButton: () => void;
  hasNextContent?: boolean;
  nextContentLabel?: string;
};

const LessonCompletionModal = ({
  lesson,
  isLessonCompleted,
  isLastActivitySelected,
  isLastLessonSelected,
  onRateAndComplete,
  onClickNextLesson,
  onClickMinimizeButton,
  hasNextContent = false,
  nextContentLabel,
}: LessonCompletionModal) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const [selectedStars, setSelectedStars] = useState<number>(3);
  const [canShowButton, setShowButton] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  const handleSelectStarRate = (stars: number) => {
    setSelectedStars(stars);
  };

  const handleRateContent = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      await onRateAndComplete(selectedStars, comment.trim() || undefined);
      setShowButton(true);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipRating = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      await onRateAndComplete();
      setShowButton(true);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNavigateHome = () => {
    navigate("..");
  };

  const canGoToNextLesson =
    isLessonCompleted &&
    (hasNextContent || !(isLastActivitySelected && isLastLessonSelected));

  return (
    <>
      <PortalConfetti />
      <Modal
        title={`La leçon "${formatTitle(lesson.title)}" a été terminée !`}
        rightLabel={
          canGoToNextLesson
            ? (nextContentLabel ?? "Leçon suivante")
            : "Retour à l'accueil"
        }
        onRightClick={
          canGoToNextLesson
            ? onClickNextLesson
            : canShowButton
              ? handleNavigateHome
              : undefined
        }
        onMinimizeClick={onClickMinimizeButton}
        rightDisabled={isCompleting}
      >
        <div className="flex flex-col items-center gap-8 px-4 pt-12 pb-4 sm:px-12">
          <h3 className="text-lg font-semibold mb-2">
            Votre évaluation sur la leçon
          </h3>
          <div className="flex w-full flex-col items-center gap-6 py-4">
            <RatingWithStars
              selectedStars={selectedStars}
              onSelectStarRate={
                isLessonCompleted || isCompleting
                  ? undefined
                  : handleSelectStarRate
              }
            />
            {!showComment ? (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowComment(true)}
                disabled={isLessonCompleted || isCompleting}
              >
                <Plus className="size-4" />
                Ajouter un commentaire
              </button>
            ) : (
              <motion.div
                className="w-full overflow-hidden"
                initial={{ height: 32, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.2 }}
              >
                <label className="flex w-full flex-col gap-2">
                  <span className="text-sm font-medium">Commentaire</span>
                  <textarea
                    className="textarea textarea-bordered w-full min-h-24"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={2000}
                    disabled={isLessonCompleted || isCompleting}
                    autoFocus
                    rows={3}
                  />
                </label>
              </motion.div>
            )}
          </div>

          <FeedbacksButton
            className="btn btn-primary text-base-100 btn-sm text-nowrap"
            feedbackType="stars"
            elementCount={selectedStars}
            onClick={handleRateContent}
            showFeedback={!isLessonCompleted}
            disabled={isLessonCompleted || isCompleting}
          >
            Évaluer ce contenu
          </FeedbacksButton>
        </div>
        {!isLessonCompleted && (
          <button
            type="button"
            className="btn btn-ghost btn-sm -ml-3 mt-4 text-base-content/60"
            onClick={handleSkipRating}
            disabled={isCompleting}
          >
            Ignorer
          </button>
        )}
      </Modal>
    </>
  );
};

export default LessonCompletionModal;
