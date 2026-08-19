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
import { useOnboarding } from "../../../onboarding/OnboardingContext";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  /** Pourcentage fourni par l'API, jamais recalculé ici. */
  moduleProgress: number;
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
  moduleProgress,
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
  const { status: onboardingStatus, step: onboardingStep } = useOnboarding();
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(false);
  const selectedCourseId = courses.find((course) =>
    course.lessons.some((lesson) => lesson.id === selectedLesson?.id),
  )?.id;
  const courseIdLockedOpen =
    onboardingStatus === "in_progress" &&
    onboardingStep.split(":", 1)[0] === "admin-activity-create"
      ? selectedCourseId
      : undefined;
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
      courseIdLockedOpen ??
      selectedCourse?.id ??
      editedCourse?.id ??
      openedCourseId;
    if (!nextOpenCourseId) return;

    // L'ouverture automatique doit aussi refermer le cours précédemment ouvert.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenCourseId(nextOpenCourseId);
  }, [
    courseIdLockedOpen,
    courses,
    editLessonId,
    openedCourseId,
    selectedLesson,
  ]);

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

  // Style du cercle de progression, en pourcentage.
  const radialStyle = (percentage: number) => {
    return {
      "--value": percentage,
    } as CSSProperties;
  };

  return (
    <div className="border border-base-300 bg-base-200 rounded-lg p-2 sm:p-3 lg:p-5 select-none shadow-sm sticky top-0">
      {/* En-tête avec le titre et l'indicateur de progression */}
      <PermissionGuard action="component" object="progression">
        {courses.length > 0 ? (
          <div className="flex flex-col items-center gap-2 mb-3 sm:flex-row sm:justify-between sm:mb-4 lg:mb-5">
            <h2 className="hidden text-xl font-bold w-28 text-primary sm:block">
              Progression
            </h2>

            <FadeWrapper>
              <span
                className="radial-progress self-end text-primary"
                style={radialStyle(moduleProgress)}
              >
                <p className="text-base-content font-bold text-sm">
                  {moduleProgress}%
                </p>
                <span
                  className="absolute radial-progress text-primary/20"
                  style={radialStyle(100)}
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
                setOpenCourseId((currentId) => {
                  if (
                    currentId === course.id &&
                    courseIdLockedOpen === course.id
                  ) {
                    return currentId;
                  }

                  return currentId === course.id ? undefined : course.id;
                })
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
