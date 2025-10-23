/* eslint-disable @typescript-eslint/no-explicit-any */
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
          <div className="grid grid-cols-4 gap-5">
            {modules
              ?.filter((_x, i) => i < 4)
              .map((module) => {
                const moduleProgress =
                  (module.courses.length > 0
                    ? module.courses.reduce(
                        (sum, course) =>
                          sum +
                          (course.lessons.length > 0
                            ? course.lessons.reduce(
                                (sum, lesson) =>
                                  sum +
                                  (lesson?.lessonsRead &&
                                  lesson.lessonsRead[0].finishedAt
                                    ? 1
                                    : 0),
                                0
                              ) / course.lessons.length
                            : 0),
                        0
                      ) / module.courses.length
                    : 0) * 100;

                return (
                  <div
                    className="flex flex-col justify-between gap-2 text-primary-content font-bold tooltip tooltip-bottom border-1 border-primary rounded-xl p-4 py-4 w-full"
                    data-tip={module.title}
                    key={module.id}
                  >
                    <div className="flex items-center justify-between">
                      <p className="w-[60%]">{module.title}</p>
                      <p className="text-3xl text-primary">{`${Math.round(
                        moduleProgress
                      )} %`}</p>
                    </div>

                    <progress
                      className="progress progress-primary w-full"
                      value={Math.round(moduleProgress)}
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
