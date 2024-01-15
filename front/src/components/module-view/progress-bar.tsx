import { Truck } from "lucide-react";
import Wrapper from "../UI/wrapper/wrapper.component";
import SubWrapper from "../UI/sub-wrapper/sub-wrapper.component";
import Course from "../../utils/interfaces/course";

type ProgressBarProps = {
  courses: Course[];
};

const ProgressBar = ({ courses }: ProgressBarProps) => {
  return (
    <Wrapper>
      <div className="flex items-center h-full gap-4">
        <Truck className="w-16 h-16" />
        {courses.map((course) => (
          <SubWrapper>
            <div className="flex gap-4 h-10">
              {course.lessons.map((lesson) => (
                <span className="h-10 w-8 bg-primary/10"></span>
              ))}
            </div>
          </SubWrapper>
        ))}
      </div>
    </Wrapper>
  );
};

export default ProgressBar;
