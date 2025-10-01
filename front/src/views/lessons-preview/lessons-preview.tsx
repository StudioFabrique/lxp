import SidebarCoursesList from "../../components/lessons-preview/sidebar/sidebar-courses-list";
import ProgressBar from "../../components/lessons-preview/progress-bar";
import LessonReader from "../../components/lessons-preview/preview/lesson-reader";
import type Lesson from "../../utils/interfaces/lesson";
import useLessonsPreview from "./hooks/use-lessons-preview";
import LessonsPreviewHeader from "../../components/lessons-preview/lessons-preview-header";
import ModuleData from "../../components/lessons-preview/module-data/module-data";
import LessonsPreviewWrapper from "../../components/lessons-preview/lessons-preview-wrapper";
import LessonsPreviewSkeleton from "./lessons-preview-skeleton";
import FeedbacksButton from "../../components/UI/feedbacks/feedbacks-button";
import LessonCompletionModal from "../../components/lessons-preview/lesson-completion-modal";
import Can from "../../components/UI/can/can.component";
import CreateCourseItem from "../../components/lessons-preview/sidebar/create-course-item";
import ViewWrapper from "../../components/UI/wrapper/view-wrapper";
import ActivityList from "../../components/lessons-preview/sidebar/activity-list";
import NoActivityPlaceholder from "../../components/lessons-preview/preview/no-activity-placeholder";
import Header from "../../components/UI/header";
import { Link } from "react-router-dom";
import { PenBox } from "lucide-react";
import TipTapActivity from "../../components/lessons-preview/writing/tip-tap-activity";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const LessonsPreview = () => {
  // récupération de la premiere valeur de l'url pour déterminer le role de l'utilisateur connecté
  const firstPathSegment = window.location.pathname.split("/")[1];

  // custom hook
  const {
    fetchData,
    moduleData,
    lessonRating,
    onCompleteLesson,
    selectedLesson,
    selectedActivity,
    onSelectActivityId,
    isLessonCompleted,
    isCreatingActivity,
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
    onCreateActivity,
    onCloseTextEditor,
    onActivityCreated,
  } = useLessonsPreview();

  return (
    <ViewWrapper className="flex flex-col gap-6">
      {/* Header de la liste des groupes */}
      <Header
        title="Contenu du module"
        description={
          firstPathSegment === "student"
            ? "Parcourir les leçons et les activités pour valider vos compétences"
            : "Créer, modifier et supprimer des leçons et des activités"
        }
      >
        <Can object="lesson" action="update">
          <Link
            className="btn btn-primary text-base-100 gap-2"
            to="/admin/lesson/add"
          >
            <PenBox />
            Modifier le module
          </Link>
        </Can>
      </Header>

      {!moduleData ? (
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
                children={[
                  // Bouton pour créer un nouveau cours
                  <Can key="create-course" action="write" object="course">
                    <CreateCourseItem
                      parcoursId={moduleData.parcoursId}
                      moduleId={moduleData.id ?? 0}
                    />
                  </Can>,
                  // Liste des activités
                  <ActivityList
                    key="activity-list"
                    activities={selectedLesson?.activities}
                    selectedActivity={selectedActivity}
                    onSelectActivity={onSelectActivityId}
                    onCreateActivity={onCreateActivity}
                  />,
                ]}
              />,
              // * La barre de progression du cours
              <Can
                key="top-progress-bar"
                action="component"
                object="progression"
              >
                <ProgressBar courses={moduleData.courses} />
              </Can>,
              // * La prévisualisation de la leçon
              selectedLesson?.id && isCreatingActivity ? (
                <Can key="tip-tap-activity" action="write" object="lesson">
                  <TipTapActivity
                    parentId={selectedLesson.id}
                    isNewActivity
                    onCloseTipTapEditor={onCloseTextEditor}
                    onRefreshAllData={fetchData}
                    onActivityCreated={onActivityCreated}
                  />
                </Can>
              ) : selectedActivity ? (
                <LessonReader
                  key="lesson-reader"
                  selectedLesson={selectedLesson as Lesson}
                  selectedActivity={selectedActivity}
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
                        isLessonCompleted
                          ? onCompleteLesson
                          : onToggleModalDisplaying
                      }
                    >
                      {isLessonCompleted
                        ? "Leçon Suivante"
                        : "Marquer comme terminé"}
                    </FeedbacksButton>
                  </Can>

                  {/* Le lecteur de leçons */}
                </LessonReader>
              ) : (
                <NoActivityPlaceholder key="no-activity-placeholder" />
              ),

              /* Dans le cas où aucune leçon n'est affiché,
              les informations complémentaires du cours sont affichés */
              <ModuleData key="module-data" moduleData={moduleData} />,
            ]}
          </LessonsPreviewWrapper>
        </>
      )}
    </ViewWrapper>
  );
};

export default LessonsPreview;
