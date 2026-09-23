import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { CalendarDays, CircleCheck } from "lucide-react";
import Course from "../../../../utils/interfaces/course";

type Props = {
  course: Course;
};

const JournalTimeline = ({ course }: Props) => {
  const accomplishments = [...(course.accomplishments ?? [])].sort(
    (a, b) =>
      new Date(b.accomplishedAt ?? 0).getTime() -
      new Date(a.accomplishedAt ?? 0).getTime(),
  );

  return (
    <div className="flex flex-col p-5 sm:p-7">
      <div className="mb-6 flex items-center gap-3 border-b border-base-200 pb-5">
        <h3 className="text-xl font-bold first-letter:uppercase mx-auto">
          {formatTitle(course.title)}
        </h3>
      </div>

      <ol className="relative ml-3 border-l-2 border-base-300 pl-7">
        {accomplishments.map((acc) => (
          <li key={acc.id} className="relative pb-7 last:pb-0">
            <span className="absolute left-[-2.3rem] grid size-5 place-items-center rounded-full bg-success text-success-content ring-4 ring-base-100">
              <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <article className="rounded-xl border border-base-300 bg-base-200/40 p-4">
              <p className="font-medium text-base-content">{acc.description}</p>
              {acc.accomplishedAt && (
                <time
                  className="mt-2 flex items-center gap-1.5 text-xs text-base-content/55"
                  dateTime={new Date(acc.accomplishedAt).toISOString()}
                >
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(acc.accomplishedAt))}
                </time>
              )}
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default JournalTimeline;
