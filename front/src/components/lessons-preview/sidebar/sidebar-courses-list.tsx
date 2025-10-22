import type { CSSProperties, PropsWithChildren } from "react";
import type Course from "../../../utils/interfaces/course";
import CourseItem from "./course-item";
import type Lesson from "../../../utils/interfaces/lesson";
import Can from "../../UI/can/can.component";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  parcoursId: number;
  moduleId: number;
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onDeleteLesson: (lessonId: number) => Promise<void>;
  children: React.ReactNode[];
};

const SidebarCoursesList = ({
  courses,
  parcoursId,
  moduleId,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onDeleteLesson,
  children,
}: PropsWithChildren<SidebarCoursesListProps>) => {
  // Filtre les cours qui ont des leçons
  const coursesWithLessons = courses.filter(
    (course) => course.lessons.length > 0
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
            0
          ) / course.lessons.length,
          1
        ),
      0
    ) / coursesWithLessons.length;

  // Fonction utilitaire pour générer le style du cercle de progression
  const radialStyle = (value: number) => {
    return {
      "--value": value * 100,
    } as CSSProperties;
  };

  return (
    <div className="border-1 rounded-lg p-5 border-secondary/20">
      {/* En-tête avec le titre et l'indicateur de progression */}
      <Can action="component" object="progression">
        <div className="flex justify-between">
          {courses.length > 0 ? (
            <>
              <h2 className="text-xl font-bold w-28 text-primary">
                Progression du module
              </h2>

              <FadeWrapper>
                <span
                  className="radial-progress text-secondary self-end"
                  style={radialStyle(
                    !Number.isNaN(moduleProgress) ? moduleProgress : 0
                  )}
                >
                  <p>
                    {!Number.isNaN(moduleProgress)
                      ? Math.round(moduleProgress * 100)
                      : 0}
                    %
                  </p>
                  <span
                    className="absolute radial-progress text-primary/40"
                    style={radialStyle(1)}
                  />
                </span>
              </FadeWrapper>
            </>
          ) : null}
        </div>
      </Can>
      {/* Liste des cours */}
      <div className="flex flex-col items-center gap-5 mt-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              parcoursId={parcoursId}
              moduleId={moduleId}
              selectedLesson={selectedLesson}
              onSelectLesson={onSelectLesson}
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              onDeleteLesson={onDeleteLesson}
              children={children[1]}
            />
          ))
        ) : (
          <Can action="component" object="progression">
            <p className="text-lg font-bold text-primary">
              Aucun cours disponible
            </p>
          </Can>
        )}
        {children[0]}
      </div>
    </div>
  );
};

export default SidebarCoursesList;
