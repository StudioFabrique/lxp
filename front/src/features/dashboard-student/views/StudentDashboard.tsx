import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import ResumeActivity from "../components/resume-activity";
import ResumeActivities from "../components/resume-activities";
import ResumeParcours from "../components/resume-parcours";
import StudentTimeline from "../components/timeline/student-timeline";
import FeelingFeedback from "../components/right-side/feeling-feedback";
import StudentAccomplishments from "../components/right-side/feedback-apprenant/student-accomplishments";
import MostReadCourses from "../components/right-side/most-read-courses";
import OnboardingWelcome from "../../onboarding/OnboardingWelcome";
import { useStudentDashboard } from "../hooks/use-student-dashboard";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChartNoAxesCombined, Play } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    showOnboardingWelcome,
    welcomeTitle,
    welcomeMessage,
    lastLesson,
    remainingLessons,
    hasLastLessons,
    learningContext,
  } = useStudentDashboard();

  useEffect(() => {
    if (
      learningContext.data?.onboardingRequired &&
      learningContext.data.shouldAutoRedirect
    ) {
      navigate("/student/onboarding", { replace: true });
    }
  }, [learningContext.data, navigate]);

  const canResumeOnboarding =
    !learningContext.isError &&
    learningContext.data?.hasAvailableContent === true &&
    learningContext.data.onboardingRequired &&
    !learningContext.data.shouldAutoRedirect;

  if (learningContext.isLoading) {
    return (
      <PageWrapper aria-busy="true">
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="skeleton h-[50vh] w-full rounded-xl" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div data-onboarding="student-dashboard-header">
        {showOnboardingWelcome ? (
          <OnboardingWelcome layout="student" />
        ) : (
          <Header
            title={welcomeTitle}
            description={welcomeMessage}
            classname="capitalize"
          >
            {canResumeOnboarding ? (
              <Link to="/student/onboarding" className="btn btn-primary">
                <Play className="size-4 fill-current" aria-hidden="true" />
                Reprendre mon onboarding
              </Link>
            ) : (
              <Link to="/student/mon-avancement" className="btn btn-outline btn-primary">
                <ChartNoAxesCombined className="size-4" aria-hidden="true" />
                Mon avancement
              </Link>
            )}
          </Header>
        )}
      </div>

      {learningContext.isError ? (
        <BoxWrapper className="min-h-[50vh] items-center justify-center text-center">
          <p className="text-lg font-semibold">
            Impossible de charger votre contexte pédagogique.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => void learningContext.refetch()}
          >
            Réessayer
          </button>
        </BoxWrapper>
      ) : null}

      {!learningContext.isError &&
      learningContext.data?.hasAvailableContent === false ? (
        <EmptyStatePlaceholder title="Aucun contenu disponible pour l’instant, revenez plus tard !" />
      ) : null}

      {!learningContext.isError &&
      learningContext.data?.hasAvailableContent &&
      !learningContext.data.shouldAutoRedirect ? (
      <div className="grid gap-16 xl:grid-cols-3">
        <div
          className="flex flex-col gap-5 xl:col-span-2"
          data-onboarding="student-content"
        >
          {/* <Notifications /> */}
          {hasLastLessons && lastLesson ? (
            <>
              <ResumeActivity lastLesson={lastLesson} />
              <ResumeActivities lastLessons={remainingLessons} />
            </>
          ) : (
            <ResumeParcours />
          )}
          <StudentTimeline />
        </div>
        <div className="flex flex-col gap-5">
          {/*<UserTopBar />*/}
          <FeelingFeedback />
          <StudentAccomplishments />
          <MostReadCourses />
          {/* <Chat /> */}
        </div>
      </div>
      ) : null}
    </PageWrapper>
  );
};

export default StudentDashboard;
