import {
  type CSSProperties,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import type Course from "../../../../../src/utils/interfaces/course";
import CourseItem from "./course-item";
import type Lesson from "../../../../../src/utils/interfaces/lesson";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import FadeWrapper from "../../../../../src/components/wrappers/FadeWrapper";
import type { CourseFormValues } from "./course-form.types";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  moduleId?: number;
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onPublishCourse: (courseId: number) => Promise<void>;
  onUpdateCourse: (
    courseId: number,
    values: CourseFormValues,
  ) => Promise<boolean>;
  onDeleteLesson: (lessonId: number) => Promise<void>;
  onCreateLesson: (courseId: number, data: { title: string; description: string; modalite: string; tagId: number }) => Promise<boolean>;
  children: React.ReactNode[];
};

const SidebarCoursesList = ({
  courses,
  moduleId,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onPublishCourse,
  onUpdateCourse,
  onDeleteLesson,
  onCreateLesson,
  children,
}: PropsWithChildren<SidebarCoursesListProps>) => {
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(false);
  const actionsSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtNaturalPosition(entry.isIntersecting),
      {
        root: scrollContainer,
        threshold: 0.1,
      },
    );

    const sentinel = actionsSentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
    <div className="border border-base-300 bg-base-200 rounded-lg p-5 select-none shadow-sm">
      {/* En-tête avec le titre et l'indicateur de progression */}
      <PermissionGuard action="component" object="progression">
        {courses.length > 0 ? (
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold w-28 text-primary">Progression</h2>

            <FadeWrapper>
              <span
                className="radial-progress self-end text-primary"
                style={radialStyle(
                  !Number.isNaN(moduleProgress) ? moduleProgress : 0,
                )}
              >
                <p className="text-base-content font-bold text-sm">
                  {!Number.isNaN(moduleProgress)
                    ? Math.round(moduleProgress * 100)
                    : 0}
                  %
                </p>
                <span
                  className="absolute radial-progress text-primary/20"
                  style={radialStyle(1)}
                />
              </span>
            </FadeWrapper>
          </div>
        ) : null}
      </PermissionGuard>
      {/* Liste des cours */}
      <div className="flex flex-col items-center gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              moduleId={moduleId}
              selectedLesson={selectedLesson}
              onSelectLesson={onSelectLesson}
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              onPublishCourse={onPublishCourse}
              onUpdateCourse={onUpdateCourse}
              onDeleteLesson={onDeleteLesson}
              onCreateLesson={onCreateLesson}
              children={children[1]}
            />
          ))
        ) : (
          <PermissionGuard action="component" object="progression">
            <p className="text-lg font-bold text-primary">
              Aucun cours disponible
            </p>
          </PermissionGuard>
        )}
      </div>
      <div
        className={`sticky bottom-4 z-30 mt-5 w-full rounded-xl transition-all duration-300 ${
          isAtNaturalPosition
            ? "bg-transparent shadow-none"
            : "border border-base-300 bg-base-200/95 p-2 shadow-xl backdrop-blur"
        }`}
      >
        {children[0]}
      </div>
      <div ref={actionsSentinelRef} className="h-px w-full" />
    </div>
  );
};

export default SidebarCoursesList;
