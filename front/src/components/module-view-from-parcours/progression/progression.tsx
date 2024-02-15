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
  const coursesWithLessons = courses.filter(
    (course) => course.lessons.length > 0
  );
  const moduleProgress =
    coursesWithLessons.reduce(
      (sum, course) =>
        sum +
        course.lessons.reduce(
          (sum, lesson) => sum + (lesson?.lessonsRead?.length || 0),
          0
        ) /
          course.lessons.length,
      0
    ) / coursesWithLessons.length;

  const radialStyle = (value: number) => {
    return {
      "--value": value * 100,
    } as CSSProperties;
  };

  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold w-28 text-primary">
          Progression du module
        </h2>
        {courses.length > 0 && (
          <span
            className="radial-progress text-secondary"
            style={radialStyle(moduleProgress)}
          >
            <p>{Math.round(moduleProgress * 100)}%</p>
            <span
              className="absolute radial-progress text-primary/40"
              style={radialStyle(1)}
            />
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseItem
              key={course.id}
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
