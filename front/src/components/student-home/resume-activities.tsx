import { ArrowUpRightIcon } from "lucide-react";
import LessonRead from "../../utils/interfaces/lesson-read";
import { Link, useLocation } from "react-router-dom";

type ResumeActivitiesProps = {
  lastLessons: LessonRead[];
};

const ResumeActivities = ({ lastLessons }: ResumeActivitiesProps) => {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  if (lastLessons.length > 0)
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">
          Reprendre mes activités là où je m'étais arrêté
        </h2>
        <div className="grid lg:grid-cols-3 gap-2">
          {lastLessons.map((item) => {
            const progressCalculation =
              item.lesson.course.lessons.reduce((sum, lesson) => {
                return (
                  sum +
                  (lesson.lessonsRead &&
                  lesson.lessonsRead?.length > 0 &&
                  lesson.lessonsRead[0].finishedAt
                    ? 1
                    : 0)
                );
              }, 0) / item.lesson.course.lessons.length;

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between p-5 bg-secondary/70 text-secondary-content rounded-lg gap-4`}
              >
                <div>
                  <p className="font-semibold">{`Module: ${item.lesson.course.module.title}`}</p>
                  <p>{`Cours: ${item.lesson.course.title}`}</p>
                  <div className="flex gap-1 overflow-x-hidden">
                    {item.lesson.course.bonusSkills
                      .filter((skill) => skill.badge)
                      .map(
                        (skill, i) =>
                          i < 5 && (
                            <img
                              key={skill.id}
                              className="w-12 h-12 p-2"
                              src={skill.badge}
                              alt="illustration badge"
                            />
                          )
                      )}
                  </div>
                </div>
                <div>
                  <span className="flex justify-between">
                    <span className="flex gap-x-4 capitalize">
                      <p>{`${(item.lesson.order ?? 0) + 1}/${
                        item.lesson.course.lessons.length
                      }`}</p>
                      <p className="truncate overflow-clip w-[60vw] lg:w-[14vw]">
                        {item.lesson.title}
                      </p>
                    </span>
                    <Link
                      to={`/${currentRoute}/parcours/module/${item.lesson.course.module.id}`}
                      state={{ lessonId: item.lesson.id }}
                    >
                      <ArrowUpRightIcon />
                    </Link>
                  </span>
                  <progress
                    className="progress progress-primary bg-secondary/80"
                    value={progressCalculation}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  return undefined;
};

export default ResumeActivities;
