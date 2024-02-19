/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlaneLandingIcon, PlaneTakeoffIcon } from "lucide-react";
import Course from "../../utils/interfaces/course";

type ProgressBarProps = {
  courses: Course[];
};

const ProgressBar = ({ courses }: ProgressBarProps) => {
  return (
    <div className="flex max-xl:hidden items-center gap-4 bg-secondary/20 rounded-xl p-4">
      <span>
        <PlaneTakeoffIcon className="w-10 h-10 stroke-1" />
      </span>
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-secondary/10 h-[80%] w-full rounded-lg"
        >
          <div className="flex gap-x-2 h-full items-center px-5">
            {course.lessons.map((lesson) => (
              <span
                key={lesson.id}
                className={`h-[70%] w-[15px]  ${
                  lesson.lessonsRead && lesson.lessonsRead?.length > 0
                    ? "bg-primary"
                    : "bg-primary/20"
                }`}
              ></span>
            ))}
          </div>
        </div>
      ))}
      <span>
        <PlaneLandingIcon className="w-10 h-10 stroke-1" />
      </span>
    </div>
  );
};

export default ProgressBar;
