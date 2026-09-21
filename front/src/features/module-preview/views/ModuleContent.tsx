import useModuleContent from "../hooks/use-module-content";
import useContentTracking from "../hooks/use-content-tracking";
import ModuleContentSkeleton from "./ModuleContentSkeleton";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowDownUp, CalendarDays, Check, LoaderCircle, PenBox, UploadCloud } from "lucide-react";
import { useContext, useState } from "react";
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
import ModuleContentLayout from "../components/module-content-layout";
import ModuleContentHeader from "../components/module-content-header";
import ModuleContentSidebar from "../components/sidebar/module-content-sidebar";
import ProgressBar from "../components/progress-bar";
import ModuleContentPreview from "../components/preview/module-content-preview";
import ModuleData from "../components/module-data/module-data";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { AbilityContext } from "../../../rbac/AbilityProvider";
import ModuleCompletionModal from "../components/module-completion-modal";

import useModuleCalendar from "../hooks/use-module-calendar";
import ModuleCourseCalendar from "../components/calendar/module-course-calendar";
import { getUserArea, hasRoleRank } from "../../../utils/helpers/user-role";
import CourseAssignmentView from "../components/assignment/course-assignment";

export type ModuleContentStore = ReturnType<typeof useModuleContent>;

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant.
 * La modification de contenu est aussi possible pour le formateur et l'admin.
 */
