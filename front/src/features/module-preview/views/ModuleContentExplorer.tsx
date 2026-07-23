import useModuleContentExplorer from "../hooks/use-module-content-explorer";
import ModuleContentExplorerSkeleton from "./ModulePreviewSkeleton";
import { Link, useNavigate } from "react-router";
import { PenBox } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../store/AuthProvider";
import userBelongsToContacts from "../../../utils/helpers/user-belongs-to-contacts";
import useDiagnosticQuiz from "../../quiz/hooks/use-diagnostic-quiz";
import useCourseQuiz from "../../quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../quiz/hooks/use-smart-quiz-prompt";
import DiagnosticQuiz from "../../quiz/components/diagnostic-quiz";
import QuizModal from "../../quiz/components/modals/quiz-modal";
import QuizRequestModal from "../../quiz/components/modals/quiz-request-modal";
import LessonCompletionModal from "../components/lesson-completion-modal";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import ModuleContentExplorerWrapper from "../components/module-content-explorer-wrapper";
import ModuleContentExplorerHeader from "../components/module-content-explorer-header";
import ModuleExplorerSidebar from "../components/sidebar/module-explorer-sidebar";
import ProgressBar from "../components/progress-bar";
import ModuleExplorerPreview from "../components/preview/module-explorer-preview";
import ModuleData from "../components/module-data/module-data";
import Header from "../../../components/headers/Header";

export type ExplorerStore = ReturnType<typeof useModuleContentExplorer>;

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant.
 * La modification de contenu est aussi possible pour le formateur et l'admin.
 */
const ModuleContentExplorer = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const firstPathSegment = window.location.pathname.split("/")[1];

  const explorerStore = useModuleContentExplorer();
  const {
    state,
    computed,
    dispatch,
    lessonActions,
    moduleActions,
    scrollTopRef,
  } = explorerStore;

  const isModuleLoaded = Boolean(
    state.module && state.module.id && state.module.courses.length > 0,
  );
  const canEditModule = userBelongsToContacts(user, state.module?.contacts);
  const canEditSelectedLesson = userBelongsToContacts(
    user,
    state.selectedLesson?.course?.contacts,
  );

  const diagnosticQuiz = useDiagnosticQuiz(
    computed.hasStartedModule,
    isModuleLoaded,
    {
      title: state.module?.title,
      description: state.module?.description,
    },
    moduleActions.onFinishInitialQuiz,
  );

  const quizState = useCourseQuiz(
    state.selectedLesson?.courseId,
    state.textActivityContent,
  );

  // Propose automatiquement un quiz aux clics sur les boutons suivant ou précédent
  const smartQuizState = useSmartQuizPrompt({
    selectedActivity: state.selectedActivity,
    isLessonCompleted: computed.isLessonCompleted,
    isLastActivitySelected: computed.isLastActivitySelected,
    isLastLessonSelected: computed.isLastLessonSelected,
    isAnyQuizOpen: diagnosticQuiz.isOpen || quizState.isOpen,
    onTriggerRandomQuiz: quizState.onTriggerRandomQuiz,
    onGoToNextActivity: () => dispatch({ type: "go_to_next_activity" }),
  });

  if (diagnosticQuiz.isOpen) {
    return (
      <DiagnosticQuiz
        isStarted={diagnosticQuiz.isStarted}
        moduleTitle={state.module?.title}
        quiz={diagnosticQuiz.currentQuiz}
        currentIndex={diagnosticQuiz.currentIndex}
        totalQuizzes={diagnosticQuiz.quizzes?.length || 0}
        isAnswered={diagnosticQuiz.isAnswered}
        isCorrect={diagnosticQuiz.isCorrect}
        isStreaming={diagnosticQuiz.isStreaming}
        isWaitingForNext={diagnosticQuiz.isWaitingForNext}
        showResults={diagnosticQuiz.showResults}
        attempts={diagnosticQuiz.attempts || []}
        score={diagnosticQuiz.score}
        onStart={diagnosticQuiz.onStartQuiz}
        onAnswer={diagnosticQuiz.onAnswerQuiz}
        onNext={diagnosticQuiz.onNextQuiz}
        onContinueFromResults={diagnosticQuiz.onContinueFromResults}
        onReport={diagnosticQuiz.onReportQuizQuestion}
      />
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* --- Section Modales --- */}
      <QuizModal
        isOpen={quizState.isOpen}
        quiz={quizState.currentQuiz}
        currentIndex={quizState.currentIndex}
        totalQuizzes={quizState.quizzes?.length || 0}
        isAnswered={quizState.isAnswered}
        isCorrect={quizState.isCorrect}
        isStreaming={quizState.isStreaming}
        isReplacing={quizState.isReplacing}
        showResults={quizState.showResults}
        attempts={quizState.attempts || []}
        score={quizState.score}
        onClose={quizState.onCloseQuizzes}
        onAnswer={quizState.onAnswerQuiz}
        onNext={quizState.onNextQuiz}
        onReport={quizState.onReportQuizQuestion}
      />

      <QuizRequestModal
        isOpen={smartQuizState.showQuizPrompt}
        onAcceptQuiz={smartQuizState.handleAcceptQuiz}
        onDeclineQuiz={smartQuizState.handleDeclineQuiz}
      />

      {state.modalVisibility === "lessonCompletionModal" &&
        state.selectedLesson && (
          <LessonCompletionModal
            lesson={state.selectedLesson}
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

      {/* --- Section Header --- */}
      <Header
        title="Contenu du module"
        description={
          firstPathSegment === "student"
            ? "Parcourir les leçons et les activités pour valider vos compétences"
            : "Créer, modifier et supprimer des leçons et des activités"
        }
      >
        {canEditModule && (
          <PermissionGuard object="lesson" action="update">
            <Link
              className="btn btn-primary text-base-100 gap-2"
              to={`/admin/parcours/edit/${state.module?.parcoursId}?step=4`}
            >
              <PenBox /> Modifier le module
            </Link>
          </PermissionGuard>
        )}
      </Header>

      {/* --- Section Contenu  --- */}
      {state.module && state.module?.parcoursId && state.module.id ? (
        /* Wrapper */
        <ModuleContentExplorerWrapper
          scrollTopRef={scrollTopRef}
          selectedLesson={state.selectedLesson}
          isPanelClosed={state.isPanelClosed}
          onTogglePanel={() => dispatch({ type: "toggle_panel_visibility" })}
          onCloseAll={() => {
            dispatch({ type: "select_lesson", lesson: undefined });
            navigate(".", { replace: true });
          }}
          header={<ModuleContentExplorerHeader moduleData={state.module} />}
          progressionSide={
            /* Sidebar */
            <ModuleExplorerSidebar
              store={explorerStore}
              canEditModule={canEditModule}
              canEditSelectedLesson={canEditSelectedLesson}
            />
          }
          /* Progress Bar */
          topProgressBar={
            <PermissionGuard action="component" object="progression">
              <ProgressBar courses={state.module.courses} />
            </PermissionGuard>
          }
          /* Preview */
          previewLesson={
            <ModuleExplorerPreview
              store={explorerStore}
              quizState={quizState}
              smartQuizState={smartQuizState}
              canEditSelectedLesson={canEditSelectedLesson}
            />
          }
          moduleData={<ModuleData moduleData={state.module} />}
        />
      ) : (
        /* Skeleton */
        <ModuleContentExplorerSkeleton />
      )}
    </div>
  );
};

export default ModuleContentExplorer;
