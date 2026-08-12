import { BadgeQuestionMark } from "lucide-react";
import useCourseQuiz from "../../../quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../../quiz/hooks/use-smart-quiz-prompt";
import AdminActivityNavigation from "./admin-activity-navigation";
import ActivityTypeSelection from "./activity-type-selection";
import LessonReaderAndEditor from "./lesson-reader-and-editor";
import NoActivityPlaceholder from "./no-activity-placeholder";
import StudentActivityNavigation from "./student-activity-navigation";
import { ExplorerStore } from "../../views/ModuleContentExplorer";
import FadeWrapper from "../../../../components/wrappers/FadeWrapper";
import { useCallback } from "react";

const ModuleExplorerPreview = ({
  store,
  smartQuizState,
  quizState,
  canEditSelectedLesson,
  canNavigateAsAdmin = false,
  aiIndexed = true,
}: {
  store: ExplorerStore;
  smartQuizState: ReturnType<typeof useSmartQuizPrompt>;
  quizState: ReturnType<typeof useCourseQuiz>;
  canEditSelectedLesson?: boolean;
  canNavigateAsAdmin?: boolean;
  aiIndexed?: boolean;
}) => {
  const {
    state,
    computed,
    dispatch,
    lessonActions,
    activityActions,
    isLoading,
  } = store;
  const {
    selectedLesson,
    selectedActivity,
    modalVisibility,
    textActivityContent,
    mode,
  } = state;

  const editTitle = useCallback(
    (title: string) => dispatch({ type: "update_activity_title", title }),
    [dispatch],
  );
  const editIframeSrc = useCallback(
    (src: string) => dispatch({ type: "update_activity_iframe_src", src }),
    [dispatch],
  );
  const editContent = useCallback(
    (content: string) =>
      dispatch({ type: "update_activity_content", content }),
    [dispatch],
  );

  const quizButton =
    computed.isLastActivitySelected &&
    computed.isLastLessonOfCurrentCourse &&
    aiIndexed ? (
      <button
        className="btn btn-secondary btn-outline"
        onClick={quizState.onLoadQuizzes}
      >
        <BadgeQuestionMark />
        Je veux me tester
      </button>
    ) : null;

  if (
    !selectedLesson?.activities?.length &&
    !["activity_type_selection", "write"].includes(mode)
  ) {
    return (
      <NoActivityPlaceholder>
        <div className="flex flex-col items-center gap-5">
          <p className="text-2xl font-bold text-primary">Aucune activité</p>
          {canNavigateAsAdmin && computed.hasNextLesson && (
            <button
              type="button"
              className="btn btn-primary text-base-100"
              onClick={lessonActions.nextLesson}
            >
              {computed.isLastLessonOfCurrentCourse
                ? "Cours suivant"
                : "Leçon suivante"}
            </button>
          )}
        </div>
      </NoActivityPlaceholder>
    );
  }

  if (mode === "activity_type_selection") {
    return (
      <ActivityTypeSelection
        onSelectType={activityActions.selectActivityType}
        onCancel={() =>
          dispatch({ type: "select_last_activity_from_current_lesson" })
        }
      />
    );
  }

  return (
    <FadeWrapper>
      <LessonReaderAndEditor
        isLessonCompleted={computed.isLessonCompleted}
        canEdit={canEditSelectedLesson}
        mode={mode}
        textActivityContent={textActivityContent}
        textActivityTitle={
          mode === "write" ? state.newActivityTitle : selectedActivity?.title
        }
        textActivityTitleError={mode !== "read" ? state.titleError : undefined}
        selectedActivity={selectedActivity}
        activityType={
          selectedActivity?.type ||
          (mode === "write" && state.activityType) ||
          "text"
        }
        iframeActivitySrc={
          mode === "write" ? state.newActivitySrc : selectedActivity?.url
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
          dispatch({ type: "set_modal_visibility", modalVisibility: "none" })
        }
        onEditActivity={() => dispatch({ type: "select_mode", mode: "edit" })}
        onEditTitle={editTitle}
        onEditContent={editContent}
        onEditIframeSrc={editIframeSrc}
        onRateActivity={lessonActions.rateContent}
        onDeleteActivity={activityActions.deleteActivity}
        onClose={() =>
          mode === "write"
            ? dispatch({ type: "select_last_activity_from_current_lesson" })
            : dispatch({ type: "select_mode", mode: "read" })
        }
        onBack={() =>
          dispatch({ type: "select_mode", mode: "activity_type_selection" })
        }
        onSaveActivity={activityActions.saveActivity}
      >
        {mode === "read" &&
          (canNavigateAsAdmin ? (
            <AdminActivityNavigation
              modalVisibility={modalVisibility}
              isFirstActivitySelected={computed.isFirstActivitySelected}
              isLastActivitySelected={computed.isLastActivitySelected}
              isLastLessonOfCurrentCourse={computed.isLastLessonOfCurrentCourse}
              hasNextLesson={computed.hasNextLesson}
              onPreviousActivity={() =>
                dispatch({ type: "go_to_previous_activity" })
              }
              onNextActivity={() => dispatch({ type: "go_to_next_activity" })}
              onNextLesson={lessonActions.nextLesson}
            />
          ) : (
            <StudentActivityNavigation
              modalVisibility={modalVisibility}
              isLessonCompleted={computed.isLessonCompleted}
              isFirstActivitySelected={computed.isFirstActivitySelected}
              isLastActivitySelected={computed.isLastActivitySelected}
              isLastLessonSelected={computed.isLastLessonSelected}
              onPreviousActivity={() =>
                dispatch({ type: "go_to_previous_activity" })
              }
              onNextActivity={smartQuizState.handleNextActivity}
              onCompleteLesson={() =>
                computed.isLessonCompleted
                  ? lessonActions.nextLesson()
                  : dispatch({
                      type: "set_modal_visibility",
                      modalVisibility: "lessonCompletionModal",
                    })
              }
            >
              {quizButton}
            </StudentActivityNavigation>
          ))}
      </LessonReaderAndEditor>
    </FadeWrapper>
  );
};

export default ModuleExplorerPreview;
