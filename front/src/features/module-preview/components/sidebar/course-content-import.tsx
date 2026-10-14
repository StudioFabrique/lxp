import type { LessonWithActivitiesCount } from "../../../../utils/interfaces/lesson";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { courseApi } from "../../../course/api/course.api";
import type Tag from "../../../../utils/interfaces/tag";
import { cn } from "../../../../utils/cn";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";

type Props = {
  /** Tags du module, proposés pour rechercher du contenu existant. */
  parcoursTags: Tag[];
  selectedContents: LessonWithActivitiesCount[];
  onSelectedContentsChange: (
    update: (
      current: LessonWithActivitiesCount[],
    ) => LessonWithActivitiesCount[],
  ) => void;
};

/** Recherche et sélection de leçons ou ressources existantes à importer dans un cours. */
export default function CourseContentImport({
  parcoursTags,
  selectedContents,
  onSelectedContentsChange: setSelectedContents,
}: Props) {
  const [includeCourseContents, setIncludeCourseContents] = useState(false);
  const [contentTagId, setContentTagId] = useState(0);
  const hasTags = parcoursTags.length > 0;

  const { data: lessonsResponse, isLoading: isLoadingLessons } = useQuery({
    ...courseApi.queries.lessonsByTag(
      contentTagId,
      includeCourseContents,
      true,
    ),
    enabled: contentTagId > 0,
  });
  const availableContents = useMemo(
    () => lessonsResponse?.data ?? [],
    [lessonsResponse?.data],
  );

  const toggleExistingLesson = (lesson: LessonWithActivitiesCount) => {
    setSelectedContents((current) =>
      current.some(
        (content) =>
          content.id === lesson.id && content.source === lesson.source,
      )
        ? current.filter(
            (content) =>
              content.id !== lesson.id || content.source !== lesson.source,
          )
        : [...current, lesson],
    );
  };

  const handleToggleCourseContents = (enabled: boolean) => {
    setIncludeCourseContents(enabled);
    if (!enabled) {
      setSelectedContents((current) =>
        current.filter((content) => content.source === "resource"),
      );
    }
  };

  return (
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <Search className="h-3.5 w-3.5" />
                  Rechercher par tag
                </span>
                <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <select
                      className="select select-sm select-bordered w-full"
                      disabled={!hasTags}
                      value={contentTagId}
                      onChange={(event) =>
                        setContentTagId(Number(event.target.value))
                      }
                    >
                      <option value={0}>
                        {hasTags ? "Choisir un tag" : "Aucun tag disponible"}
                      </option>
                      {parcoursTags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-base-300 px-3 h-full">
                    <span className="flex items-center gap-2">
                      <span className="block text-sm font-semibold">
                        Contenus des autres cours
                      </span>
                      <QuestionMarkTooltip
                        tooltipPosition="left"
                        tooltipValue="Ressources supplémentaires seules par défaut."
                      />
                    </span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm shrink-0"
                      checked={includeCourseContents}
                      onChange={(event) =>
                        handleToggleCourseContents(event.target.checked)
                      }
                    />
                  </label>
                </div>

                {!hasTags ? (
                  <p className="pt-2 text-center text-xs text-base-content/55">
                    Aucun tag n'est associé à ce module : ajoutez-en pour retrouver des leçons à importer.
                  </p>
                ) : isLoadingLessons ? (
                  <div
                    role="status"
                    aria-label="Chargement des contenus"
                    className="w-full space-y-2"
                  >
                    <span className="sr-only">Chargement des contenus…</span>
                    <div className="skeleton h-9 w-full" />
                    <div className="skeleton h-9 w-full" />
                  </div>
                ) : contentTagId > 0 && availableContents.length === 0 ? (
                  <p className="text-xs text-center text-base-content/55 pt-2">
                    {includeCourseContents
                      ? "Aucun contenu trouvé pour ce tag."
                      : "Aucune ressource supplémentaire trouvée pour ce tag."}
                  </p>
                ) : (
                  <div>
                    <div className="flex flex-col gap-3 overflow-y-auto">
                      {availableContents.map(
                        (content: LessonWithActivitiesCount) =>
                          !selectedContents.some(
                            (selected) =>
                              selected.id === content.id &&
                              selected.source === content.source,
                          ) && (
                            <label
                              key={`${content.source}-${content.id}`}
                              className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-base-300 px-4 py-3 text-sm select-none"
                            >
                              <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm"
                                checked={false}
                                onChange={() => toggleExistingLesson(content)}
                              />
                              <span className="flex-1">
                                <span className="block font-medium">
                                  {formatTitle(content.title)}
                                </span>
                                <span className="text-xs text-base-content/50">
                                  {content.source === "resource"
                                    ? "Ressource supplémentaire"
                                    : content.sourceTitle}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs text-base-content/50">
                                {content.activitiesCount ?? 0} activité(s)
                              </span>
                            </label>
                          ),
                      )}
                    </div>

                    {selectedContents.length > 0 ? (
                      <div className="mt-4 flex flex-col gap-3 overflow-y-auto">
                        {selectedContents.map(
                          (content: LessonWithActivitiesCount) => (
                            <label
                              key={`${content.source}-${content.id}`}
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-4 rounded-lg border border-base-300 px-4 py-3 text-sm select-none",
                                "bg-info/10",
                              )}
                            >
                              <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm"
                                checked
                                onChange={() => toggleExistingLesson(content)}
                              />
                              <span className="flex-1">
                                <span className="block font-medium">
                                  {formatTitle(content.title)}
                                </span>
                                <span className="text-xs text-base-content/50">
                                  {content.source === "resource"
                                    ? "Ressource supplémentaire"
                                    : content.sourceTitle}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs text-base-content/50">
                                {content.activitiesCount ?? 0} activité(s)
                              </span>
                            </label>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 text-center text-xs">
                        Aucune leçon disponible.
                      </p>
                    )}
                  </div>
                )}
              </div>
  );
}
