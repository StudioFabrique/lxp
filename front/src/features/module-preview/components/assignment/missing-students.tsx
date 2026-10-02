import type { AssignmentExpectedStudent } from "../../interfaces/assignment";
import { cn } from "../../../../utils/cn";
import { toTitleCase } from "../../../../utils/helpers/text-helpers";

export function MissingStudents({
  students,
  compact = false,
}: {
  students: AssignmentExpectedStudent[];
  compact?: boolean;
}) {
  if (students.length === 0) return null;

  return (
    <section
      className={cn(
        compact
          ? "mt-4 border-t border-base-300 px-2 pt-4"
          : "mx-auto mt-5 max-w-md text-left",
      )}
    >
      <h4 className="text-sm font-semibold">
        En attente de remise ({students.length})
      </h4>
      <ul className="mt-2 space-y-1 text-sm text-base-content/70">
        {students.map((student) => {
          const name =
            [student.firstname, student.lastname].filter(Boolean).join(" ") ||
            "Étudiant";
          return (
            <li key={student.id}>
              {toTitleCase(name)}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
