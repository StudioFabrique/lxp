import SidebarCoursesList from "../../components/lessons-preview/sidebar/sidebar-courses-list";
import ProgressBar from "../../components/lessons-preview/progress-bar";
import LessonReader from "../../components/lessons-preview/preview/lesson-reader";
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
import { useCallback } from "react";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const LessonsPreview = () => {
  // récupération de la premiere valeur de l'url pour déterminer le role de l'utilisateur connecté
  const firstPathSegment = window.location.pathname.split("/")[1];

  // custom hook
  const {
    state: {
      isPanelClosed,
      modalVisibility,
      textActivityContent,
      module,
      selectedActivity,
      selectedLesson,
      ...state
    },
    isLessonCompleted,
    dispatch,
    onCompleteLesson,
    onRateContent,
    onEnableCourse,
    onDeleteCourse,
    onDeleteActivity,
    onSaveActivity,
  } = useLessonsPreview();

  const editTitle = useCallback(
    (title: string) => {
      dispatch({ type: "update_activity_title", title });
    },
    [dispatch]
  );

  const editContent = useCallback(
    (content: string) => {
      dispatch({ type: "update_activity_content", content });
    },
    [dispatch]
  );

  return (
    <ViewWrapper className="flex flex-col gap-6">
      {/* Modal to include here */}
      {modalVisibility === "lessonCompletionModal" && (
        <LessonCompletionModal
          isLessonCompleted={isLessonCompleted}
          onRateContent={onRateContent}
          onClickNextLesson={() => dispatch({ type: "go_to_next_lesson" })}
          onClickMinimizeButton={() =>
            dispatch({
              type: "set_modal_visibility",
              modalVisibility: "none",
            })
          }
        />
      )}
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
            to={`/admin/parcours/edit/${module?.parcoursId}?step=4`}
          >
            <PenBox />
            Modifier le module
          </Link>
        </Can>
      </Header>

      {module && module.parcoursId && module.id ? (
        <LessonsPreviewWrapper
          parcoursId={module.parcoursId}
          selectedLesson={selectedLesson}
          isPanelClosed={isPanelClosed}
          onTogglePanel={() => dispatch({ type: "toggle_panel_visibility" })}
          setSelectedLesson={(lesson) =>
            dispatch({ type: "select_lesson", lesson })
          }
        >
          {[
            // * Header
            <LessonsPreviewHeader key="header" moduleData={module} />,
            // * Le composant affichant la liste des cours avec la progression des cours
            <SidebarCoursesList
              key="progession-side"
              courses={module.courses}
              parcoursId={module.parcoursId}
              moduleId={module.id}
              selectedLesson={selectedLesson}
              setSelectedLesson={(lesson) =>
                dispatch({ type: "select_lesson", lesson })
              }
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              children={[
                // Bouton pour créer un nouveau cours
                <Can key="create-course" action="write" object="course">
                  <CreateCourseItem
                    parcoursId={module.parcoursId}
                    moduleId={module.id || 0}
                  />
                </Can>,
                // Liste des activités
                <ActivityList
                  key="activity-list"
                  activities={selectedLesson?.activities}
                  selectedActivity={selectedActivity}
                  onSelectActivity={(activity) =>
                    dispatch({ type: "select_activity", activity })
                  }
                  newActivityButtonDisabled={state.mode === "write"}
                  onClickCreateActivity={() =>
                    dispatch({
                      type: "select_mode",
                      mode: "write",
                    })
                  }
                />,
              ]}
            />,
            // * La barre de progression du cours
            <Can key="top-progress-bar" action="component" object="progression">
              <ProgressBar courses={module.courses} />
            </Can>,
            // * La prévisualisation de la leçon
            selectedLesson?.activities?.length || state.mode !== "read" ? (
              <LessonReader
                key="lesson-reader"
                mode={state.mode}
                textActivityContent={textActivityContent}
                textActivityTitle={
                  state.mode === "write"
                    ? state.newActivityTitle
                    : selectedActivity?.title
                }
                textActivityTitleError={
                  state.mode !== "read" ? state.titleError : undefined
                }
                selectedActivity={selectedActivity}
                selectedLesson={selectedLesson}
                showDeleteModal={modalVisibility === "deletionModal"}
                onOpenDeleteModal={() =>
                  dispatch({
                    type: "set_modal_visibility",
                    modalVisibility: "deletionModal",
                  })
                }
                onCloseDeleteModal={() =>
                  dispatch({
                    type: "set_modal_visibility",
                    modalVisibility: "none",
                  })
                }
                onEditActivity={() =>
                  dispatch({ type: "select_mode", mode: "edit" })
                }
                onEditTitle={editTitle}
                onEditContent={editContent}
                onRateActivity={onRateContent}
                onDeleteActivity={onDeleteActivity}
                onCloseTextEditor={() =>
                  state.mode === "write"
                    ? dispatch({
                        type: "select_last_activity_from_current_lesson",
                      })
                    : dispatch({ type: "select_mode", mode: "read" })
                }
                onSaveActivity={onSaveActivity}
              >
                {/* Bouton pour terminer la leçon afin d'afficher une modal */}
                <Can action="component" object="progression">
                  <FeedbacksButton
                    className="btn btn-primary text-nowrap text-base-100"
                    feedbackType="thumbUp"
                    isLessonCompleted={isLessonCompleted}
                    disabled={modalVisibility !== "none"}
                    onClick={onCompleteLesson}
                  />
                </Can>

                {/* Le lecteur de leçons */}
              </LessonReader>
            ) : (
              <NoActivityPlaceholder key="no-activity-placeholder" />
            ),

            /* Dans le cas où aucune leçon n'est affiché,
              les informations complémentaires du cours sont affichés */
            <ModuleData key="module-data" moduleData={module} />,
          ]}
        </LessonsPreviewWrapper>
      ) : (
        <LessonsPreviewSkeleton />
      )}
    </ViewWrapper>
  );
};

export default LessonsPreview;