const ModuleContent = () => {
  const { user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as {
    assignmentCourseId?: number;
    assignmentSubmissionId?: number;
  } | null;
  const requestedAssignmentCourseId = navigationState?.assignmentCourseId;
  const requestedAssignmentSubmissionId =
    navigationState?.assignmentSubmissionId;
  const firstPathSegment = window.location.pathname.split("/")[1];
  const isAdminView = firstPathSegment === "admin";

  const contentStore = useModuleContent();
  const {
    state,
    computed,
    dispatch,
    lessonActions,
    moduleActions,
    scrollTopRef,
  } = contentStore;

  const [calendarModuleId, setCalendarModuleId] = useState<number | null>(null);
  const [isReorderingCourses, setIsReorderingCourses] = useState(false);
  const [assignmentSelection, setAssignmentSelection] = useState({
    locationKey: location.key,
    courseId: requestedAssignmentCourseId,
  });
  const selectedAssignmentCourseId =
    assignmentSelection.locationKey === location.key
      ? assignmentSelection.courseId
      : requestedAssignmentCourseId;
  const setSelectedAssignmentCourseId = (courseId?: number) =>
    setAssignmentSelection({ locationKey: location.key, courseId });
  const canPlanCourses = hasRoleRank(user, [0, 1, 2]) && ability.can("update", "course");
  const isCalendarView = canPlanCourses && Boolean(state.module?.id) && calendarModuleId === state.module?.id;
  const calendar = useModuleCalendar(state.module, isCalendarView);

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
    (course) =>
      course.id ===
      (selectedAssignmentCourseId ?? state.selectedLesson?.courseId),
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
    <PageWrapper>
      {/* --- Section Modales --- */}
      {contentStore.badgeCompletion && (
        <ModuleCompletionModal
          moduleTitle={contentStore.badgeCompletion.moduleTitle}
          badges={contentStore.badgeCompletion.badges}
          onClose={contentStore.closeBadgeCompletion}
        />
      )}
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
            hasNextContent={Boolean(
              computed.isLastLessonOfCurrentCourse && selectedCourse?.assignment,
            )}
            nextContentLabel={
              computed.isLastLessonOfCurrentCourse && selectedCourse?.assignment
                ? "Accéder au devoir"
                : undefined
            }
            onClickNextLesson={() => {
              if (
                computed.isLastLessonOfCurrentCourse &&
                selectedCourse?.assignment
              ) {
                setSelectedAssignmentCourseId(selectedCourse.id);
                dispatch({ type: "select_lesson", lesson: undefined });
                dispatch({
                  type: "set_modal_visibility",
                  modalVisibility: "none",
                });
                return;
              }
              lessonActions.nextLesson();
            }}
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
        <ModuleContentLayout
          calendarAction={canPlanCourses && (
            <button type="button" className={`btn gap-2 border-secondary/20 ${isCalendarView ? "btn-primary" : ""}`}
              aria-pressed={isCalendarView} disabled={calendar.isSaving}
              onClick={() => {
                setIsReorderingCourses(false);
                setCalendarModuleId(isCalendarView ? null : state.module!.id!);
                calendar.setSelection(null);
                calendar.setIsAdding(false);
                if (!isCalendarView && state.isPanelClosed) dispatch({ type: "toggle_panel_visibility" });
              }}>
              <CalendarDays className="size-5" /> Calendrier
            </button>
          )}
          calendarContent={isCalendarView ? <ModuleCourseCalendar key={state.module.id} module={state.module} store={calendar} /> : undefined}
          reorderCoursesAction={!isCalendarView && state.module.courses.length > 1 && canEditModule ? (
            <PermissionGuard object="course" action="update">
              <button
                type="button"
                className={`btn tooltip tooltip-right border-secondary/20 ${isReorderingCourses ? "btn-primary" : ""}`}
                aria-label={isReorderingCourses ? "Terminer la réorganisation" : "Réorganiser les cours"}
                aria-pressed={isReorderingCourses}
                data-tip={isReorderingCourses ? "Terminer" : "Réorganiser les cours"}
                onClick={() => {
                  setIsReorderingCourses((active) => !active);
                  if (state.isPanelClosed) dispatch({ type: "toggle_panel_visibility" });
                }}
              >
                {isReorderingCourses ? (
                  <Check className="size-5" />
                ) : (
                  <ArrowDownUp className="size-5" />
                )}
              </button>
            </PermissionGuard>
          ) : undefined}
          scrollTopRef={scrollTopRef}
          selectedLesson={state.selectedLesson}
          isContentSelected={Boolean(
            state.selectedLesson || selectedAssignmentCourseId,
          )}
          isPanelClosed={state.isPanelClosed}
          onTogglePanel={() => {
            if (!state.isPanelClosed) setIsReorderingCourses(false);
            dispatch({ type: "toggle_panel_visibility" });
          }}
          onCloseAll={() => {
            setSelectedAssignmentCourseId(undefined);
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
                  disabled={contentStore.isPublishingAllCourses}
                  onClick={contentStore.courseActions.publishAllCourses}
                >
                  {contentStore.isPublishingAllCourses ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </button>
              </PermissionGuard>
            </RoleRankGuard>
          }
          header={<ModuleContentHeader moduleData={state.module} />}
          progressionSide={
            /* Sidebar */
            <ModuleContentSidebar
              store={contentStore}
              calendar={isCalendarView ? calendar : undefined}
              canEditModule={canEditModule}
              canEditSelectedLesson={canEditSelectedLesson}
              selectedAssignmentCourseId={selectedAssignmentCourseId}
              isReorderingCourses={isReorderingCourses}
              onSelectAssignment={(courseId) => {
                setSelectedAssignmentCourseId(courseId);
                if (courseId) {
                  dispatch({ type: "select_lesson", lesson: undefined });
                }
              }}
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
            selectedAssignmentCourseId && selectedCourse?.assignment ? (
              <CourseAssignmentView
                course={selectedCourse}
                staff={getUserArea(user) === "staff"}
                initialSubmissionId={requestedAssignmentSubmissionId}
                onChanged={moduleActions.fetchModuleData}
              />
            ) : (
              <ModuleContentPreview
                store={contentStore}
                quizState={quizState}
                aiIndexed={isSelectedCourseAiIndexed}
                smartQuizState={smartQuizState}
                canEditSelectedLesson={canEditSelectedLesson}
                canNavigateAsAdmin={isAdminView}
              />
            )
          }
          moduleData={<ModuleData moduleData={state.module} />}
        />
      ) : (
        /* Skeleton */
        <ModuleContentSkeleton />
      )}
    </PageWrapper>
  );
};

export default ModuleContent;
