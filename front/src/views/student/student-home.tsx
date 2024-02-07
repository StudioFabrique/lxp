import { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import UserTopBar from "../../components/UI/user-top-bar/user-top-bar";
import Notifications from "../../components/student-home/notifications";
import ResumeActivity from "../../components/student-home/resume-activity";
import ResumeActivities from "../../components/student-home/resume-activities";
import useHttp from "../../hooks/use-http";
import LessonRead from "../../utils/interfaces/lesson-read";

const StudentHome = () => {
  const { sendRequest } = useHttp(true);
  const { user } = useContext(Context);

  const [lastCourses, setLastCourses] = useState<LessonRead[]>();

  useEffect(() => {
    const applyData = (data: { data: LessonRead[] }) => {
      setLastCourses(data.data);
    };

    sendRequest({ path: "/lesson/lastRead" }, applyData);
  }, [sendRequest]);

  console.log(lastCourses);

  return (
    <div className="flex flex-col gap-6 m-6">
      <div className="flex w-full justify-between">
        <span className="mt-5">
          <h1 className="font-bold text-2xl">{`Bonjour, ${user?.firstname} ${user?.lastname} !`}</h1>
          <p>
            Bienvenue dans votre espace. Commencez votre apprentissage ou
            reprenez là où vous avez arrêté
          </p>
        </span>
        <span>
          <UserTopBar />
        </span>
      </div>
      <div className="grid grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <Notifications />
          {/* <ResumeActivity />
          <ResumeActivities /> */}
        </div>

        <div className="flex flex-col gap-4"></div>
      </div>
    </div>
  );
};

export default StudentHome;
