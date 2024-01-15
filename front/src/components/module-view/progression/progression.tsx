import Course from "../../../utils/interfaces/course";
import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseItem from "./course-item";

type ProgressionProps = { courses: Course[] };

const Progression = ({ courses }: ProgressionProps) => {
  return (
    <Wrapper>
      <div className="flex">
        <h2>Progression du module</h2>
        <progress className="progress" />
      </div>
      <div className="flex flex-col items-center">
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
