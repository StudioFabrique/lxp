import { CSSProperties } from "react";
import Course from "../../../utils/interfaces/course";
import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseItem from "./course-item";

type ProgressionProps = { courses: Course[] };

const radialStyle = {
  "--value": 25,
} as CSSProperties;

const Progression = ({ courses }: ProgressionProps) => {
  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold w-28 text-primary">
          Progression du module
        </h2>
        <div
          className="radial-progress bg-secondary text-primary"
          style={radialStyle}
        >
          25%
        </div>
      </div>
      <div className="flex flex-col items-center gap-5">
        {courses.length > 0 ? (
          courses.map((course) => <CourseItem course={course} />)
        ) : (
          <p>Aucun cours</p>
        )}
      </div>
    </Wrapper>
  );
};

export default Progression;
