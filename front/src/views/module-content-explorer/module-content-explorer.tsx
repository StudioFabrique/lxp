import SidebarCoursesList from "../../components/module-content-explorer/sidebar/sidebar-courses-list";
import ProgressBar from "../../components/module-content-explorer/progress-bar";
import useModuleContentExplorer from "./hooks/use-module-explorer";
import ModuleContentExplorerHeader from "../../components/module-content-explorer/module-content-explorer-header";
import ModuleData from "../../components/module-content-explorer/module-data/module-data";
import ModuleContentExplorerWrapper from "../../components/module-content-explorer/module-content-explorer-wrapper";
import ModuleContentExplorerSkeleton from "./module-content-explorer-skeleton";
import LessonCompletionModal from "../../components/module-content-explorer/lesson-completion-modal";
import Can from "../../components/UI/can/can.component";
import CreateCourseItem from "../../components/module-content-explorer/sidebar/create-course-item";
import ActivityList from "../../components/module-content-explorer/sidebar/activity-list";
import NoActivityPlaceholder from "../../components/module-content-explorer/preview/no-activity-placeholder";
import { Link, useNavigate } from "react-router-dom";
import { BadgeQuestionMark, PenBox } from "lucide-react";
import { useCallback, useContext } from "react";
import ActivityBottomNavigation from "../../components/module-content-explorer/preview/activity-bottom-navigation";
import Lesson from "../../utils/interfaces/lesson";
import ActivityTypeSelection from "../../components/module-content-explorer/preview/activity-type-selection";
import LessonReaderAndEditor from "../../components/module-content-explorer/preview/lesson-reader-and-editor";
import Header from "../../components/UI/header";
import { Context } from "../../store/context.store";
import userBelongsToContacts from "../../utils/userBelongsToContacts";
import useActivityQuizz from "../../hooks/use-activity-quiz"; // Attention au nom de l'import (Quizz avec 2 'z' selon ton fichier)
import QuizModal from "../../components/quizzes/modals/quiz-modal";
import QuizRequestModal from "../../components/quizzes/modals/quiz-request-modal";
import useSmartQuizPrompt from "../../hooks/use-smart-quiz-prompt";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const ModuleContentExplorer = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const firstPathSegment = window.location.pathname.split("/")[1];

  // 1. Récupération des données groupées
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
    computed,
    isLoading,
    dispatch,
    lessonActions,
    activityActions,
    courseActions,
  } = useModuleContentExplorer();

  // 2. Gestion du Quiz "Classique"
  const quizState = useActivityQuizz(selectedLesson?.id);

  // 3. Gestion du Quiz "Intelligent" (Smart Prompt)
  const smartQuiz = useSmartQuizPrompt({
    selectedActivity,
    isLastActivitySelected: computed.isLastActivitySelected,
    isLastLessonSelected: computed.isLastLessonSelected,
    onTriggerRandomQuiz: quizState.onTriggerRandomQuiz,
    onGoToNextActivity: () => dispatch({ type: "go_to_next_activity" }),
  });

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
      <QuizModal
        isOpen={quizState.isOpen}
        quiz={quizState.currentQuiz}
        currentIndex={quizState.currentIndex}
        totalQuizzes={quizState.quizzes?.length || 0}
        isAnswered={quizState.isAnswered}
        isCorrect={quizState.isCorrect}
        onClose={quizState.onCloseQuizzes}
        onAnswer={quizState.onAnswerQuiz}
        onNext={quizState.onNextQuiz}
      />

      <QuizRequestModal
        isOpen={smartQuiz.showQuizPrompt}
        onAcceptQuiz={smartQuiz.handleAcceptQuiz}
        onDeclineQuiz={smartQuiz.handleDeclineQuiz}
      />

      {/* Modal to include here */}
      {modalVisibility === "lessonCompletionModal" && selectedLesson && (
        <LessonCompletionModal
          lesson={selectedLesson}
          isLessonCompleted={computed.isLessonCompleted}
          isLastLessonSelected={computed.isLastLessonSelected}
          isLastActivitySelected={computed.isLastActivitySelected}
          onRateAndComplete={lessonActions.completeLesson}
          onClickNextLesson={lessonActions.nextLesson}
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
        <ModuleContentExplorerWrapper
          selectedLesson={selectedLesson}
          isPanelClosed={isPanelClosed}
          onTogglePanel={() => dispatch({ type: "toggle_panel_visibility" })}
          onCloseAll={handleCloseAll}
          // --- UTILISATION DES SLOTS ---
          header={<ModuleContentExplorerHeader moduleData={module} />}
          progressionSide={
            <SidebarCoursesList
              courses={module.courses}
              parcoursId={module.parcoursId}
              moduleId={module.id}
              selectedLesson={selectedLesson}
              onSelectLesson={handleSelectLesson}
              onDeleteCourse={courseActions.deleteCourse}
              onEnableCourse={courseActions.enableCourse}
              onDeleteLesson={lessonActions.deleteLesson}
              onLessonReorder={lessonActions.lessonReorder}
            >
              {canEditModule && (
                <Can action="write" object="course">
                  <CreateCourseItem
                    parcoursId={module.parcoursId}
                    moduleId={module.id || 0}
                  />
                </Can>
              )}
              <ActivityList
                canEdit={canEditSelectedLesson}
                activities={selectedLesson?.activities}
                selectedActivity={selectedActivity}
                onActivityReorder={activityActions.activityReorder}
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
              />
            </SidebarCoursesList>
          }
          topProgressBar={
            <Can action="component" object="progression">
              <ProgressBar courses={module.courses} />
            </Can>
          }
          previewLesson={
            selectedLesson?.activities?.length ||
            ["activity_type_selection", "write"].includes(state.mode) ? (
              state.mode === "activity_type_selection" ? (
                <ActivityTypeSelection
                  onSelectType={activityActions.selectActivityType}
                  onCancel={() =>
                    dispatch({
                      type: "select_last_activity_from_current_lesson",
                    })
                  }
                />
              ) : (
                <LessonReaderAndEditor
                  isLessonCompleted={computed.isLessonCompleted}
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
                  onRateActivity={lessonActions.rateContent}
                  onDeleteActivity={activityActions.deleteActivity}
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
                  onSaveActivity={activityActions.saveActivity}
                >
                  <div className="flex flex-col gap-4 w-full">
                    {state.mode === "read" && (
                      <ActivityBottomNavigation
                        modalVisibility={modalVisibility}
                        isLessonCompleted={computed.isLessonCompleted}
                        isFirstActivitySelected={
                          computed.isFirstActivitySelected
                        }
                        isLastActivitySelected={computed.isLastActivitySelected}
                        isLastLessonSelected={computed.isLastLessonSelected}
                        onPrevious={() =>
                          dispatch({ type: "go_to_previous_activity" })
                        }
                        onNext={smartQuiz.handleNextActivity}
                        onCompleteLesson={() =>
                          computed.isLessonCompleted
                            ? lessonActions.nextLesson()
                            : dispatch({
                                type: "set_modal_visibility",
                                modalVisibility: "lessonCompletionModal",
                              })
                        }
                      >
                        {computed.isLastActivitySelected &&
                          computed.isLastLessonSelected && (
                            <button
                              className="btn btn-secondary btn-outline"
                              onClick={quizState.onLoadQuizzes}
                            >
                              <BadgeQuestionMark />
                              Je veux me tester
                            </button>
                          )}
                      </ActivityBottomNavigation>
                    )}
                  </div>
                </LessonReaderAndEditor>
              )
            ) : (
              <NoActivityPlaceholder />
            )
          }
          moduleData={<ModuleData moduleData={module} />}
        />
      ) : (
        <ModuleContentExplorerSkeleton />
      )}
    </div>
  );
};

export default ModuleContentExplorer;
