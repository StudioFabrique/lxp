import { useQuery } from "@tanstack/react-query";
import type Lesson from "../../../../utils/interfaces/lesson";
import { modulePreviewApi } from "../../api/module-preview.api";
import ActivityList from "./activity-list";

const noop = () => {};

/** Déplier une leçon ici ne sélectionne aucun contenu dans l'explorateur. */
export default function CalendarLessonActivities({ lesson }: { lesson: Lesson }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["calendar-lesson", lesson.id],
    queryFn: async () => modulePreviewApi.queries.getLesson(lesson.id!) as Promise<Lesson>,
    enabled: Boolean(lesson.id) && !lesson.activities,
  });

  if (!lesson.activities && isError) {
    return (
      <div role="alert" className="p-3 text-sm">
        Impossible de charger les activités.
        <button type="button" className="btn btn-xs btn-ghost" onClick={() => void refetch()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <ActivityList
      readOnly
      activities={lesson.activities ?? data?.activities}
      isLoading={!lesson.activities && isPending}
      onActivityReorder={noop}
      onSelectActivity={noop}
    />
  );
}
