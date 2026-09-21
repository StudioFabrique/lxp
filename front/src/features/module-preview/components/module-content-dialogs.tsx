import type Course from "../../../utils/interfaces/course";
import useCourseQuiz from "../../quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../quiz/hooks/use-smart-quiz-prompt";
import QuizModal from "../../quiz/components/modals/quiz-modal";
import QuizRequestModal from "../../quiz/components/modals/quiz-request-modal";
import type { ModuleContentStore } from "../hooks/use-module-content";
import LessonCompletionModal from "./lesson-completion-modal";
import ModuleCompletionModal from "./module-completion-modal";

type ModuleContentDialogsProps = {
  store: ModuleContentStore;
  selectedCourse?: Course;
  quiz: ReturnType<typeof useCourseQuiz>;
  smartQuiz: ReturnType<typeof useSmartQuizPrompt>;
  onOpenAssignment: (courseId: number) => void;
};

export default function ModuleContentDialogs({
  store,
  selectedCourse,
  quiz,
  smartQuiz,
  onOpenAssignment,
}: ModuleContentDialogsProps) {
  const { state, computed, dispatch, lessonActions } = store;
  const hasAssignmentAfterLesson = Boolean(
    computed.isLastLessonOfCurrentCourse && selectedCourse?.assignment,
  );

  const closeLessonCompletion = () =>
    dispatch({ type: "set_modal_visibility", modalVisibility: "none" });

  const continueAfterLesson = () => {
    if (hasAssignmentAfterLesson && selectedCourse) {
      onOpenAssignment(selectedCourse.id);
      dispatch({ type: "select_lesson", lesson: undefined });
      closeLessonCompletion();
      return;
    }

    lessonActions.nextLesson();
  };

  return (
    <>
      {store.badgeCompletion && (
        <ModuleCompletionModal
          moduleTitle={store.badgeCompletion.moduleTitle}
          badges={store.badgeCompletion.badges}
          onClose={store.closeBadgeCompletion}
        />
      )}

      <QuizModal
        isOpen={quiz.isOpen}
        quiz={quiz.currentQuiz}
        currentIndex={quiz.currentIndex}
        totalQuizzes={quiz.quizzes?.length || 0}
        isAnswered={quiz.isAnswered}
        isCorrect={quiz.isCorrect}
        isStreaming={quiz.isStreaming}
        isReplacing={quiz.isReplacing}
        showResults={quiz.showResults}
        attempts={quiz.attempts || []}
        score={quiz.score}
        onClose={quiz.onCloseQuizzes}
        onAnswer={quiz.onAnswerQuiz}
        onNext={quiz.onNextQuiz}
        onReport={quiz.onReportQuizQuestion}
      />

      <QuizRequestModal
        isOpen={smartQuiz.showQuizPrompt}
        onAcceptQuiz={smartQuiz.handleAcceptQuiz}
        onDeclineQuiz={smartQuiz.handleDeclineQuiz}
      />

      {state.modalVisibility === "lessonCompletionModal" &&
        state.selectedLesson && (
          <LessonCompletionModal
            lesson={state.selectedLesson}
            isLessonCompleted={computed.isLessonCompleted}
            isLastLessonSelected={computed.isLastLessonSelected}
            isLastActivitySelected={computed.isLastActivitySelected}
            onRateAndComplete={lessonActions.completeLesson}
            hasNextContent={hasAssignmentAfterLesson}
            nextContentLabel={
              hasAssignmentAfterLesson ? "Accéder au devoir" : undefined
            }
            onClickNextLesson={continueAfterLesson}
            onClickMinimizeButton={closeLessonCompletion}
          />
        )}
    </>
  );
}
