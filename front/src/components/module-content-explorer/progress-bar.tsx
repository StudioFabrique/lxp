import { PlaneLandingIcon, PlaneTakeoffIcon } from "lucide-react";
import Course from "../../utils/interfaces/course";

type ProgressBarProps = {
  courses: Course[];
};

const ProgressBar = ({ courses }: ProgressBarProps) => {
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
              <span
                key={lesson.id}
                className={`h-[70%] w-full rounded-lg ${
                  lesson.lessonsRead?.some((read) => Boolean(read.finishedAt))
                    ? "bg-primary"
                    : "bg-primary/20"
                }`}
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
