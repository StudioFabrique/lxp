import { Play } from "lucide-react";
import type Course from "../../../../utils/interfaces/course";
import type Lesson from "../../../../utils/interfaces/lesson";
import RoleRankGuard from "../../../../components/guards/RoleRankGuard";
import { formatTitle } from "../../../../utils/helpers/text-helpers";

type Props = {
  courses: Course[];
  onSelectLesson: (lesson: Lesson) => void;
  onSelectAssignment?: (courseId: number) => void;
};

export default function NextCourseButton({ courses, onSelectLesson, onSelectAssignment }: Props) {
  const availableCourses = courses.filter((course) => course.isPublished && course.visibility !== false);
  const nextCourse = availableCourses.find((course) =>
    !course.stats?.isCompleted && (
      course.lessons.some((lesson) => lesson.id && lesson.visibility !== false && !lesson.lessonsRead?.some((read) => read.finishedAt)) ||
      (onSelectAssignment && course.assignment && !course.assignment.submissions.some((submission) => submission.submittedAt))
    ),
  );
  if (!nextCourse) return null;

  const nextLesson = nextCourse.lessons.find((lesson) =>
    lesson.id && lesson.visibility !== false && !lesson.lessonsRead?.some((read) => read.finishedAt),
  );
  const hasStartedCourse = nextCourse.lessons.some((lesson) => lesson.lessonsRead?.length) || (nextCourse.stats?.progress ?? 0) > 0;
  const hasStartedModule = availableCourses.some((course) =>
    course.stats?.isCompleted || (course.stats?.progress ?? 0) > 0 || course.lessons.some((lesson) => lesson.lessonsRead?.length),
  );
  const label = hasStartedCourse ? "Reprendre le cours" : hasStartedModule ? "Commencer le prochain cours" : "Commencer le premier cours";

  return (
    <RoleRankGuard ranks={[3]}>
      <div className="mb-5">
        <button
          type="button"
          className="btn btn-primary h-auto min-h-12 w-full gap-2 px-3 py-3 text-sm shadow-sm"
          onClick={() => nextLesson ? onSelectLesson(nextLesson) : onSelectAssignment?.(nextCourse.id)}
        >
          <Play className="size-4 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </button>
        <p className="mt-2 truncate text-center text-xs text-base-content/70" title={formatTitle(nextCourse.title)}>
          {formatTitle(nextCourse.title)}
        </p>
      </div>
    </RoleRankGuard>
  );
}
