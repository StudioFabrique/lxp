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
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../../../utils/cn";

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
  const [fadeScrollButtonsOnly, setFadeScrollButtonsOnly] = useState(false);
  const [hideScrollButtons, setHideScrollButtons] = useState(false);
  const isActivityContentLoading = store.isActivityContentLoading;

  useEffect(() => {
    if (!fadeScrollButtonsOnly || isActivityContentLoading) return;

    const scrollTarget = document.getElementById("main-scroll-container") ?? window;
    const finishAutomaticScroll = () => {
      setHideScrollButtons(false);
      // Réafficher les boutons en fondu avant de rétablir l’animation élastique.
      timeout = window.setTimeout(() => setFadeScrollButtonsOnly(false), 250);
    };
    // Garder les boutons masqués pendant le chargement et le scroll automatique.
    let timeout = window.setTimeout(finishAutomaticScroll, 1500);
    const onScroll = () => {
      setHideScrollButtons(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(finishAutomaticScroll, 200);
    };
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timeout);
      scrollTarget.removeEventListener("scroll", onScroll);
    };
  }, [fadeScrollButtonsOnly, isActivityContentLoading, selectedActivity?.id]);

  const handleNextActivity = () => {
    setFadeScrollButtonsOnly(true);
    setHideScrollButtons(true);
    if (canNavigateAsAdmin) {
      dispatch({ type: "go_to_next_activity" });
    } else {
      smartQuizState.handleNextActivity();
    }
  };

  const handlePreviousActivity = () => {
    setFadeScrollButtonsOnly(false);
    setHideScrollButtons(false);
    dispatch({ type: "go_to_previous_activity" });
  };

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
        className={cn("flex flex-col gap-6", previousContentHeight ? "" : "min-h-[500px]")}
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
        fadeScrollButtonsOnly={fadeScrollButtonsOnly}
        hideScrollButtons={hideScrollButtons}
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
              onPreviousActivity={handlePreviousActivity}
              onNextActivity={handleNextActivity}
              onNextLesson={lessonActions.nextLesson}
            />
          ) : (
            <StudentActivityNavigation
              areAllActivitiesRead={computed.areAllActivitiesRead}
              modalVisibility={modalVisibility}
              isLessonCompleted={computed.isLessonCompleted}
              isFirstActivitySelected={computed.isFirstActivitySelected}
              isLastActivitySelected={computed.isLastActivitySelected}
              isLastLessonSelected={computed.isLastLessonSelected}
              onPreviousActivity={handlePreviousActivity}
              onNextActivity={handleNextActivity}
              onCompleteLesson={smartQuizState.handleCompleteLesson}
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
