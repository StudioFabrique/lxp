import ProgressBar from "../../components/module-content-explorer/progress-bar";
import useModuleContentExplorer from "./hooks/use-module-explorer";
import ModuleContentExplorerHeader from "../../components/module-content-explorer/module-content-explorer-header";
import ModuleData from "../../components/module-content-explorer/module-data/module-data";
import ModuleContentExplorerWrapper from "../../components/module-content-explorer/module-content-explorer-wrapper";
import ModuleContentExplorerSkeleton from "./module-content-explorer-skeleton";
import LessonCompletionModal from "../../components/module-content-explorer/lesson-completion-modal";
import Can from "../../components/UI/can/can.component";
import { Link, useNavigate } from "react-router-dom";
import { PenBox } from "lucide-react";
import { useContext } from "react";
import Header from "../../components/UI/header";
import { Context } from "../../store/context.store";
import userBelongsToContacts from "../../utils/userBelongsToContacts";
import useActivityQuizz from "../../hooks/use-activity-quiz";
import QuizModal from "../../components/quizzes/modals/quiz-modal";
import QuizRequestModal from "../../components/quizzes/modals/quiz-request-modal";
import useSmartQuizPrompt from "../../hooks/use-smart-quiz-prompt";
import ModuleExplorerSidebar from "../../components/module-content-explorer/sidebar/module-explorer-sidebar";
import ModuleExplorerPreview from "../../components/module-content-explorer/preview/module-explorer-preview";

export type ExplorerStore = ReturnType<typeof useModuleContentExplorer>;

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant.
 * La modification de contenu est aussi possible pour le formateur et l'admin.
 */
const ModuleContentExplorer = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const firstPathSegment = window.location.pathname.split("/")[1];

  const explorerStore = useModuleContentExplorer();
  const { state, computed, dispatch, lessonActions } = explorerStore;
  const {
    module,
    selectedLesson,
    selectedActivity,
    isPanelClosed,
    modalVisibility,
  } = state;

  const quizState = useActivityQuizz(selectedLesson?.id);
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
        onClose={quizState.onCloseQuizzes}
        onAnswer={quizState.onAnswerQuiz}
        onNext={quizState.onNextQuiz}
      />

      <QuizRequestModal
        isOpen={smartQuiz.showQuizPrompt}
        onAcceptQuiz={smartQuiz.handleAcceptQuiz}
        onDeclineQuiz={smartQuiz.handleDeclineQuiz}
      />

      {modalVisibility === "lessonCompletionModal" && selectedLesson && (
        <LessonCompletionModal
          lesson={selectedLesson}
          isLessonCompleted={computed.isLessonCompleted}
          isLastLessonSelected={computed.isLastLessonSelected}
          isLastActivitySelected={computed.isLastActivitySelected}
          onRateAndComplete={lessonActions.completeLesson}
          onClickNextLesson={lessonActions.nextLesson}
          onClickMinimizeButton={() =>
            dispatch({ type: "set_modal_visibility", modalVisibility: "none" })
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
          <Can object="lesson" action="update">
            <Link
              className="btn btn-primary text-base-100 gap-2"
              to={`/admin/parcours/edit/${module?.parcoursId}?step=4`}
            >
              <PenBox /> Modifier le module
            </Link>
          </Can>
        )}
      </Header>

      {/* --- Section Contenu (Wrapper & Slots) --- */}
      {module && module.parcoursId && module.id ? (
        <ModuleContentExplorerWrapper
          selectedLesson={selectedLesson}
          isPanelClosed={isPanelClosed}
          onTogglePanel={() => dispatch({ type: "toggle_panel_visibility" })}
          onCloseAll={() => {
            dispatch({ type: "select_lesson", lesson: undefined });
            navigate(".", { replace: true });
          }}
          // Utilisation propre de nos sous-composants dédiés :
          header={<ModuleContentExplorerHeader moduleData={module} />}
          progressionSide={
            <ModuleExplorerSidebar
              store={explorerStore}
              canEditModule={canEditModule}
              canEditSelectedLesson={canEditSelectedLesson}
            />
          }
          topProgressBar={
            <Can action="component" object="progression">
              <ProgressBar courses={module.courses} />
            </Can>
          }
          previewLesson={
            <ModuleExplorerPreview
              store={explorerStore}
              quizState={quizState}
              smartQuiz={smartQuiz}
              canEditSelectedLesson={canEditSelectedLesson}
            />
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
