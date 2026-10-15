import { useEffect, useRef } from "react";
import { Check, ChevronDown, ChevronRight, ClipboardCheck } from "lucide-react";
import type Module from "../../../../utils/interfaces/module";
import type Lesson from "../../../../utils/interfaces/lesson";
import type { Activity } from "../../../../utils/interfaces/activity";
import { formatTitle } from "../../../../utils/helpers/text-helpers";
import activityIconType from "../../../../utils/helpers/activity-icon-type";
import { cn } from "../../../../utils/cn";

type MobileModuleNavigationProps = {
  module: Module;
  selectedLesson?: Lesson;
  selectedActivity?: Activity;
  selectedAssignmentCourseId?: number;
  lessonIdToScroll?: number;
  onSelectLesson: (lessonId: number) => void;
  onSelectActivity: (activity: Activity) => void;
  onSelectAssignment: (courseId?: number) => void;
  onLessonScrolled: (lessonId: number) => void;
  /** Appelé une fois une leçon, une activité ou un devoir choisi : la navigation a fait son office. */
  onNavigated?: () => void;
};

export default function MobileModuleNavigation({
  module,
  selectedLesson,
  selectedActivity,
  selectedAssignmentCourseId,
  lessonIdToScroll,
  onSelectLesson,
  onSelectActivity,
  onSelectAssignment,
  onLessonScrolled,
  onNavigated,
}: MobileModuleNavigationProps) {
  const selectedLessonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lessonIdToScroll || selectedLesson?.id !== lessonIdToScroll) return;
    if (window.matchMedia?.("(min-width: 768px)").matches !== false) return;

    const animationFrame = window.requestAnimationFrame(() => {
      if (!selectedLessonRef.current) return;
      selectedLessonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      onLessonScrolled(lessonIdToScroll);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [lessonIdToScroll, onLessonScrolled, selectedLesson?.id]);

  return (
    <nav
      className="flex flex-col gap-3 rounded-lg border border-base-300 bg-base-200 p-3 shadow-sm"
      aria-label="Navigation du module"
    >
      {module.courses.map((course, courseIndex) => {
        const isSelectedCourse =
          course.lessons.some((lesson) => lesson.id === selectedLesson?.id) ||
          course.id === selectedAssignmentCourseId;

        return (
          <div className="w-full" key={course.id}>
            <div
              className={cn("relative z-10 overflow-hidden rounded-lg", isSelectedCourse
                  ? "bg-secondary/60"
                  : "bg-secondary/50 hover:bg-secondary/75")}
            >
              <button
                type="button"
                title={`Cours ${courseIndex + 1} : ${formatTitle(course.title)}`}
                aria-label={`Cours ${courseIndex + 1} : ${formatTitle(course.title)}`}
                aria-expanded={isSelectedCourse}
                disabled={course.lessons.length === 0 && !course.assignment}
                onClick={() => {
                  const firstLessonId = course.lessons[0]?.id;
                  if (firstLessonId) onSelectLesson(firstLessonId);
                  else if (course.assignment) onSelectAssignment(course.id);
                }}
                className="flex w-full items-center gap-2 px-3 py-3 text-secondary-content/80"
              >
                {isSelectedCourse ? (
                  <ChevronDown className="size-5 shrink-0" />
                ) : (
                  <ChevronRight className="size-5 shrink-0" />
                )}
                <span className="truncate text-sm font-semibold">
                  Cours {courseIndex + 1}
                  {course.title && ` : ${formatTitle(course.title)}`}
                </span>
              </button>
              <progress
                className="progress progress-primary block h-1 w-full rounded-b-full bg-secondary"
                value={course.stats?.progress ?? 0}
                max={100}
              />
            </div>

            {isSelectedCourse && (
              <div className="-mt-2 flex flex-col gap-2 rounded-b-xl bg-secondary/20 px-2 pb-2 pt-4">
                {course.lessons.map((lesson, lessonIndex) => {
                  const isSelectedLesson = lesson.id === selectedLesson?.id;

                  return (
                    <div className="flex flex-col gap-1" key={lesson.id}>
                      <button
                        ref={isSelectedLesson ? selectedLessonRef : undefined}
                        type="button"
                        title={`Leçon ${lessonIndex + 1} : ${formatTitle(lesson.title)}`}
                        aria-label={`Leçon ${lessonIndex + 1} : ${formatTitle(lesson.title)}`}
                        aria-current={isSelectedLesson ? "step" : undefined}
                        onClick={() => {
                          if (!lesson.id) return;
                          onSelectLesson(lesson.id);
                          onNavigated?.();
                        }}
                        className={cn("h-10 w-full truncate rounded-lg px-3 text-left text-sm font-medium text-primary-content transition-colors", isSelectedLesson
                            ? "bg-primary"
                            : "bg-primary/50 hover:bg-primary/80")}
                      >
                        Leçon {lessonIndex + 1}
                        {lesson.title && ` : ${formatTitle(lesson.title)}`}
                      </button>

                      {isSelectedLesson && lesson.activities?.length ? (
                        <div className="flex flex-col gap-1 px-1 pt-1">
                          {lesson.activities.map((activity, activityIndex) => (
                            <button
                              type="button"
                              key={activity.id}
                              title={`Activité ${activityIndex + 1}${activity.title ? ` : ${formatTitle(activity.title)}` : ""}`}
                              aria-label={`Activité ${activityIndex + 1}${activity.title ? ` : ${formatTitle(activity.title)}` : ""}`}
                              aria-current={
                                activity.id === selectedActivity?.id
                                  ? "step"
                                  : undefined
                              }
                              onClick={() => {
                                onSelectActivity(activity);
                                onNavigated?.();
                              }}
                              className={cn("flex h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors", activity.id === selectedActivity?.id
                                  ? "bg-base-300 font-semibold text-base-content"
                                  : "hover:bg-base-300/70")}
                            >
                              <span className="shrink-0">
                                {activityIconType(activity.type, 4)}
                              </span>
                              <span className="truncate">
                                Activité {activityIndex + 1}
                                {activity.title && ` : ${formatTitle(activity.title)}`}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {course.assignment && (
                  <button
                    type="button"
                    aria-current={
                      selectedAssignmentCourseId === course.id
                        ? "step"
                        : undefined
                    }
                    onClick={() => {
                      onSelectAssignment(course.id);
                      onNavigated?.();
                    }}
                    className={cn("flex h-10 w-full items-center justify-between gap-2 rounded-lg px-3 text-left text-sm font-medium transition-colors", selectedAssignmentCourseId === course.id
                        ? "bg-warning/45 text-warning-content ring-1 ring-warning/30"
                        : "bg-warning/25 text-warning-content hover:bg-warning/40")}
                  >
                    <span className="flex min-w-0 items-center gap-1">
                      <ClipboardCheck className="size-4 shrink-0" />
                      <span className="truncate">Devoir</span>
                    </span>
                    {course.assignment.submissions.some(
                      (submission) => submission.submittedAt,
                    ) && (
                      <Check className="size-4 shrink-0 rounded-full bg-success p-0.5 stroke-3 stroke-success-content" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
