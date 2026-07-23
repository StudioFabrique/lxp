import { useQuery } from "@tanstack/react-query";
import { BookOpen, Check, Plus, Search, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { courseApi } from "../../../course/api/course.api";
import apiClient from "../../../../lib/axios";
import type Tag from "../../../../utils/interfaces/tag";
import type { LessonWithActivitiesCount } from "../../../../utils/interfaces/lesson";
import type { CreateCourseFormValues } from "./course-form.types";

type Props = {
  initialTitle: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CreateCourseFormValues) => Promise<boolean>;
};

export default function CreateCourseDetailsModal({
  initialTitle,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonTitles, setLessonTitles] = useState<string[]>([]);
  const [showExistingContents, setShowExistingContents] = useState(false);
  const [contentTagId, setContentTagId] = useState(0);
  const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);

  const { data: tags = [] } = useQuery({
    queryKey: ["tags", "course-create"],
    queryFn: async (): Promise<Tag[]> => {
      const response = await apiClient.get("/tag");
      return response.data;
    },
  });

  const { data: lessonsResponse, isLoading: isLoadingLessons } = useQuery({
    ...courseApi.queries.lessonsByTag(contentTagId),
    enabled: contentTagId > 0,
  });
  const lessons = useMemo(
    () => lessonsResponse?.data ?? [],
    [lessonsResponse?.data],
  );

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  };

  const addLessonTitle = () => {
    const value = lessonTitle.trim();
    if (!value || lessonTitles.includes(value)) return;
    setLessonTitles((current) => [...current, value]);
    setLessonTitle("");
  };

  const toggleExistingLesson = (lessonId: number) => {
    setSelectedLessonIds((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId],
    );
  };

  const needsTagForNewLessons =
    lessonTitles.length > 0 && selectedTagIds.length === 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || needsTagForNewLessons) return;
    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      visibility: true,
      tagIds: selectedTagIds,
      lessonTitles,
      lessonIds: selectedLessonIds,
    });
    if (success) onClose();
  };

  return createPortal(
    <dialog className="modal modal-open z-[100]">
      <div className="modal-box flex max-h-[90vh] w-11/12 max-w-3xl flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold">Ajouter un cours</h3>
            <p className="text-sm text-base-content/60">
              Complétez les informations et préparez son contenu.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          id="create-course-details-form"
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Titre *</span>
            <input
              autoFocus
              className="input input-bordered w-full"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              className="textarea textarea-bordered min-h-24 w-full resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Décrivez brièvement ce cours."
            />
          </label>

          <section className="flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-semibold">Tags du cours</h4>
              <p className="text-xs text-base-content/60">
                Sélectionnez les thèmes qui permettront de classer le cours.
              </p>
            </div>
            <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-lg border border-base-300 p-3">
              {tags.length ? (
                tags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`btn btn-xs ${
                        selected ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                      {tag.name}
                    </button>
                  );
                })
              ) : (
                <span className="text-sm text-base-content/50">
                  Aucun tag disponible
                </span>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-xl border border-base-300 p-4">
            <div>
              <h4 className="font-semibold">Contenu du cours</h4>
              <p className="text-xs text-base-content/60">
                Saisissez uniquement les titres des nouvelles leçons.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                className="input input-sm input-bordered flex-1"
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addLessonTitle();
                  }
                }}
                placeholder="Ex. Introduction au HTML"
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addLessonTitle}
                disabled={!lessonTitle.trim()}
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {lessonTitles.length > 0 && (
              <ul className="space-y-2">
                {lessonTitles.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-lg bg-base-200 px-3 py-2 text-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs btn-square text-error"
                      onClick={() =>
                        setLessonTitles((current) =>
                          current.filter((title) => title !== item),
                        )
                      }
                      aria-label={`Retirer ${item}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {needsTagForNewLessons && (
              <p className="text-xs text-error">
                Sélectionnez au moins un tag pour créer ces leçons.
              </p>
            )}

            <div className="divider my-0 text-xs uppercase text-base-content/50">
              Ou
            </div>

            <button
              type="button"
              className="btn btn-outline btn-primary w-full"
              onClick={() => setShowExistingContents((current) => !current)}
            >
              <BookOpen className="h-4 w-4" />
              Ajouter du contenu
            </button>

            {showExistingContents && (
              <div className="flex flex-col gap-3 border-t border-base-300 pt-4">
                <label className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <Search className="h-3.5 w-3.5" />
                    Rechercher les contenus existants par tag
                  </span>
                  <select
                    className="select select-sm select-bordered w-full"
                    value={contentTagId}
                    onChange={(event) =>
                      setContentTagId(Number(event.target.value))
                    }
                  >
                    <option value={0}>Choisir un tag</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </label>

                {isLoadingLessons ? (
                  <span className="loading loading-spinner loading-sm mx-auto" />
                ) : contentTagId > 0 && lessons.length === 0 ? (
                  <p className="text-sm text-base-content/55">
                    Aucun contenu trouvé pour ce tag.
                  </p>
                ) : (
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {lessons.map((lesson: LessonWithActivitiesCount) => (
                      <label
                        key={lesson.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={selectedLessonIds.includes(lesson.id)}
                          onChange={() => toggleExistingLesson(lesson.id)}
                        />
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-base-content/50">
                          {lesson.activitiesCount ?? 0} activité(s)
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </form>

        <div className="flex justify-end gap-3 border-t border-base-300 bg-base-100 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            form="create-course-details-form"
            className="btn btn-primary"
            disabled={!title.trim() || needsTagForNewLessons || isSubmitting}
          >
            {isSubmitting && (
              <span className="loading loading-spinner loading-sm" />
            )}
            Créer le cours
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
