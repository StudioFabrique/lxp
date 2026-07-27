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
import type { UpdateCourseFormValues } from "./course-form.types";
import type { LessonFormValues } from "./lesson-form.types";
import { cn } from "../../../../utils/cn";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onPublishCourse: (courseId: number) => Promise<void>;
  onUpdateCourse: (
    courseId: number,
    values: UpdateCourseFormValues,
  ) => Promise<boolean>;
  editCourseId?: number;
  editLessonId?: number;
  openedCourseId?: number;
  onDeleteLesson: (lessonId: number) => Promise<void>;
  onCreateLesson: (
    courseId: number,
    data: LessonFormValues,
  ) => Promise<number | false>;
  onLessonCreated?: (lessonId: number) => void;
  onUpdateLesson: (
    lessonId: number,
    values: LessonFormValues,
  ) => Promise<boolean>;
  children: React.ReactNode[];
};

const SidebarCoursesList = ({
  courses,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onPublishCourse,
  onUpdateCourse,
  editCourseId,
  editLessonId,
  openedCourseId,
  onDeleteLesson,
  onCreateLesson,
  onLessonCreated,
  onUpdateLesson,
  children,
}: PropsWithChildren<SidebarCoursesListProps>) => {
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(false);
  const [openCourseId, setOpenCourseId] = useState<number | undefined>(() => {
    const courseContainingSelectedLesson = courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === selectedLesson?.id),
    );
    const courseContainingEditedLesson = courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === editLessonId),
    );

    return (
      courseContainingSelectedLesson?.id ??
      courseContainingEditedLesson?.id ??
      openedCourseId
    );
  });
  const actionsSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedCourse = courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === selectedLesson?.id),
    );
    const editedCourse = courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === editLessonId),
    );
    const nextOpenCourseId =
      selectedCourse?.id ?? editedCourse?.id ?? openedCourseId;
    if (!nextOpenCourseId) return;

    // L'ouverture automatique doit aussi refermer le cours précédemment ouvert.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenCourseId(nextOpenCourseId);
  }, [courses, editLessonId, openedCourseId, selectedLesson]);

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
    <div className="border border-base-300 bg-base-200 rounded-lg p-5 select-none shadow-sm sticky top-0">
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
              selectedLesson={selectedLesson}
              onSelectLesson={onSelectLesson}
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              onPublishCourse={onPublishCourse}
              onUpdateCourse={onUpdateCourse}
              openEditOnMount={course.id === editCourseId}
              editLessonId={editLessonId}
              isOpen={course.id === openCourseId}
              onToggle={() =>
                setOpenCourseId((currentId) =>
                  currentId === course.id ? undefined : course.id,
                )
              }
              onOpen={() => setOpenCourseId(course.id)}
              onDeleteLesson={onDeleteLesson}
              onCreateLesson={onCreateLesson}
              onLessonCreated={onLessonCreated}
              onUpdateLesson={onUpdateLesson}
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
      <PermissionGuard action="update" object="course">
        <div
          className={cn(
            "sticky bottom-1 z-30 w-full rounded-xl transition-all duration-300",
            {
              "bg-transparent shadow-none": isAtNaturalPosition,
              "border border-base-300 px-2 py-2 backdrop-blur":
                !isAtNaturalPosition,
              "mt-5": courses.length > 0,
            },
          )}
        >
          {children[0]}
        </div>
      </PermissionGuard>
      <div ref={actionsSentinelRef} className="h-px w-full" />
    </div>
  );
};

export default SidebarCoursesList;
