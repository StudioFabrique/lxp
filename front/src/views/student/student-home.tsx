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
    <div className="flex flex-col gap-6 m-6">
      <div className="flex flex-col-reverse lg:flex-row w-full justify-between">
        <span className="mt-5">
          <h1 className="font-bold text-3xl">{`Bonjour, ${user?.firstname} ${user?.lastname} !`}</h1>
          <p>
            Bienvenue dans votre espace. Commencez votre apprentissage ou
            reprenez là où vous avez arrêté
          </p>
        </span>
        <span>
          <UserTopBar />
        </span>
      </div>
      <div className="grid xl:grid-cols-4 xl:gap-0 gap-10">
        <div className="xl:col-span-3 flex flex-col gap-5">
          <Notifications />
          {lastLessons && lastLessons?.length > 0 && (
            <>
              <ResumeActivity lastLesson={lastLessons[0]} />
              <ResumeActivities lastLessons={lastLessons.splice(1)} />
            </>
          )}
          <CalendarTimeline />
        </div>
        <RightSide />
      </div>
    </div>
  );
};

export default StudentHome;
