import { useContext, useEffect, useState } from "react";
import UserTopBar from "../../../../src.legacy/components/UI/user-top-bar/user-top-bar";
import ResumeActivity from "../../../../src.legacy/components/student-home/resume-activity";
import ResumeActivities from "../../../../src.legacy/components/student-home/resume-activities";
import useHttp from "../../../../src.legacy/hooks/use-http";
import type LessonRead from "../../../../src.legacy/utils/interfaces/lesson-read";
import ResumeParcours from "../../../../src.legacy/components/student-home/resume-parcours";
import StudentTimeline from "../../../../src.legacy/components/student-home/timeline/student-timeline";
import FeelingFeedback from "../../../../src.legacy/components/student-home/right-side/feeling-feedback";
import StudentAccomplishments from "../../../../src.legacy/components/student-home/right-side/feedback-apprenant/student-accomplishments";
import MostReadCourses from "../../../../src.legacy/components/student-home/right-side/most-read-courses";
import Header from "../../../../src.legacy/components/UI/header";
import { Bell, Search } from "lucide-react";
import { AuthContext } from "../../../store/AuthProvider";

const StudentDashboard = () => {
  const { sendRequest } = useHttp();
  const { user } = useContext(AuthContext);

  const [lastLessons, setLastLessons] = useState<LessonRead[]>();

  useEffect(() => {
    const applyData = (data: { data: LessonRead[] }) => {
      setLastLessons(data.data);
    };

    sendRequest({ path: "/lesson/last-read" }, applyData);
  }, [sendRequest]);

  return (
    <div className="w-full flex flex-col gap-6">
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

      <div className="grid gap-16 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          {/* <Notifications /> */}
          {lastLessons && lastLessons?.length > 0 ? (
            <>
              <ResumeActivity lastLesson={lastLessons[0]} />
              <ResumeActivities lastLessons={lastLessons.splice(1)} />
            </>
          ) : (
            <ResumeParcours />
          )}
          <StudentTimeline />
        </div>
        <div className="flex flex-col gap-5">
          <UserTopBar />
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
