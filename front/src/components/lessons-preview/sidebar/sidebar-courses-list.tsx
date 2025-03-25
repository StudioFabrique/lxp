import { CSSProperties, PropsWithChildren } from "react";
import Course from "../../../utils/interfaces/course";
import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseItem from "./course-item";
import Lesson from "../../../utils/interfaces/lesson";
import Can from "../../UI/can/can.component";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
};

const SidebarCoursesList = ({
  courses,
  selectedLesson,
  setSelectedLesson,
  children,
}: PropsWithChildren<SidebarCoursesListProps>) => {
  // Filtre les cours qui ont des leçons
  const coursesWithLessons = courses.filter(
    (course) => course.lessons.length > 0,
  );

  // Calcule le pourcentage global de progression du module
  const moduleProgress =
    coursesWithLessons.reduce(
      (sum, course) =>
        sum +
        Math.min(
          course.lessons.reduce(
            (sum, lesson) =>
              sum +
              (lesson?.lessonsRead?.filter((lesson) => lesson.finishedAt)
                .length || 0),
            0,
          ) / course.lessons.length,
          1,
        ),
      0,
    ) / coursesWithLessons.length;

  // Fonction utilitaire pour générer le style du cercle de progression
  const radialStyle = (value: number) => {
    return {
      "--value": value * 100,
    } as CSSProperties;
  };

  return (
    <Wrapper>
      {/* En-tête avec le titre et l'indicateur de progression */}
      <Can action="component" object="progression">
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
      </Can>
      {/* Liste des cours */}
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
          <Can action="component" object="progression">
            <p>Aucun cours</p>
          </Can>
        )}
        {children}
      </div>
    </Wrapper>
  );
};

export default SidebarCoursesList;
