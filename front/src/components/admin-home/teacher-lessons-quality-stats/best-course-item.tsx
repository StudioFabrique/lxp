import { ArrowUpRight } from "lucide-react";

type BestCourseItemProps = {
  title: string;
  rating: number;
};

const BestCourseItem = ({ title, rating }: BestCourseItemProps) => {
  return (
    <div className="card bg-base-100 shadow-xl p-2 hover:cursor-pointer group">
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
    </div>
  );
};

export default BestCourseItem;
