import { BadgeQuestionMark } from "lucide-react";
import useCourseQuiz from "../../../quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../../quiz/hooks/use-smart-quiz-prompt";
import AdminActivityNavigation from "./admin-activity-navigation";
import ActivityTypeSelection from "./activity-type-selection";
import LessonReaderAndEditor from "./lesson-reader-and-editor";
import EmptyStatePlaceholder from "../../../../components/UI/empty-state-placeholder";
import StudentActivityNavigation from "./student-activity-navigation";
import type { ModuleContentStore } from "../../hooks/use-module-content";
import FadeWrapper from "../../../../components/wrappers/FadeWrapper";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const ModuleContentPreview = ({
  store,
  smartQuizState,
  quizState,
  canEditSelectedLesson,
  canNavigateAsAdmin = false,
  aiIndexed = true,
}: {
  store: ModuleContentStore;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [previousContentHeight, setPreviousContentHeight] = useState<number>();
  const isActivityContentLoading = store.isActivityContentLoading;

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (isActivityContentLoading || mode !== "read" || !content) return;

    const measure = () => {
      const height = content.getBoundingClientRect().height;
      if (height > 0) setPreviousContentHeight(height);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [isActivityContentLoading, mode]);

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

  if (isActivityContentLoading) {
    return (
      <div
        role="status"
        aria-label="Chargement de l’activité"
        className={`flex flex-col gap-6 ${previousContentHeight ? "" : "min-h-[500px]"}`}
        style={previousContentHeight ? { height: previousContentHeight } : undefined}
      >
        <span className="sr-only">Chargement de l’activité…</span>
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-base-300 bg-base-200 p-6 sm:p-10 space-y-10">
          <div className="skeleton h-7 w-2/3 max-w-80" aria-hidden="true" />
          <div className="space-y-4" aria-hidden="true">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="skeleton h-10 w-44" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (
    !selectedLesson?.activities?.length &&
    !["activity_type_selection", "write"].includes(mode)
  ) {
    return (
      <EmptyStatePlaceholder title="Aucune activité">
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
      </EmptyStatePlaceholder>
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
    <div ref={contentRef}>
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
        onRefreshActivity={activityActions.refreshSelectedLesson}
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
    </div>
  );
};

export default ModuleContentPreview;
