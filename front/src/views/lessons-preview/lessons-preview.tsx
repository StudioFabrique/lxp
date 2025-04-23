import SidebarCoursesList from "../../components/lessons-preview/sidebar/sidebar-courses-list";
import ProgressBar from "../../components/lessons-preview/progress-bar";
import LessonReader from "../../components/lessons-preview/preview/lesson-reader";
import Lesson from "../../utils/interfaces/lesson";
import useLessonsPreview from "./hooks/use-lessons-preview";
import LessonsPreviewHeader from "../../components/lessons-preview/lessons-preview-header";
import ModuleData from "../../components/lessons-preview/module-data/module-data";
import LessonsPreviewWrapper from "../../components/lessons-preview/lessons-preview-wrapper";
import LessonsPreviewSkeleton from "./lessons-preview-skeleton";
import FeedbacksButton from "../../components/UI/feedbacks/feedbacks-button";
import LessonCompletionModal from "../../components/lessons-preview/lesson-completion-modal";
import Can from "../../components/UI/can/can.component";
import CreateCourseItem from "../../components/lessons-preview/sidebar/create-course-item";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const LessonsPreview = () => {
  // custom hook
  const {
    fetchData,
    moduleData,
    lessonRating,
    onCompleteLesson,
    selectedLesson,
    isLessonCompleted,
    setSelectedLesson,
    onRateContent,
    onEditRateContent,
    onDeleteCourse,
    onEnableCourse,
    showModal,
    isPanelClosed,
    selectedLessonHasActivities,
    setPanelClosed,
    onToggleModalDisplaying,
    onClickModalRightButton,
  } = useLessonsPreview();

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
          onClickModalRightButton={lessonRating && onClickModalRightButton}
          onClickMinimizeButton={onToggleModalDisplaying}
        />
      ) : null}

      <LessonsPreviewWrapper
        parcoursId={moduleData.parcoursId}
        selectedLesson={selectedLesson}
        isPanelClosed={isPanelClosed}
        setPanelClosed={setPanelClosed}
        setSelectedLesson={setSelectedLesson}
      >
        {[
          // * Header
          <LessonsPreviewHeader key="header" moduleData={moduleData} />,
          // * Le composant affichant la liste des cours avec la progression des cours
          <SidebarCoursesList
            key="progession-side"
            courses={moduleData.courses}
            parcoursId={moduleData.parcoursId}
            moduleId={moduleData.id ?? 0}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            onDeleteCourse={onDeleteCourse}
            onEnableCourse={onEnableCourse}
          >
            <Can action="write" object="course">
              <CreateCourseItem
                parcoursId={moduleData.parcoursId}
                moduleId={moduleData.id ?? 0}
              />
            </Can>
          </SidebarCoursesList>,
          // * La barre de progression du cours
          <Can key="top-progress-bar" action="component" object="progression">
            <ProgressBar courses={moduleData.courses} />
          </Can>,
          // * La prévisualisation de la leçon
          <LessonReader
            key="lesson-reader"
            selectedLesson={selectedLesson as Lesson}
            isLessonAlreadyCompleted
            currentLessonRating={lessonRating?.rating}
            onRateContent={onEditRateContent}
            lessonHasActivities={selectedLessonHasActivities}
            onRefreshAllData={fetchData}
          >
            {/* Bouton pour terminer la leçon afin d'afficher une modal */}
            <Can action="component" object="progression">
              <FeedbacksButton
                className="btn btn-primary text-nowrap text-base-100"
                feedbackType="thumbUp"
                enableAnimationOnClick={!isLessonCompleted}
                disabled={showModal}
                onClick={
                  isLessonCompleted ? onCompleteLesson : onToggleModalDisplaying
                }
              >
                {isLessonCompleted ? "Leçon Suivante" : "Marquer comme terminé"}
              </FeedbacksButton>
            </Can>

            {/* Le lecteur de leçons */}
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
