/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import Wrapper from "../UI/wrapper/wrapper.component";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import { useSelector } from "react-redux";
import Module from "../../utils/interfaces/module";
import { CSSProperties } from "react";

const ProgressStats = () => {
  const navigate = useNavigate();

  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const radialStyle = (value: number) => {
    return {
      "--value": value,
    } as CSSProperties;
  };

  return (
    <Wrapper>
      <div className="flex flex-col justify-between">
        <div className="flex gap-10 items-center">
          <h2 className="text-2xl w-44 font-bold text-primary">
            Votre avancement dans le parcours
          </h2>
          <div className="flex gap-10">
            {modules
              ?.filter((_x, i) => i < 4)
              .map((module, i) => {
                const moduleProgress =
                  (module.courses.reduce(
                    (sum, course) =>
                      sum +
                      course.lessons.reduce(
                        (sum, lesson) =>
                          sum +
                          (lesson?.lessonsRead?.length &&
                          lesson.lessonsRead[0].finishedAt
                            ? 1
                            : 0),
                        0
                      ) /
                        course.lessons.length,
                    0
                  ) /
                    module.courses.length) *
                  100;

                return (
                  <div
                    className="flex flex-col justify-center gap-2 items-center bg-secondary-focus text-primary-focus font-bold w-[10em] h-[10em] rounded-xl"
                    key={module.id}
                  >
                    <p
                      className="radial-progress"
                      style={radialStyle(moduleProgress)}
                    >
                      {`${Math.round(moduleProgress)} %`}
                    </p>
                    <p>{`Module ${i}`}</p>
                  </div>
                );
              })}
            {/* modules with progress */}
          </div>
        </div>
        <div
          onClick={() => navigate("statistiques")}
          className="self-end w-10 stroke-primary"
        >
          <RightArrowIcon />
        </div>
      </div>
    </Wrapper>
  );
};

export default ProgressStats;
