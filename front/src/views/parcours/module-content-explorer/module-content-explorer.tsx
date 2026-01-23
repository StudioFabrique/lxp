import SidebarCoursesList from "../../../components/module-content-explorer/sidebar/sidebar-courses-list";
import ProgressBar from "../../../components/module-content-explorer/progress-bar";
import useModuleExplorerContent from "../hooks/use-module-explorer";
import ModuleExplorerContentHeader from "../../../components/module-content-explorer/module-content-explorer-header";
import ModuleData from "../../../components/module-content-explorer/module-data/module-data";
import ModuleExplorerContentWrapper from "../../../components/module-content-explorer/module-content-explorer-wrapper";
import ModuleExplorerContentSkeleton from "./module-content-explorer-skeleton";
import LessonCompletionModal from "../../../components/module-content-explorer/lesson-completion-modal";
import Can from "../../../components/UI/can/can.component";
import CreateCourseItem from "../../../components/module-content-explorer/sidebar/create-course-item";
import ActivityList from "../../../components/module-content-explorer/sidebar/activity-list";
import NoActivityPlaceholder from "../../../components/module-content-explorer/preview/no-activity-placeholder";
import { Link, useNavigate } from "react-router-dom";
import { PenBox } from "lucide-react";
import { useCallback, useContext } from "react";
import ActivityBottomNavigation from "../../../components/module-content-explorer/preview/activity-bottom-navigation";
import Lesson from "../../../utils/interfaces/lesson";
import ActivityTypeSelection from "../../../components/module-content-explorer/preview/activity-type-selection";
import LessonReaderAndEditor from "../../../components/module-content-explorer/preview/lesson-reader-and-editor";
import Header from "../../../components/UI/header";
import { Context } from "../../../store/context.store";
import userBelongsToContacts from "../../../utils/userBelongsToContacts";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const ModuleExplorerContent = () => {
  const { user } = useContext(Context);

  const navigate = useNavigate();
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
    isFirstActivitySelected,
    isLastActivitySelected,
    isLastLessonSelected,
    isLoading,
    dispatch,
    onCompleteLesson,
    onRateContent,
    onEnableCourse,
    onDeleteCourse,
    onDeleteLesson,
    onDeleteActivity,
    onSaveActivity,
    onActivityReorder,
    onLessonReorder,
    onNextLesson,
    onSelectActivityType,
  } = useModuleExplorerContent();

  const canEditModule = userBelongsToContacts(user, module?.contacts);
  const canEditSelectedLesson = userBelongsToContacts(
    user,
    selectedLesson?.course?.contacts,
  );

  const editTitle = useCallback(
    (title: string) => {
      dispatch({ type: "update_activity_title", title });
    },
    [dispatch],
  );

  const editIframeSrc = useCallback(
    (src: string) => {
      dispatch({ type: "update_activity_iframe_src", src });
    },
    [dispatch],
  );

  const editContent = useCallback(
    (content: string) => {
      dispatch({ type: "update_activity_content", content });
    },
    [dispatch],
  );

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.id) dispatch({ type: "select_lesson_by_id", id: lesson.id });
  };

  const handleCloseAll = () => {
    dispatch({ type: "select_lesson", lesson: undefined });
    navigate(".", {
      replace: true,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Modal to include here */}
      {modalVisibility === "lessonCompletionModal" && selectedLesson && (
        <LessonCompletionModal
          lesson={selectedLesson}
          isLessonCompleted={isLessonCompleted}
          isLastLessonSelected={isLastLessonSelected}
          isLastActivitySelected={isLastActivitySelected}
          onRateAndComplete={onCompleteLesson}
          onClickNextLesson={onNextLesson}
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
        {canEditModule && (
          <Can object="lesson" action="update">
            <Link
              className="btn btn-primary text-base-100 gap-2"
              to={`/admin/parcours/edit/${module?.parcoursId}?step=4`}
            >
              <PenBox />
              Modifier le module
            </Link>
          </Can>
        )}
      </Header>

      {module && module.parcoursId && module.id ? (
        <ModuleExplorerContentWrapper
          // parcoursId={module.parcoursId}
          selectedLesson={selectedLesson}
          isPanelClosed={isPanelClosed}
          onTogglePanel={() => dispatch({ type: "toggle_panel_visibility" })}
          onCloseAll={handleCloseAll}
        >
          {[
            // * Header
            <ModuleExplorerContentHeader key="header" moduleData={module} />,
            // * Le composant affichant la liste des cours avec la progression des cours
            <SidebarCoursesList
              key="progession-side"
              courses={module.courses}
              parcoursId={module.parcoursId}
              moduleId={module.id}
              selectedLesson={selectedLesson}
              onSelectLesson={handleSelectLesson}
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              onDeleteLesson={onDeleteLesson}
              onLessonReorder={onLessonReorder}
              children={[
                // Bouton pour créer un nouveau cours
                canEditModule && (
                  <Can key="create-course" action="write" object="course">
                    <CreateCourseItem
                      parcoursId={module.parcoursId}
                      moduleId={module.id || 0}
                    />
                  </Can>
                ),
                // Liste des activités
                <ActivityList
                  key="activity-list"
                  canEdit={canEditSelectedLesson}
                  activities={selectedLesson?.activities}
                  selectedActivity={selectedActivity}
                  onActivityReorder={onActivityReorder}
                  onSelectActivity={(activity) =>
                    dispatch({ type: "select_activity", activity })
                  }
                  newActivityButtonDisabled={state.mode === "write"}
                  onClickCreateActivity={() =>
                    dispatch({
                      type: "select_mode",
                      mode: "activity_type_selection",
                    })
                  }
                />,
              ]}
            />,
            // La barre de progression du cours
            <Can key="top-progress-bar" action="component" object="progression">
              <ProgressBar courses={module.courses} />
            </Can>,
            // La prévisualisation de la leçon
            selectedLesson?.activities?.length ||
            ["activity_type_selection", "write"].includes(state.mode) ? (
              state.mode === "activity_type_selection" ? (
                <ActivityTypeSelection
                  key="activity-type-selection"
                  onSelectType={onSelectActivityType}
                  onCancel={() =>
                    dispatch({
                      type: "select_last_activity_from_current_lesson",
                    })
                  }
                />
              ) : (
                // Le lecteur et editeur de leçons
                <LessonReaderAndEditor
                  key="lesson-reader"
                  isLessonCompleted={isLessonCompleted}
                  canEdit={canEditSelectedLesson}
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
                  activityType={
                    selectedActivity?.type ||
                    (state.mode === "write" && state.activityType) ||
                    "text"
                  }
                  iframeActivitySrc={
                    state.mode === "write"
                      ? state.newActivitySrc
                      : selectedActivity?.url
                  }
                  selectedLesson={selectedLesson}
                  showDeleteModal={modalVisibility === "deletionModal"}
                  isLoading={isLoading}
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
                  onEditIframeSrc={editIframeSrc}
                  onRateActivity={onRateContent}
                  onDeleteActivity={onDeleteActivity}
                  onClose={() =>
                    state.mode === "write"
                      ? dispatch({
                          type: "select_last_activity_from_current_lesson",
                        })
                      : dispatch({ type: "select_mode", mode: "read" })
                  }
                  onBack={() =>
                    dispatch({
                      type: "select_mode",
                      mode: "activity_type_selection",
                    })
                  }
                  onSaveActivity={onSaveActivity}
                >
                  {state.mode === "read" && (
                    <ActivityBottomNavigation
                      modalVisibility={modalVisibility}
                      isLessonCompleted={isLessonCompleted}
                      isFirstActivitySelected={isFirstActivitySelected}
                      isLastActivitySelected={isLastActivitySelected}
                      isLastLessonSelected={isLastLessonSelected}
                      onPrevious={() =>
                        dispatch({ type: "go_to_previous_activity" })
                      }
                      onNext={() => dispatch({ type: "go_to_next_activity" })}
                      onCompleteLesson={() =>
                        isLessonCompleted
                          ? onNextLesson()
                          : dispatch({
                              type: "set_modal_visibility",
                              modalVisibility: "lessonCompletionModal",
                            })
                      }
                    />
                  )}
                </LessonReaderAndEditor>
              )
            ) : (
              <NoActivityPlaceholder key="no-activity-placeholder" />
            ),

            /* Dans le cas où aucune leçon n'est affiché,
              les informations complémentaires du cours sont affichés */
            <ModuleData key="module-data" moduleData={module} />,
          ]}
        </ModuleExplorerContentWrapper>
      ) : (
        <ModuleExplorerContentSkeleton />
      )}
    </div>
  );
};

export default ModuleExplorerContent;
