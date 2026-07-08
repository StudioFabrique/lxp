import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { toUpperFirstLetter } from "../../../../utils/helpers/text-helpers";
import RatingWithStars from "../../../../../src.legacy/components/UI/lesson-rating/rating-with-stars";

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
        <div className="flex-1 flex justify-between">
          <div className="flex gap-1 items-center">
            <h2 className="card-title text-sm">{toUpperFirstLetter(title)}</h2>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <RatingWithStars selectedStars={rating} />
        </div>
      </div>
    </Link>
  );
};

export default BestCourseItem;
