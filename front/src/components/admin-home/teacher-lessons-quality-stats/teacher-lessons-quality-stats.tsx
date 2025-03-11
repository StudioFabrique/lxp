import BestLessonsStatsList from "./best-lessons-stats-list";
import LessonsQualityRadialProgress from "./lessons-quality-radial-progress";

const TeacherLessonsQualityStats = () => {
  return (
    <div className="flex flex-col col-span-2">
      <h2 className="font-bold">Qualité des cours</h2>
      <div className="bg-primary flex justify-between w-full h-full p-5">
        <LessonsQualityRadialProgress value={70} />
        <BestLessonsStatsList />
      </div>
    </div>
  );
};

export default TeacherLessonsQualityStats;
