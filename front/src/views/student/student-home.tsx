import { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import UserTopBar from "../../components/UI/user-top-bar/user-top-bar";
import Notifications from "../../components/student-home/notifications";
import ResumeActivity from "../../components/student-home/resume-activity";
import ResumeActivities from "../../components/student-home/resume-activities";
import useHttp from "../../hooks/use-http";
import LessonRead from "../../utils/interfaces/lesson-read";
import RightSide from "../../components/student-home/right-side/right-side";
import CalendarTimeline from "../../components/student-home/calendar-timeline";
import ResumeParcours from "../../components/student-home/resume-parcours";

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
    <div className="m-6 flex flex-col gap-6">
      <div className="flex w-full flex-col-reverse justify-between lg:flex-row">
        <span className="mt-5">
          <h1 className="text-3xl font-bold capitalize ">{`Bonjour, ${user?.firstname} ${user?.lastname} !`}</h1>
          <p>
            Bienvenue dans votre espace. Commencez votre apprentissage ou
            reprenez là où vous avez arrêté
          </p>
        </span>
        <span>
          <UserTopBar />
        </span>
      </div>
      <div className="grid gap-10 xl:grid-cols-4 xl:gap-0">
        <div className="flex flex-col gap-5 xl:col-span-3">
          <Notifications />
          {lastLessons && lastLessons?.length > 0 ? (
            <>
              <ResumeActivity lastLesson={lastLessons[0]} />
              <ResumeActivities lastLessons={lastLessons.splice(1)} />
            </>
          ) : (
            <ResumeParcours />
          )}
          <CalendarTimeline />
        </div>
        <RightSide />
      </div>
    </div>
  );
};

export default StudentHome;
