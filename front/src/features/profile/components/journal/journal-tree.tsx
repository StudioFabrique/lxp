import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, CircleCheckBig, Sparkles } from "lucide-react";
import Parcours from "../../../../utils/interfaces/parcours";
import JournalTimeline from "./journal-timeline";
import { formatTitle } from "../../../../utils/helpers/text-helpers";

type Props = {
  parcoursList: Parcours[];
};

const JournalTree = ({ parcoursList }: Props) => {
  const coursesWithAccomplishments = useMemo(
    () =>
      parcoursList.flatMap((parcours) =>
        (parcours.modules ?? []).flatMap((module) =>
          (module.courses ?? [])
            .filter((course) => (course.accomplishments?.length ?? 0) > 0)
            .map((course) => ({ parcours, module, course })),
        ),
      ),
    [parcoursList],
  );
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const selectedCourse =
    coursesWithAccomplishments.find(
      ({ course }) => course.id === selectedCourseId,
    )?.course ??
    coursesWithAccomplishments[0]?.course ??
    null;

  if (coursesWithAccomplishments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-10 text-center">
        <Sparkles
          className="mx-auto mb-3 h-8 w-8 text-base-content/40"
          aria-hidden="true"
        />
        <p className="font-semibold">Votre historique est encore vide</p>
        <p className="mt-1 text-sm text-base-content/60">
          Terminez une activité pour voir votre premier accomplissement.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-80 overflow-hidden rounded-2xl border border-base-300 bg-base-100 lg:max-h-[70vh] lg:grid-cols-[minmax(16rem,22rem)_1fr]">
      <nav
        className="border-b border-base-300 bg-base-200/60 p-3 lg:overflow-y-auto lg:border-r lg:border-b-0"
        aria-label="Cours avec accomplissements"
      >
        <ul className="space-y-1">
          {coursesWithAccomplishments.map(({ parcours, module, course }) => {
            const isSelected = selectedCourse?.id === course.id;
            const count = course.accomplishments?.length ?? 0;
            return (
              <li key={course.id}>
                <button
                  type="button"
                  className={`group w-full rounded-xl p-3 text-left transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-content shadow-sm"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => setSelectedCourseId(course.id)}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-lg ${isSelected ? "bg-primary-content/15" : "bg-primary/10 text-primary"}`}
                    >
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {formatTitle(course.title)}
                      </span>
                      <span
                        className={`block truncate text-xs ${isSelected ? "text-primary-content/75" : "text-base-content/55"}`}
                      >
                        {formatTitle(parcours.title)} ·{" "}
                        {formatTitle(module.title)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold">
                      <CircleCheckBig className="h-4 w-4" aria-hidden="true" />
                      {count}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 opacity-60"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-h-72 overflow-y-auto">
        {selectedCourse && <JournalTimeline course={selectedCourse} />}
      </div>
    </div>
  );
};

export default JournalTree;
