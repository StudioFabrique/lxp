import { CSSProperties, Dispatch, SetStateAction } from "react";
import Course from "../../../utils/interfaces/course";
import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseItem from "./course-item";
import Lesson from "../../../utils/interfaces/lesson";

type ProgressionProps = {
  courses: Course[];
  selectedLesson: Lesson | undefined;
  setSelectedLesson: Dispatch<SetStateAction<Lesson | undefined>>;
};

const Progression = ({
  courses,
  selectedLesson,
  setSelectedLesson,
}: ProgressionProps) => {
  const moduleProgress =
    courses.reduce(
      (sum, course) =>
        sum +
        course.lessons.reduce(
          (sum, lesson) => sum + (lesson.readBy?.length || 0),
          0
        ) /
          course.lessons.length,
      0
    ) / courses.length;

  console.log({ moduleProgress });

  const radialStyle = {
    "--value": moduleProgress * 100,
  } as CSSProperties;

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
          {moduleProgress * 100}%
        </div>
      </div>
      <div className="flex flex-col items-center gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseItem
              course={course}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
            />
          ))
        ) : (
          <p>Aucun cours</p>
        )}
      </div>
    </Wrapper>
  );
};

export default Progression;
