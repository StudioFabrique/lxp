import useModuleContent from "../hooks/use-module-content";
import useContentTracking from "../hooks/use-content-tracking";
import ModuleContentSkeleton from "./ModuleContentSkeleton";
import { useLocation, useNavigate } from "react-router";
import { useContext, useMemo, useState } from "react";
import { calculateActivityReadTime } from "../../../components/tiptap-editor/utils/activity-read-time-helper";
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
    (!isStudentView || computed.hasStartedModule) &&
      state.mode === "read" && !contentStore.isActivityContentLoading
      ? state.selectedActivity?.id : undefined,
    (activityId, readId) => dispatch({ type: "mark_activity_as_read", activityId, readId }),
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

  // Le quiz initial ne dispense pas du quiz rapide de l'activité en cours.
  const estimatedReadTimeMs = useMemo(
    () => calculateActivityReadTime(state.textActivityContent).readTimeMs,
    [state.textActivityContent],
  );
  const smartQuizState = useSmartQuizPrompt({
    selectedActivity: state.selectedActivity,
    estimatedReadTimeMs,
    isLessonCompleted: computed.isLessonCompleted,
    isAnyQuizOpen: quizState.isOpen,
    onTriggerRandomQuiz: quizState.onTriggerRandomQuiz,
    onGoToNextActivity: () => dispatch({ type: "go_to_next_activity" }),
    onCompleteLesson: () => {
      if (!computed.isLessonCompleted && !computed.areAllActivitiesRead) return;
      return computed.isLessonCompleted
        ? contentStore.lessonActions.nextLesson()
        : dispatch({
            type: "set_modal_visibility",
            modalVisibility: "lessonCompletionModal",
          });
    },
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
        moduleImage={state.module?.image}
        quiz={diagnosticQuiz.currentQuiz}
        currentIndex={diagnosticQuiz.currentIndex}
        totalQuizzes={diagnosticQuiz.quizzes?.length || 0}
        isAnswered={diagnosticQuiz.isAnswered}
        isCorrect={diagnosticQuiz.isCorrect}
        isStreaming={diagnosticQuiz.isStreaming}
        isRestoring={diagnosticQuiz.isRestoring}
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
                  <ProgressBar
                    courses={state.module.courses}
                    selectedLessonId={state.selectedLesson?.id}
                    onSelectLesson={(lessonId) => {
                      setSelectedAssignmentCourseId(undefined);
                      dispatch({ type: "select_content_by_id", lessonId });
                    }}
                  />
                </RoleRankGuard>
              }
              progressRef={scrollTopRef}
              isSidebarCollapsed={state.isPanelClosed}
              isContentSelected={Boolean(
                state.selectedLesson || selectedAssignmentCourseId,
              )}
              showCompletionBadge={isStudentView && userArea === "student" && state.module.stats?.isCompleted === true}
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
              showCourseVisibility={state.module.courses.length > 0}
              areAllCoursesVisible={state.module.courses.every((course) => course.visibility)}
              isUpdatingCourseVisibility={contentStore.isUpdatingCourseVisibility}
              onToggleCourseVisibility={contentStore.courseActions.toggleAllCoursesVisibility}
              onToggleSidebar={handleToggleSidebar}
              onToggleCalendar={handleToggleCalendar}
              onToggleCourseReordering={handleToggleCourseReordering}
              onPublishAll={contentStore.courseActions.publishAllCourses}
              onCloseContent={handleCloseContent}
              onOpenCompletionBadge={contentStore.openBadgeCompletion}
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
            onSelectAssignment={handleSelectAssignment}
          />
        </ModuleContentLayout>
      ) : (
        <ModuleContentSkeleton />
      )}
    </PageWrapper>
  );
};

export default ModuleContent;
