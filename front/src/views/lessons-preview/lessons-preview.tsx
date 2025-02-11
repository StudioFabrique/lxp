import Progression from "../../components/lessons-preview/progression/progression";
import ProgressBar from "../../components/lessons-preview/progress-bar";
import LessonReader from "../../components/lessons-preview/preview-lesson/lesson-reader";
import Lesson from "../../utils/interfaces/lesson";
import useLessonsPreview from "./hooks/use-lessons-preview";
import LessonsPreviewHeader from "../../components/lessons-preview/lessons-preview-header";
import ModuleData from "../../components/lessons-preview/module-data/module-data";
import LessonsPreviewWrapper from "../../components/lessons-preview/lessons-preview-wrapper";
import LessonsPreviewSkeleton from "./lessons-preview-skeleton";
import FeedbacksButton from "../../components/UI/feedbacks/feedbacks-button";
import { useState } from "react";
import LessonCompletionModal from "../../components/lessons-preview/lesson-completion-modal";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const LessonsPreview = () => {
  // custom hook
  const {
    moduleData,
    lessonRating,
    onCompleteLesson,
    selectedLesson,
    isLessonCompleted,
    setSelectedLesson,
    onRateContent,
    onEditRateContent,
  } = useLessonsPreview();

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleToggleModalDisplaying = () => {
    setTimeout(() => {
      setShowModal((prev) => !prev);
    }, 800);
  };

  const handleClickModalRightButton = () => {
    onCompleteLesson(true);
    setShowModal((prev) => !prev);
  };

  return !moduleData ? (
    <LessonsPreviewSkeleton />
  ) : (
    <>
      {/* Modal to include here */}
      {showModal ? (
        <LessonCompletionModal
          onRateContent={
            lessonRating?.rating ? onEditRateContent : onRateContent
          }
          // Le bouton handler onClickModalRightButton n'est affiché seulement si
          // l'objet lessonRating est non null
          onClickModalRightButton={lessonRating && handleClickModalRightButton}
          onClickMinimizeButton={handleToggleModalDisplaying}
        />
      ) : null}

      <LessonsPreviewWrapper selectedLesson={selectedLesson}>
        {[
          // * Header
          <LessonsPreviewHeader key="header" moduleData={moduleData} />,
          // * Le composant affichant la liste des cours avec la progression des cours
          <Progression
            key="progession-side"
            courses={moduleData.courses}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
          />,
          // * La barre de progression du cours
          <ProgressBar key="top-progress-bar" courses={moduleData.courses} />,
          // * La prévisualisation de la leçon
          <LessonReader
            key="lesson-reader"
            selectedLesson={selectedLesson as Lesson}
            isLessonAlreadyCompleted
            currentLessonRating={lessonRating?.rating}
            onRateContent={onEditRateContent}
          >
            {/* Bouton pour terminer la leçon afin d'afficher une modal */}
            <FeedbacksButton
              title={
                isLessonCompleted ? "Leçon Suivante" : "Marquer comme terminé"
              }
              className="btn btn-primary text-nowrap"
              feedbackType="thumbUp"
              enableAnimationOnClick={!isLessonCompleted}
              disabled={showModal}
              onClick={
                isLessonCompleted
                  ? onCompleteLesson
                  : handleToggleModalDisplaying
              }
            />
          </LessonReader>,
          /* Dans le cas où aucune leçon n'est affiché,
           les informations complémentaires du cours sont affichés */
          <ModuleData key="module-data" moduleData={moduleData} />,
        ]}
      </LessonsPreviewWrapper>
    </>
  );
};

export default LessonsPreview;
