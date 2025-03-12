import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import BestLessonsStatsList from "./best-courses-list";
import LessonsQualityStats from "../../../utils/interfaces/lessons-quality-stats";

const TeacherLessonsQualityStats = () => {
  const { sendRequest } = useHttp();

  const [stats, setStats] = useState<LessonsQualityStats>();

  useEffect(() => {
    const applyData = (data: LessonsQualityStats) => {
      setStats(data);
      console.log(data);
    };

    sendRequest({ path: "/course/best-rated" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col gap-2 w-[40%]">
      <h2 className="font-bold">Qualité des cours</h2>
      <div className="bg-primary flex justify-between w-full h-full p-5 rounded-lg">
        {/* <LessonsQualityRadialProgress value={70} /> */}
        <BestLessonsStatsList coursesRating={stats?.coursesRating} />
      </div>
    </div>
  );
};

export default TeacherLessonsQualityStats;
