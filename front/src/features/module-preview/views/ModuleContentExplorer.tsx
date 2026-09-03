import useModuleContentExplorer from "../hooks/use-module-content-explorer";
import useContentTracking from "../hooks/use-content-tracking";
import ModuleContentExplorerSkeleton from "./ModulePreviewSkeleton";
import { Link, useNavigate } from "react-router";
import { LoaderCircle, PenBox, UploadCloud } from "lucide-react";
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
import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import ModuleContentExplorerWrapper from "../components/module-content-explorer-wrapper";
import ModuleContentExplorerHeader from "../components/module-content-explorer-header";
import ModuleExplorerSidebar from "../components/sidebar/module-explorer-sidebar";
import ProgressBar from "../components/progress-bar";
import ModuleExplorerPreview from "../components/preview/module-explorer-preview";
import ModuleData from "../components/module-data/module-data";
import Header from "../../../components/headers/Header";
import { AbilityContext } from "../../../rbac/AbilityProvider";

export type ExplorerStore = ReturnType<typeof useModuleContentExplorer>;

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant.
 * La modification de contenu est aussi possible pour le formateur et l'admin.
 */
const ModuleContentExplorer = () => {
  const { user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);
  const navigate = useNavigate();
  const firstPathSegment = window.location.pathname.split("/")[1];
  const isAdminView = firstPathSegment === "admin";

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
  const canEditModule =
    ability.can("update", "module") ||
    userBelongsToContacts(user, state.module?.contacts);
  const canEditSelectedLesson =
    ability.can("update", "lesson") ||
    userBelongsToContacts(user, state.selectedLesson?.course?.contacts);
  const selectedCourse = state.module?.courses.find(
    (course) => course.id === state.selectedLesson?.courseId,
  );
  const isSelectedCourseAiIndexed = selectedCourse?.aiIndexed !== false;

  // Mesure du temps passé, à chaque niveau du contenu. Les quatre niveaux se
  // recouvrent volontairement : l'indicateur côté API additionne leçons et
  // activités et garde module et cours comme détail.
  useContentTracking("module", state.module?.id);
  useContentTracking("course", selectedCourse?.id);
  useContentTracking("lesson", state.selectedLesson?.id);
  useContentTracking("activity", state.selectedActivity?.id);

  const diagnosticQuiz = useDiagnosticQuiz(
    computed.hasStartedModule,
    isModuleLoaded,
    {
      id: state.module?.id,
      title: state.module?.title,
      description: state.module?.description,
    },
    moduleActions.onFinishInitialQuiz,
  );

  const quizState = useCourseQuiz(
    state.selectedLesson?.courseId,
    state.textActivityContent,
    isSelectedCourseAiIndexed,
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
    aiIndexed: isSelectedCourseAiIndexed,
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
              to={`/admin/parcours/edit/${state.module?.parcoursId}?step=4&moduleId=${state.module?.id}`}
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
          showPublishAll={state.module.courses.some(
            (course) => !course.isPublished,
          )}
          publishAllAction={
            <RoleRankGuard ranks={[0, 1, 2]}>
              <PermissionGuard object="course" action="update">
                <button
                  type="button"
                  className="btn tooltip tooltip-left border-secondary/20"
                  aria-label="Tout publier"
                  data-tip="Tout publier"
                  disabled={explorerStore.isPublishingAllCourses}
                  onClick={explorerStore.courseActions.publishAllCourses}
                >
                  {explorerStore.isPublishingAllCourses ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </button>
              </PermissionGuard>
            </RoleRankGuard>
          }
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
            <RoleRankGuard ranks={[3]}>
              <ProgressBar courses={state.module.courses} />
            </RoleRankGuard>
          }
          /* Preview */
          previewLesson={
            <ModuleExplorerPreview
              store={explorerStore}
              quizState={quizState}
              aiIndexed={isSelectedCourseAiIndexed}
              smartQuizState={smartQuizState}
              canEditSelectedLesson={canEditSelectedLesson}
              canNavigateAsAdmin={isAdminView}
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
