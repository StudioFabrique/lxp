/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bus } from "lucide-react";
import Course from "../../utils/interfaces/course";

type ProgressBarProps = {
  courses: Course[];
};

const ProgressBar = ({ courses }: ProgressBarProps) => {
  return (
    <div className="flex items-center gap-4 bg-secondary/20 rounded-xl p-3">
      <Bus className="w-12 h-12 stroke-1" />
      {courses.map((course) => (
        <div className="bg-secondary/10 p-2 rounded-lg px-3">
          <div className="flex gap-2">
            {course.lessons.map((_lesson) => (
              <span className="h-[3vh] w-[2vh] bg-primary/10"></span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
