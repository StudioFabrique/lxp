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
import type { CourseContentValues, UpdateCourseFormValues } from "./course-form.types";
import type Tag from "../../../../utils/interfaces/tag";
import type { LessonFormValues } from "./lesson-form.types";
import { cn } from "../../../../utils/cn";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import SortableCourseItem from "./sortable-course-item";

// Type definition pour les props du composant
type SidebarCoursesListProps = {
  courses: Course[];
  calendarMode?: boolean;
  calendarSelectedCourseId?: number;
  calendarAdding?: boolean;
  calendarOrphanIds?: number[];
  onAddCalendarCourse?: (courseId: number) => void;
  onSelectCalendarCourse?: (courseId: number) => void;
  /** Pourcentage fourni par l'API, jamais recalculé ici. */
  moduleProgress: number;
  selectedLesson: Lesson | undefined;
  selectedAssignmentCourseId?: number;
  onSelectAssignment?: (courseId: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onPublishCourse: (courseId: number) => Promise<void>;
  onUpdateCourse: (
    courseId: number,
    values: UpdateCourseFormValues,
  ) => Promise<boolean>;
  onAddCourseContent?: (
    courseId: number,
    values: CourseContentValues,
  ) => Promise<boolean>;
  parcoursTags?: Tag[];
  onCourseReorder?: (args: BaseEventPayload<ElementDragType>) => void;
  isReorderingCourses?: boolean;
  isReorderingActivities?: boolean;
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
  onLessonReorder?: (courseId: number, args: BaseEventPayload<ElementDragType>) => void;
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
  onSelectCalendarCourse,
  moduleProgress,
  selectedLesson,
  selectedAssignmentCourseId,
  onSelectAssignment,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onPublishCourse,
  onUpdateCourse,
  onAddCourseContent,
  parcoursTags,
  onCourseReorder,
  isReorderingCourses = false,
  isReorderingActivities = false,
  editCourseId,
  editLessonId,
  openedCourseId,
  lessonIdToScroll,
  onLessonScrolled,
  onDeleteLesson,
  onCreateLesson,
  onLessonCreated,
  onUpdateLesson,
  onLessonReorder,
  disableCourseCreationFloating = false,
  children,
}: PropsWithChildren<SidebarCoursesListProps>) => {
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(false);
  const [openCourseId, setOpenCourseId] = useState<number | undefined>(() => {
    if (calendarMode) return undefined;
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
  const [reorderingLessonCourseId, setReorderingLessonCourseId] = useState<number | undefined>();
  const actionsSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReorderingCourses || !onCourseReorder) return;

    return monitorForElements({
      canMonitor: ({ source }) => source.data.type === "course",
      onDrop: onCourseReorder,
    });
  }, [isReorderingCourses, onCourseReorder]);

  useEffect(() => {
    if (calendarMode) {
      return;
    }
    const selectedCourse = courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === selectedLesson?.id),
    ) ?? courses.find((course) => course.id === selectedAssignmentCourseId);
    const editedCourse = courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === editLessonId),
    );
    const nextOpenCourseId =
      selectedCourse?.id ??
      editedCourse?.id ??
      openedCourseId;
    if (!nextOpenCourseId) return;

    // L'ouverture automatique doit aussi refermer le cours précédemment ouvert.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenCourseId(nextOpenCourseId);
  }, [
    calendarMode,
    courses,
    editLessonId,
    openedCourseId,
    selectedAssignmentCourseId,
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
    <div data-chatbot-target="module-sidebar" className="border border-base-300 bg-base-200 rounded-lg p-2 sm:p-3 lg:p-5 select-none shadow-sm sticky top-0 md:max-h-[calc(100dvh-1rem)] md:overflow-y-auto">
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
            <SortableCourseItem
              key={course.id}
              courseId={course.id}
              courseTitle={course.title}
              enabled={isReorderingCourses}
            >
            <div className={cn("relative w-full rounded-lg transition-opacity", {
              "ring-2 ring-primary ring-offset-4 ring-offset-base-200": calendarMode && calendarSelectedCourseId === course.id,
              "opacity-30": calendarMode && calendarAdding && !calendarOrphanIds.includes(course.id),
              "opacity-50": reorderingLessonCourseId !== undefined && reorderingLessonCourseId !== course.id,
            })}>
            <div
              inert={(calendarMode && calendarAdding) || isReorderingCourses || (reorderingLessonCourseId !== undefined && reorderingLessonCourseId !== course.id)}
              className={cn((calendarMode && calendarAdding) || isReorderingCourses || (reorderingLessonCourseId !== undefined && reorderingLessonCourseId !== course.id) ? "pointer-events-none" : undefined)}
            >
            <CourseItem
              calendarMode={calendarMode}
              disabled={isReorderingActivities}
              course={course}
              selectedLesson={selectedLesson}
              assignmentSelected={selectedAssignmentCourseId === course.id}
              onSelectAssignment={() => onSelectAssignment?.(course.id)}
              onSelectLesson={onSelectLesson}
              onDeleteCourse={onDeleteCourse}
              onEnableCourse={onEnableCourse}
              onPublishCourse={onPublishCourse}
              onUpdateCourse={onUpdateCourse}
              onAddCourseContent={onAddCourseContent}
              parcoursTags={parcoursTags}
              openEditOnMount={!calendarMode && course.id === editCourseId}
              editLessonId={calendarMode ? undefined : editLessonId}
              isOpen={!calendarAdding && !isReorderingCourses && course.id === openCourseId}
              isReorderingLessons={reorderingLessonCourseId === course.id}
              onToggleLessonReordering={() => setReorderingLessonCourseId((current) => current === course.id ? undefined : course.id)}
              hideCreateLessonButton={isReorderingCourses}
              lessonIdToScroll={lessonIdToScroll}
              onLessonScrolled={onLessonScrolled}
              onToggle={() => {
                if (calendarMode && calendarAdding) return;
                if (reorderingLessonCourseId === course.id) return;
                if (calendarMode) onSelectCalendarCourse?.(course.id);
                setOpenCourseId((currentId) =>
                  currentId === course.id ? undefined : course.id,
                );
              }}
              onOpen={() => setOpenCourseId(course.id)}
              onDeleteLesson={onDeleteLesson}
              onCreateLesson={onCreateLesson}
              onLessonCreated={onLessonCreated}
              onUpdateLesson={onUpdateLesson}
              onLessonReorder={onLessonReorder}
              children={children[1]}
            />
            </div>
            {calendarMode && calendarAdding && calendarOrphanIds.includes(course.id) && (
              <button type="button" className="absolute inset-0 z-20 cursor-pointer rounded-lg ring-2 ring-primary/30 hover:ring-primary focus-visible:ring-primary"
                aria-label={`Ajouter ${course.title} au calendrier`} onClick={() => onAddCalendarCourse?.(course.id)} />
            )}
            </div>
            </SortableCourseItem>
          ))
        ) : (
          <RoleRankGuard ranks={[3]}>
            <p className="text-lg font-bold text-primary">
              Aucun cours disponible
            </p>
          </RoleRankGuard>
        )}
      </div>
      {!calendarMode && !isReorderingCourses && reorderingLessonCourseId === undefined && (
        <PermissionGuard action="update" object="course">
          <div
            className={cn(
              // Même géométrie collée ou non (pied de carte pleine largeur : il annule le padding de la carte) :
              // seuls le fond, le filet et l'ombre changent, en fondu, pour que la barre ne saute pas en changeant d'état.
              "z-30 -mb-3 -mx-2 w-[calc(100%+1rem)] border-t border-transparent px-2 py-3 transition-[background-color,border-color,box-shadow] duration-300 sm:-mx-3 sm:w-[calc(100%+1.5rem)] sm:px-3 lg:-mx-5 lg:w-[calc(100%+2.5rem)] lg:px-5",
              {
                // Le `bottom` négatif compense le padding de la carte, que `sticky` respecte : la barre se pose tout en bas.
                "sticky -bottom-2 sm:-bottom-3 lg:-bottom-5": !disableCourseCreationFloating,
                "bg-transparent shadow-none":
                  disableCourseCreationFloating || isAtNaturalPosition,
                // Collée : fond quasi opaque et ombre vers le haut, pour ne pas laisser voir la liste qui passe dessous.
                "border-base-300 bg-base-200/95 shadow-[0_-12px_16px_-12px_rgb(0_0_0/0.4)] backdrop-blur-md":
                  !disableCourseCreationFloating && !isAtNaturalPosition,
                "mt-2": courses.length > 0,
              },
            )}
          >
            {children[0]}
          </div>
        </PermissionGuard>
      )}
      <div ref={actionsSentinelRef} className="h-px w-full" />
    </div>
  );
};

export default SidebarCoursesList;
