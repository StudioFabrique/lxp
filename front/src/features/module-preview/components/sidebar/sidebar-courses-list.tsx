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
import RoleRankGuard from "../../../../components/guards/RoleRankGuard";
import FadeWrapper from "../../../../../src/components/wrappers/FadeWrapper";
import type { UpdateCourseFormValues } from "./course-form.types";
import type { LessonFormValues } from "./lesson-form.types";
import { cn } from "../../../../utils/cn";
import { useOnboarding } from "../../../onboarding/OnboardingContext";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  calendarMode?: boolean;
  calendarSelectedCourseId?: number;
  calendarAdding?: boolean;
  calendarOrphanIds?: number[];
  onAddCalendarCourse?: (courseId: number) => void;
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
  lessonIdToScroll?: number;
  onLessonScrolled?: (lessonId: number) => void;
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
  disableCourseCreationFloating?: boolean;
  children: React.ReactNode[];
};

const SidebarCoursesList = ({
  courses,
  calendarMode = false,
  calendarSelectedCourseId,
  calendarAdding = false,
  calendarOrphanIds = [],
  onAddCalendarCourse,
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
  lessonIdToScroll,
  onLessonScrolled,
  onDeleteLesson,
  onCreateLesson,
  onLessonCreated,
  onUpdateLesson,
  disableCourseCreationFloating = false,
  children,
}: PropsWithChildren<SidebarCoursesListProps>) => {
  const { status: onboardingStatus, step: onboardingStep } = useOnboarding();
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(false);
  const selectedCourseId = courses.find((course) =>
    course.lessons.some((lesson) => lesson.id === selectedLesson?.id),
  )?.id;
  const courseIdLockedOpen =
    !calendarMode && onboardingStatus === "in_progress" &&
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
      <RoleRankGuard ranks={[3]}>
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
      </RoleRankGuard>
      {calendarMode && calendarAdding && (
        <p role="status" className="mb-5 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm font-medium text-base-content">
          Cliquez sur un cours disponible ci-dessous pour l’ajouter au calendrier.
          Les cours grisés sont déjà planifiés.
        </p>
      )}
      {/* Liste des cours */}
      <div className="flex flex-col items-center gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className={cn("relative w-full rounded-lg transition-opacity", {
              "ring-2 ring-primary ring-offset-4 ring-offset-base-200": calendarMode && calendarSelectedCourseId === course.id,
              "opacity-30": calendarMode && calendarAdding && !calendarOrphanIds.includes(course.id),
            })}>
            <div inert={calendarMode && calendarAdding} className={calendarMode && calendarAdding ? "pointer-events-none" : undefined}>
            <CourseItem
              calendarMode={calendarMode}
              course={course}
              selectedLesson={selectedLesson}
              onSelectLesson={onSelectLesson}
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              onPublishCourse={onPublishCourse}
              onUpdateCourse={onUpdateCourse}
              openEditOnMount={!calendarMode && course.id === editCourseId}
              editLessonId={calendarMode ? undefined : editLessonId}
              isOpen={course.id === openCourseId}
              lessonIdToScroll={lessonIdToScroll}
              onLessonScrolled={onLessonScrolled}
              onToggle={() => {
                if (calendarMode && calendarAdding) return;
                setOpenCourseId((currentId) => {
                  if (
                    currentId === course.id &&
                    courseIdLockedOpen === course.id
                  ) {
                    return currentId;
                  }

                  return currentId === course.id ? undefined : course.id;
                });
              }}
              onOpen={() => setOpenCourseId(course.id)}
              onDeleteLesson={onDeleteLesson}
              onCreateLesson={onCreateLesson}
              onLessonCreated={onLessonCreated}
              onUpdateLesson={onUpdateLesson}
              children={children[1]}
            />
            </div>
            {calendarMode && calendarAdding && calendarOrphanIds.includes(course.id) && (
              <button type="button" className="absolute inset-0 z-20 cursor-pointer rounded-lg ring-2 ring-primary/30 hover:ring-primary focus-visible:ring-primary"
                aria-label={`Ajouter ${course.title} au calendrier`} onClick={() => onAddCalendarCourse?.(course.id)} />
            )}
            </div>
          ))
        ) : (
          <RoleRankGuard ranks={[3]}>
            <p className="text-lg font-bold text-primary">
              Aucun cours disponible
            </p>
          </RoleRankGuard>
        )}
      </div>
      <PermissionGuard action="update" object="course">
        <div
          inert={calendarMode}
          className={cn(
            "z-30 w-full rounded-xl transition-all duration-300",
            {
              "sticky bottom-1": !disableCourseCreationFloating,
              "bg-transparent shadow-none":
                disableCourseCreationFloating || isAtNaturalPosition,
              "border border-base-300 px-2 py-2 backdrop-blur":
                !disableCourseCreationFloating && !isAtNaturalPosition,
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
