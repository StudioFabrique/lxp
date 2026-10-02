import { PlaneLandingIcon, PlaneTakeoffIcon } from "lucide-react";
import Course from "../../../../src/utils/interfaces/course";
import { cn } from "../../../utils/cn";

type ProgressBarProps = {
  courses: Course[];
  selectedLessonId?: number;
  onSelectLesson: (lessonId: number) => void;
};

const ProgressBar = ({ courses, selectedLessonId, onSelectLesson }: ProgressBarProps) => {
  if (!(courses.length > 0)) return null;

  return (
    <div className="flex items-center gap-4 h-full w-full py-2">
      <span>
        <PlaneTakeoffIcon className="w-6 h-6 stroke-1" />
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
      <span>
        <PlaneLandingIcon className="w-6 h-6 stroke-1" />
      </span>
    </div>
  );
};

export default ProgressBar;
