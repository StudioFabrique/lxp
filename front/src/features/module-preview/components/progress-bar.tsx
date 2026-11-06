import { PlaneLandingIcon, PlaneTakeoffIcon } from "lucide-react";
import Course from "../../../../src/utils/interfaces/course";
import { cn } from "../../../utils/cn";
import { formatNumber } from "../../../utils/helpers/format-number";

type ProgressBarProps = {
  courses: Course[];
  selectedLessonId?: number;
  onSelectLesson: (lessonId: number) => void;
};

const ProgressBar = ({ courses, selectedLessonId, onSelectLesson }: ProgressBarProps) => {
  if (!(courses.length > 0)) return null;

  const lessons = courses.flatMap((course) => course.lessons);
  const finishedCount = lessons.filter((lesson) =>
    lesson.lessonsRead?.some((read) => Boolean(read.finishedAt)),
  ).length;

  return (
    <div
      role="group"
      aria-label="Progression dans le module : un segment par leçon"
      className="flex items-center gap-4 h-full w-full py-2"
    >
      <span title="Début du module">
        <PlaneTakeoffIcon className="w-6 h-6 stroke-1" aria-hidden="true" />
      </span>
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-secondary/20 h-[80%] w-full rounded-lg"
        >
          <div className="flex gap-x-2 h-full items-center px-1 py-[0.5px] rounded-lg">
            {course.lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                title={`Leçon « ${lesson.title} » du cours « ${course.title} »`}
                aria-label={`Ouvrir la leçon : ${lesson.title} (${course.title})`}
                aria-current={lesson.id === selectedLessonId ? "step" : undefined}
                disabled={lesson.id === undefined}
                onClick={() => {
                  if (lesson.id !== undefined) onSelectLesson(lesson.id);
                }}
                className={cn("h-[70%] w-full rounded-lg cursor-pointer transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default", lesson.lessonsRead?.some((read) => Boolean(read.finishedAt))
                    ? "bg-primary"
                    : "bg-primary/20")}
              />
            ))}
          </div>
        </div>
      ))}
      <span title="Fin du module">
        <PlaneLandingIcon className="w-6 h-6 stroke-1" aria-hidden="true" />
      </span>
      {/* Légende : chaque segment est une leçon, plein une fois terminée. */}
      <span className="shrink-0 text-xs font-semibold max-xl:hidden">
        {formatNumber(finishedCount)}/{formatNumber(lessons.length)} leçons terminées
      </span>
    </div>
  );
};

export default ProgressBar;
