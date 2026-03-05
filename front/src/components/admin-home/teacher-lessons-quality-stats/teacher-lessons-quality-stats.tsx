import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import BestLessonsStatsList from "./best-courses-list";
import LessonsQualityStats from "../../../utils/interfaces/lessons-quality-stats";
import { Link } from "react-router-dom";

const TeacherLessonsQualityStats = () => {
  const { sendRequest } = useHttp();

  const [stats, setStats] = useState<LessonsQualityStats>();

  useEffect(() => {
    const applyData = (data: LessonsQualityStats) => {
      setStats(data);
    };

    sendRequest({ path: "/course/best-rated" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col gap-2 w-[40%]">
      <h2 className="font-bold">Classement de mes cours</h2>
      <div className="bg-primary flex flex-col gap-5 justify-between w-full h-full p-5 rounded-lg">
        {/* <LessonsQualityRadialProgress value={70} /> */}
        <BestLessonsStatsList coursesRating={stats?.coursesRating} />
        <Link
          to="/admin/course/stats"
          className="btn btn-sm btn-secondary text-neutral-content self-end"
        >
          Afficher plus
        </Link>
      </div>
    </div>
  );
};

export default TeacherLessonsQualityStats;
