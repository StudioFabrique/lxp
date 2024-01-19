/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bus } from "lucide-react";
import Course from "../../utils/interfaces/course";

type ProgressBarProps = {
  courses: Course[];
};

const ProgressBar = ({ courses }: ProgressBarProps) => {
  return (
    <div className="flex items-center gap-4 bg-secondary/20 rounded-xl p-2">
      <Bus className="w-20 h-10 stroke-1" />
      {courses.map((course) => (
        <div className="bg-secondary/10 h-[80%] w-full rounded-lg">
          <div className="flex gap-x-2 h-full items-center px-5">
            {course.lessons.map(() => (
              <span className="h-[70%] w-[15px] bg-primary/20"></span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
