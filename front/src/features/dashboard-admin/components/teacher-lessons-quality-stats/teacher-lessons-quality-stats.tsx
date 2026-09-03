import { useQuery } from "@tanstack/react-query";
import { dashboardAdminApi } from "../../api/dashboard-admin.api";
import BestLessonsStatsList from "./best-courses-list";

const TeacherLessonsQualityStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["best-rated-courses"],
    queryFn: dashboardAdminApi.queries.getBestRatedCourses,
  });

  return (
    <div className="flex flex-col gap-2 w-[40%]">
      <h2 className="font-bold">Classement de mes cours</h2>
      <div className="bg-base-200 flex flex-col gap-5 justify-between w-full h-full p-5 rounded-lg">
        {/* <LessonsQualityRadialProgress value={70} /> */}
        <BestLessonsStatsList coursesRating={stats?.coursesRating} />
        {/*<Link
          to="/admin/course/stats"
          className="btn btn-sm btn-secondary self-end"
        >
          Afficher plus
        </Link>*/}
      </div>
    </div>
  );
};

export default TeacherLessonsQualityStats;
