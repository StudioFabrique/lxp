import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardStudentApi } from "../api/dashboard-student.api";
import Header from "../../../../src/components/headers/Header";
import { Bell, Search } from "lucide-react";
import { AuthContext } from "../../../store/AuthProvider";
import ResumeActivity from "../components/resume-activity";
import ResumeActivities from "../components/resume-activities";
import ResumeParcours from "../components/resume-parcours";
import StudentTimeline from "../components/timeline/student-timeline";
import FeelingFeedback from "../components/right-side/feeling-feedback";
import StudentAccomplishments from "../components/right-side/feedback-apprenant/student-accomplishments";
import MostReadCourses from "../components/right-side/most-read-courses";
import OnboardingWelcome from "../../onboarding/OnboardingWelcome";
import { useOnboarding } from "../../onboarding/OnboardingContext";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const { status: onboardingStatus } = useOnboarding();
  const showOnboardingWelcome = onboardingStatus === "pending";

  const { data: lastLessons } = useQuery({
    queryKey: ["last-read-lessons"],
    queryFn: dashboardStudentApi.queries.getLastReadLessons,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <div data-onboarding="student-dashboard-header">
        {showOnboardingWelcome ? (
          <OnboardingWelcome layout="student" />
        ) : (
          <Header
            title={`Bonjour, ${user?.firstname} ${user?.lastname} !`}
            description="Bienvenue dans votre espace. Commencez votre apprentissage ou
                reprenez là où vous vous êtes arrêté."
            classname="capitalize"
          >
            <div className="flex gap-4 w-full">
              <button className="btn btn-outline btn-primary hover:text-base-100 text-primary">
                <Search />
              </button>
              <button className="btn btn-outline btn-primary hover:text-base-100 text-primary">
                <Bell />
              </button>
            </div>
          </Header>
        )}
      </div>

      <div className="grid gap-16 xl:grid-cols-3">
        <div
          className="flex flex-col gap-5 xl:col-span-2"
          data-onboarding="student-content"
        >
          {/* <Notifications /> */}
          {lastLessons && lastLessons?.length > 0 ? (
            <>
              <ResumeActivity lastLesson={lastLessons[0]} />
              <ResumeActivities lastLessons={lastLessons.slice(1)} />
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
    </div>
  );
};

export default StudentDashboard;
