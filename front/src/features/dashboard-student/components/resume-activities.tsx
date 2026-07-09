import { ArrowUpRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import LessonRead from "../../../utils/interfaces/lesson-read";

type ResumeActivitiesProps = {
  lastLessons: LessonRead[];
};

const ResumeActivities = ({ lastLessons }: ResumeActivitiesProps) => {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

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
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                className="group relative overflow-hidden rounded-xl hover:scale-101 transition-transform duration-200"
              >
                <motion.span
                  className="absolute w-36 h-14 bg-primary/50 invisible group-hover:visible rounded-full blur-xl opacity-70"
                  initial={{ scale: 0 }}
                  style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  animate={{
                    scale: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                />
                <Link
                  key={item.id}
                  to={`/${currentRoute[0]}/parcours/module/${item.lesson.course.module.id}`}
                  state={{ lessonId: item.lesson.id }}
                  className="flex flex-col justify-between p-5 bg-secondary/10 backdrop-blur-2xl gap-4 hover:bg-secondary/20"
                >
                  <div className="w-full text-left">
                    <p className="font-bold truncate overflow-clip text-primary">{`Module: ${item.lesson.course.module.title}`}</p>
                    <p className="truncate font-medium overflow-clip text-sm">{`Cours ${(item.lesson.course.order ?? 0) + 1}: ${item.lesson.course.title}`}</p>

                    <div className="flex gap-1 overflow-x-hidden">
                      {item.lesson.course.bonusSkills
                        .filter((skill) => skill.badge)
                        .map(
                          (skill, i) =>
                            i < 5 && (
                              <img
                                key={skill.id}
                                className="w-16 h-16 p-2"
                                src={skill.badge}
                                alt="illustration badge"
                              />
                            ),
                        )}
                    </div>
                  </div>
                  <div>
                    <span className="flex justify-between w-full">
                      <span className="flex gap-x-4 capitalize items-center text-sm min-w-0">
                        <p>{`${(item.lesson.order ?? 0) + 1}/${
                          item.lesson.course.lessons.length
                        }`}</p>
                        <p className="truncate overflow-clip min-w-0">
                          {item.lesson.title}
                        </p>
                      </span>

                      <ArrowUpRightIcon />
                    </span>
                    <progress
                      className="progress [&::-moz-progress-bar]:bg-gradient-to-r [&::-moz-progress-bar]:from-primary/90 [&::-moz-progress-bar]:to-info/60 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-primary/90 [&::-webkit-progress-value]:to-info/50"
                      value={progressCalculation}
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );

  return undefined;
};

export default ResumeActivities;
