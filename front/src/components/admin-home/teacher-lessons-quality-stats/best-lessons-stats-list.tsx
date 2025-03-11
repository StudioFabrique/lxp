import { ArrowUpRight } from "lucide-react";

const BestLessonsStatsList = () => {
  return (
    <div className="flex flex-col gap-2 p-2 w-full">
      <h3 className="font-bold text-base-100">Meilleurs cours</h3>

      <div className="card bg-base-100 shadow-xl p-2 hover:cursor-pointer group">
        <div className="card-body py-2 px-3 flex flex-row items-start justify-between">
          <div className="flex-1">
            <h2 className="card-title text-sm">Html</h2>
            <div className="mt-2">
              <div className="text-xs mb-1">Qualité du cours</div>
              <progress
                className="progress progress-primary w-full h-2"
                value="95"
                max="100"
              ></progress>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-2 hover:cursor-pointer group">
        <div className="card-body py-2 px-3 flex flex-row items-start justify-between">
          <div className="flex-1">
            <h2 className="card-title text-sm">Typescript</h2>
            <div className="mt-2">
              <div className="text-xs mb-1">Qualité du cours</div>
              <progress
                className="progress progress-primary w-full h-2"
                value="90"
                max="100"
              ></progress>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-2 hover:cursor-pointer group">
        <div className="card-body py-2 px-3 flex flex-row items-start justify-between">
          <div className="flex-1">
            <h2 className="card-title text-sm">CSS</h2>
            <div className="mt-2">
              <div className="text-xs mb-1">Qualité du cours</div>
              <progress
                className="progress progress-primary w-full h-2"
                value="82"
                max="100"
              ></progress>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};

export default BestLessonsStatsList;
