import type Course from "../../../../utils/interfaces/course";
import { formatDate } from "./course-assignment.utils";

export function AssignmentHeader({ course }: { course: Course }) {
  const assignment = course.assignment!;
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold">Devoir</h2>
          <p className="mt-1 text-sm text-base-content/70 first-letter:uppercase">
            {course.title}
          </p>
        </div>
      </div>
      <div className="self-end text-end">
        <span className="block text-xs text-base-content/60">
          À rendre avant
        </span>
        <strong>{formatDate(assignment.dueAt)}</strong>
      </div>
    </div>
  );
}
