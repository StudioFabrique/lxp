import Module from "../../utils/interfaces/module";
import Wrapper from "../UI/wrapper/wrapper.component";
import { CSSProperties } from "react";

type ProgressModulesStatsProps = {
  modules: Module[];
};

const ProgressModulesStats = ({ modules }: ProgressModulesStatsProps) => {
  const radialStyle = (value: number) => {
    return {
      "--value": value,
    } as CSSProperties;
  };

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
                // Utilisation directe de la valeur calculée par le backend
                const moduleProgress = module.stats?.progress ?? 0;

                return (
                  <div
                    className="flex flex-col justify-between gap-2 text-primary-content font-bold tooltip tooltip-bottom border-1 border-primary rounded-xl p-4 py-4 w-full"
                    data-tip={module.title}
                    key={module.id}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base-content">{module.title}</p>
                      <p className="text-3xl text-primary">{`${moduleProgress} %`}</p>
                    </div>

                    <progress
                      className="progress progress-primary w-full"
                      value={moduleProgress}
                      max="100"
                      style={radialStyle(moduleProgress)}
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
