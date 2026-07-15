import { BadgeQuestionMark } from "lucide-react";
import useCourseQuiz from "../../../../components/quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../../../components/quiz/hooks/use-smart-quiz-prompt";
import ActivityBottomNavigation from "./activity-bottom-navigation";
import ActivityTypeSelection from "./activity-type-selection";
import LessonReaderAndEditor from "./lesson-reader-and-editor";
import NoActivityPlaceholder from "./no-activity-placeholder";
import { ExplorerStore } from "../../views/ModuleContentExplorer";
import FadeWrapper from "../../../../components/wrappers/FadeWrapper";

const ModuleExplorerPreview = ({
  store,
  smartQuizState,
  quizState,
  canEditSelectedLesson,
}: {
  store: ExplorerStore;
  smartQuizState: ReturnType<typeof useSmartQuizPrompt>;
  quizState: ReturnType<typeof useCourseQuiz>;
  canEditSelectedLesson?: boolean;
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

  const editTitle = (title: string) =>
    dispatch({ type: "update_activity_title", title });
  const editIframeSrc = (src: string) =>
    dispatch({ type: "update_activity_iframe_src", src });
  const editContent = (content: string) =>
    dispatch({ type: "update_activity_content", content });

  if (
    !selectedLesson?.activities?.length &&
    !["activity_type_selection", "write"].includes(mode)
  ) {
    return <NoActivityPlaceholder />;
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
        {mode === "read" && (
          <ActivityBottomNavigation
            modalVisibility={modalVisibility}
            isLessonCompleted={computed.isLessonCompleted}
            isFirstActivitySelected={computed.isFirstActivitySelected}
            isLastActivitySelected={computed.isLastActivitySelected}
            isLastLessonSelected={computed.isLastLessonSelected}
            onPrevious={() => dispatch({ type: "go_to_previous_activity" })}
            onNext={smartQuizState.handleNextActivity}
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
              computed.isLastLessonOfCurrentCourse && (
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
      </LessonReaderAndEditor>
    </FadeWrapper>
  );
};

export default ModuleExplorerPreview;
