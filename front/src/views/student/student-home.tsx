import { useContext, useEffect, useState } from "react";
import UserTopBar from "../../components/UI/user-top-bar/user-top-bar";
import ResumeActivity from "../../components/student-home/resume-activity";
import ResumeActivities from "../../components/student-home/resume-activities";
import useHttp from "../../hooks/use-http";
import type LessonRead from "../../utils/interfaces/lesson-read";
import ResumeParcours from "../../components/student-home/resume-parcours";
import Timeline from "../../components/student-home/timeline/timeline";
import FeelingFeedback from "../../components/student-home/right-side/feeling-feedback";
import StudentAccomplishments from "../../components/student-home/right-side/feedback-apprenant/student-accomplishments";
import MostReadCourses from "../../components/student-home/right-side/most-read-courses";
import { Context } from "../../store/context.store";
import Header from "../../components/UI/header";
import { Bell, Search } from "lucide-react";

const StudentHome = () => {
  const { sendRequest } = useHttp();
  const { user } = useContext(Context);

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
          <Timeline title="Mon emploi du temps" viewType="day" />
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

export default StudentHome;
