import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../../../../lib/axios";
import type Tag from "../../../../utils/interfaces/tag";

type Props = {
  open: boolean;
  courseTitle: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    modalite: string;
    tagId: number;
  }) => Promise<boolean>;
};

export default function CreateLessonModal({
  open,
  courseTitle,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalite, setModalite] = useState("distanciel");
  const [tagId, setTagId] = useState<number | "">("");

  const {
    data: tags = [],
    isLoading: tagsLoading,
    isError,
  } = useQuery({
    queryKey: ["tags", "lesson-create"],
    queryFn: async (): Promise<Tag[]> => {
      const response = await apiClient.get("/tag");
      return response.data.response ?? response.data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (!tagId && tags[0]) setTagId(tags[0].id);
  }, [tagId, tags]);

  const close = () => {
    if (isSaving) return;
    setTitle("");
    setDescription("");
    setModalite("distanciel");
    setTagId("");
    onClose();
  };

  if (!open) return null;

  return (
    <dialog
      className="modal modal-open"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <form
        className="modal-box max-w-xl"
        onSubmit={async (event) => {
          event.preventDefault();
          if (title.trim() && tagId) {
            const success = await onSubmit({
              title: title.trim(),
              description: description.trim(),
              modalite,
              tagId: +tagId,
            });
            if (success) {
              setTitle("");
              setDescription("");
              setModalite("distanciel");
              setTagId("");
            }
          }
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-lg">
                Ajouter une leçon dans le cours « {courseTitle} »
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-circle"
            onClick={close}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-5 py-5">
          <label className="flex flex-col gap-2">
            <span className="font-semibold">
              Titre <span className="text-error">*</span>
            </span>
            <input
              autoFocus
              className="input input-bordered w-full"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex. Introduction aux composants React"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-semibold">
              Description
            </span>
            <textarea
              className="textarea textarea-bordered min-h-24 w-full"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ce que l'apprenant découvrira dans cette leçon"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                Tag <span className="text-error">*</span>
              </span>
              <select
                className="select select-bordered w-full"
                value={tagId}
                disabled={tagsLoading || isError}
                onChange={(event) => setTagId(+event.target.value)}
              >
                <option value="">
                  {tagsLoading
                    ? "Chargement…"
                    : isError
                      ? "Tags indisponibles"
                      : "Choisir un tag"}
                </option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-semibold">Modalité</span>
              <select
                className="select select-bordered w-full"
                value={modalite}
                onChange={(event) => setModalite(event.target.value)}
              >
                <option value="distanciel">Distanciel</option>
                <option value="presentiel">Présentiel</option>
                <option value="hybride">Hybride</option>
              </select>
            </label>
          </div>
          {isError && (
            <p className="text-sm text-error">
              Impossible de charger les tags. Fermez puis rouvrez la fenêtre
              pour réessayer.
            </p>
          )}
        </div>

        <div className="modal-action border-t border-base-300 pt-4">
          <button type="button" className="btn btn-ghost" onClick={close}>
            Annuler
          </button>
          <button
            className="btn btn-primary"
            disabled={!title.trim() || !tagId || isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Création…" : "Créer la leçon"}
          </button>
        </div>
      </form>
      <button type="button" className="modal-backdrop" onClick={close}>
        Fermer
      </button>
    </dialog>
  );
}
