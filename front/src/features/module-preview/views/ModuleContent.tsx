import useModuleContent from "../hooks/use-module-content";
import useContentTracking from "../hooks/use-content-tracking";
import ModuleContentSkeleton from "./ModuleContentSkeleton";
import { useLocation, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../../store/AuthProvider";
import userBelongsToContacts from "../../../utils/helpers/user-belongs-to-contacts";
import useDiagnosticQuiz from "../../quiz/hooks/use-diagnostic-quiz";
import useCourseQuiz from "../../quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../quiz/hooks/use-smart-quiz-prompt";
import DiagnosticQuiz from "../../quiz/components/diagnostic-quiz";
import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import ModuleContentLayout from "../components/module-content-layout";
import ModuleContentHeader from "../components/module-content-header";
import ModuleContentSidebar from "../components/sidebar/module-content-sidebar";
import ProgressBar from "../components/progress-bar";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { AbilityContext } from "../../../rbac/AbilityProvider";

import useModuleCalendar from "../hooks/use-module-calendar";
import { getUserArea, hasRoleRank } from "../../../utils/helpers/user-role";
import ModuleContentToolbar from "../components/module-content-toolbar";
import ModuleContentDialogs from "../components/module-content-dialogs";
import ModuleContentPageHeader from "../components/module-content-page-header";
import ModuleContentBody from "../components/module-content-body";

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
  const userArea = getUserArea(user);
  const isStudentView = firstPathSegment === "student";
  const isAdminView = firstPathSegment === "admin";

  const contentStore = useModuleContent();
  const {
    state,
    computed,
    dispatch,
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
  useContentTracking(
    "lesson",
    !isStudentView || computed.hasStartedModule ? state.selectedLesson?.id : undefined,
  );
  useContentTracking(
    "activity",
    !isStudentView || computed.hasStartedModule ? state.selectedActivity?.id : undefined,
  );

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

  const handleSelectAssignment = (courseId?: number) => {
    setSelectedAssignmentCourseId(courseId);
    if (courseId) dispatch({ type: "select_lesson", lesson: undefined });
  };

  const handleToggleSidebar = () => {
    if (!state.isPanelClosed) setIsReorderingCourses(false);
    dispatch({ type: "toggle_panel_visibility" });
  };

  const handleToggleCourseReordering = () => {
    setIsReorderingCourses((active) => !active);
    if (state.isPanelClosed) dispatch({ type: "toggle_panel_visibility" });
  };

  const handleToggleCalendar = () => {
    if (!state.module?.id) return;

    setIsReorderingCourses(false);
    setCalendarModuleId(isCalendarView ? null : state.module.id);
    calendar.setSelection(null);
    calendar.setIsAdding(false);
    if (!isCalendarView && state.isPanelClosed) {
      dispatch({ type: "toggle_panel_visibility" });
    }
  };

  const handleCloseContent = () => {
    setSelectedAssignmentCourseId(undefined);
    dispatch({ type: "select_lesson", lesson: undefined });
    navigate(".", { replace: true });
  };

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
      <ModuleContentDialogs
        store={contentStore}
        selectedCourse={selectedCourse}
        quiz={quizState}
        smartQuiz={smartQuizState}
        onOpenAssignment={handleSelectAssignment}
      />

      <ModuleContentPageHeader
        module={state.module}
        isStudentView={isStudentView}
        canEditModule={canEditModule}
      />

      {state.module && state.module?.parcoursId && state.module.id ? (
        <ModuleContentLayout
          header={<ModuleContentHeader moduleData={state.module} />}
          toolbar={
            <ModuleContentToolbar
              progress={
                <RoleRankGuard ranks={[3]}>
                  <ProgressBar courses={state.module.courses} />
                </RoleRankGuard>
              }
              progressRef={scrollTopRef}
              isSidebarCollapsed={state.isPanelClosed}
              isContentSelected={Boolean(
                state.selectedLesson || selectedAssignmentCourseId,
              )}
              canPlanCourses={canPlanCourses}
              isCalendarView={isCalendarView}
              isCalendarSaving={calendar.isSaving}
              canReorderCourses={
                canEditModule && state.module.courses.length > 1
              }
              isReorderingCourses={isReorderingCourses}
              showPublishAll={state.module.courses.some(
                (course) => !course.isPublished,
              )}
              isPublishingAll={contentStore.isPublishingAllCourses}
              onToggleSidebar={handleToggleSidebar}
              onToggleCalendar={handleToggleCalendar}
              onToggleCourseReordering={handleToggleCourseReordering}
              onPublishAll={contentStore.courseActions.publishAllCourses}
              onCloseContent={handleCloseContent}
            />
          }
          sidebar={
            <ModuleContentSidebar
              store={contentStore}
              calendar={isCalendarView ? calendar : undefined}
              canEditModule={canEditModule}
              canEditSelectedLesson={canEditSelectedLesson}
              selectedAssignmentCourseId={selectedAssignmentCourseId}
              isReorderingCourses={isReorderingCourses}
              onSelectAssignment={handleSelectAssignment}
            />
          }
          isSidebarCollapsed={state.isPanelClosed}
        >
          <ModuleContentBody
            module={state.module}
            store={contentStore}
            calendar={isCalendarView ? calendar : undefined}
            selectedCourse={selectedCourse}
            selectedAssignmentCourseId={selectedAssignmentCourseId}
            requestedAssignmentSubmissionId={requestedAssignmentSubmissionId}
            quiz={quizState}
            smartQuiz={smartQuizState}
            canEditSelectedLesson={canEditSelectedLesson}
            canNavigateAsAdmin={isAdminView}
            isStaff={userArea === "staff"}
          />
        </ModuleContentLayout>
      ) : (
        <ModuleContentSkeleton />
      )}
    </PageWrapper>
  );
};

export default ModuleContent;
