import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type BestCourseItemProps = {
  firstLessonId: number;
  moduleId: number;
  title: string;
  rating: number;
};

const BestCourseItem = ({
  firstLessonId,
  moduleId,
  title,
  rating,
}: BestCourseItemProps) => {
  return (
    <Link
      to={`/admin/parcours/module/${moduleId}`}
      state={{ lessonId: firstLessonId }}
      className="card bg-base-100 shadow-xl p-2 hover:cursor-pointer group"
    >
      <div className="card-body py-2 px-3 flex flex-row items-start justify-between">
        <div className="flex-1">
          <h2 className="card-title text-sm">{title}</h2>
          <div className="mt-2">
            <div className="text-xs mb-1">Qualité du cours</div>
            <progress
              className="progress progress-primary w-full h-2"
              value={rating}
              max="100"
            ></progress>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
};

export default BestCourseItem;
