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
        <div className="grid grid-cols-3 gap-2">
          {lastLessons.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col p-5 bg-secondary rounded-lg gap-10`}
            >
              <span>
                <p className="font-semibold text-primary">{`Module: ${item.lesson.course.module.title}`}</p>
                <p>{`Cours: ${item.lesson.course.title}`}</p>
              </span>
              <div>
                <div>
                  {item.lesson.course.bonusSkills.map(
                    (skill) =>
                      skill.badge && (
                        <img
                          key={skill.id}
                          className="w-full h-full p-2"
                          src={skill.badge}
                          alt="illustration badge"
                        />
                      )
                  )}
                </div>
                <span className="flex justify-between">
                  <span className="flex gap-x-4 capitalize">
                    <p>1/10</p>
                    <p>{item.lesson.title}</p>
                  </span>
                  <Link
                    to={`/${currentRoute}/parcours/module/${item.lesson.course.module.id}`}
                    state={{ lessonId: item.lesson.id }}
                  >
                    <ArrowUpRightIcon className="text-primary" />
                  </Link>
                </span>
                <progress className="progress progress-primary" value={0.5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return undefined;
};

export default ResumeActivities;
