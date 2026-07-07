import Module from "../../../../../src.legacy/utils/interfaces/module";
import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";

type ProgressModulesStatsProps = {
  modules: Module[];
};

const ProgressModulesStats = ({ modules }: ProgressModulesStatsProps) => {
  return (
    <Wrapper>
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
                  <div
                    className="flex flex-col justify-between gap-4 bg-base-200 border border-base-300 rounded-lg p-4 w-full shadow-sm hover:bg-base-300 transition-colors tooltip tooltip-bottom"
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
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProgressModulesStats;
