import Header from "../../../../src/components/headers/Header";
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

const StudentDashboard = () => {
  const {
    showOnboardingWelcome,
    welcomeTitle,
    welcomeMessage,
    lastLesson,
    remainingLessons,
    hasLastLessons,
  } = useStudentDashboard();

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
            {/* Ajouter boutons ici par la suite */}
          </Header>
        )}
      </div>

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
    </PageWrapper>
  );
};

export default StudentDashboard;
