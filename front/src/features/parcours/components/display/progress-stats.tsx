import Module from "../../../../../src/utils/interfaces/module";
import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { Link, useLocation } from "react-router";

type ProgressModulesStatsProps = {
  modules: Module[];
};

const ProgressModulesStats = ({ modules }: ProgressModulesStatsProps) => {
  const { pathname } = useLocation();
  const space = pathname.split("/")[1];

  return (
    <BoxWrapper>
      <div className="flex flex-col gap-5 justify-between">
        <h2 className="text-2xl font-bold text-primary">
          Votre avancement dans le parcours
        </h2>
        <div className="flex gap-10 items-center">
          <div className="grid grid-cols-4 gap-5 w-full">
            {modules
              ?.filter((_x, i) => i < 4)
              .map((module) => {
                const moduleProgress = module.stats?.progress ?? 0;

                return (
                  <Link
                    to={`/${space}/parcours/module/${module.id}`}
                    aria-label={`Accéder au module ${module.title}`}
                    className="tooltip tooltip-bottom flex w-full flex-col justify-between gap-4 rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm transition-colors hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    data-tip={module.title}
                    key={module.id}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base-content text-sm font-semibold truncate w-3/4 text-left">
                        {module.title}
                      </p>
                      <p className="text-2xl text-primary font-bold">{`${moduleProgress}%`}</p>
                    </div>

                    <progress
                      className="progress progress-primary w-full"
                      value={moduleProgress}
                      max="100"
                    />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </BoxWrapper>
  );
};

export default ProgressModulesStats;
