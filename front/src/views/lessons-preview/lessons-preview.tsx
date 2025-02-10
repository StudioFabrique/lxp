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
import Modal from "../../components/UI/modal/modal";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const LessonsPreview = () => {
  // custom hook
  const {
    moduleData,
    onCompleteLesson,
    selectedLesson,
    isLessonAlreadyCompleted,
    setSelectedLesson,
    onRateContent,
  } = useLessonsPreview();

  return !moduleData ? (
    <LessonsPreviewSkeleton />
  ) : (
    <>
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
            onRateContent={onRateContent}
          >
            {/* Bouton pour terminer la leçon afin d'afficher une modal */}
            <FeedbacksButton
              title={
                isLessonAlreadyCompleted
                  ? "Leçon Suivante"
                  : "Marquer comme terminé"
              }
              className="btn btn-primary text-nowrap"
              feedbackType="thumbUp"
              enableAnimationOnClick={!isLessonAlreadyCompleted}
              onClick={onCompleteLesson}
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
