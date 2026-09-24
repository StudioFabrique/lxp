import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  levelOptions,
  paceOptions,
} from "../../learning-profile/learning-choice-options";
import {
  PreferenceCards,
  SingleChoiceCards,
} from "../../learning-profile/LearningChoiceCards";
import {
  learningProfileApi,
  learningProfileKey,
} from "../../learning-profile/learning-profile.api";
import type {
  FormationLevel,
  LearningPace,
  LearningPreference,
} from "../../learning-profile/types";
import { cn } from "../../../utils/cn";
import { formatTitle } from "../../../utils/helpers/text-helpers";

type Props = { onClose?: () => void };

export default function StudentProfile({ onClose }: Props) {
  const [tab, setTab] = useState<"preferences" | "niveaux">("preferences");
  const [pace, setPace] = useState<LearningPace | null>(null);
  const [preferences, setPreferences] = useState<LearningPreference[]>([]);
  const [levels, setLevels] = useState<Record<number, FormationLevel>>({});
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
  });
  const modules =
    query.data?.availableFormations.flatMap((formation) =>
      formation.parcours.flatMap((parcours) =>
        parcours.modules.map((module) => ({
          ...module,
          formationTitle: formation.title,
          parcoursTitle: parcours.title,
        })),
      ),
    ) ?? [];
  const selectedModule =
    modules.find((module) => module.id === selectedModuleId) ?? modules[0];

  useEffect(() => {
    if (!query.data) return;
    setPace(query.data.profile.pace);
    setPreferences(query.data.profile.preferences);
    setLevels(
      Object.fromEntries(
        query.data.availableFormations.flatMap((formation) =>
          formation.parcours.flatMap((parcours) =>
            parcours.modules
              .filter((module) => module.assessment)
              .map((module) => [module.id, module.assessment!.level]),
          ),
        ),
      ),
    );
  }, [query.data]);

  const save = async () => {
    if (tab === "preferences" && (!pace || preferences.length === 0)) {
      toast.error("Choisissez un rythme et au moins une préférence.");
      return;
    }
    setSaving(true);
    try {
      if (tab === "preferences")
        await learningProfileApi.update({ pace: pace!, preferences });
      else {
        const changed =
          query.data?.availableFormations
            .flatMap((formation) =>
              formation.parcours.flatMap((parcours) => parcours.modules),
            )
            .filter(
              (module) =>
                levels[module.id] &&
                levels[module.id] !== module.assessment?.level,
            ) ?? [];
        await Promise.all(
          changed.map((module) =>
            learningProfileApi.updateModule(module.id, levels[module.id]!),
          ),
        );
      }
      await queryClient.invalidateQueries({ queryKey: learningProfileKey });
      toast.success("Vos choix ont été enregistrés.");
      onClose?.();
    } catch {
      toast.error("Impossible d’enregistrer vos choix.");
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div className="flex flex-col gap-5 min-h-[75vh]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="learning-settings-title" className="text-xl font-bold">
            Mes préférences et niveaux
          </h2>
          <p className="text-sm text-base-content/65">
            Personnalisez votre accompagnement.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <div
        role="tablist"
        aria-label="Réglages d’apprentissage"
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "preferences"}
          className={cn(
            "btn btn-sm cursor-pointer",
            tab === "preferences" ? "btn-primary" : "btn-outline",
          )}
          onClick={() => setTab("preferences")}
        >
          Préférences
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "niveaux"}
          className={cn(
            "btn btn-sm cursor-pointer",
            tab === "niveaux" ? "btn-primary" : "btn-outline",
          )}
          onClick={() => setTab("niveaux")}
        >
          Niveaux par module
        </button>
      </div>
      {query.isLoading ? (
        <div
          role="status"
          aria-label="Chargement du profil"
          className="space-y-4"
        >
          <span className="sr-only">Chargement du profil…</span>
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-40 w-full" />
        </div>
      ) : query.isError ? (
        <p role="alert">Impossible de charger vos choix.</p>
      ) : tab === "preferences" ? (
        <div className="space-y-5">
          <h3 className="font-semibold">Quel rythme préférez-vous ?</h3>
          <SingleChoiceCards
            name="profile-pace"
            options={paceOptions}
            value={pace}
            onChange={setPace}
          />
          <h3 className="font-semibold">Comment aimez-vous apprendre ?</h3>
          <PreferenceCards value={preferences} onChange={setPreferences} />
        </div>
      ) : (
        <div className="space-y-4">
          {modules.length > 0 ? (
            <>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrer par module"
              >
                {modules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    className={cn(
                      "btn btn-xs btn-secondary h-auto min-h-7 max-w-full px-2 py-1 text-xs leading-tight whitespace-normal text-left",
                      selectedModule?.id !== module.id && "btn-outline",
                    )}
                    title={`${formatTitle(module.title)} · ${formatTitle(module.parcoursTitle)}`}
                    aria-pressed={selectedModule?.id === module.id}
                    onClick={() => setSelectedModuleId(module.id)}
                  >
                    <span>{formatTitle(module.title)}</span>
                  </button>
                ))}
              </div>
              {selectedModule && (
                <section
                  className="rounded-xl border border-base-300 p-4"
                  aria-label={`Niveau dans ${formatTitle(selectedModule.title)}`}
                >
                  <h3 className="font-semibold">
                    {formatTitle(selectedModule.title)}
                  </h3>
                  <p className="mb-4 text-xs text-base-content/60">
                    {formatTitle(selectedModule.formationTitle)} ·{" "}
                    {formatTitle(selectedModule.parcoursTitle)}
                  </p>
                  <SingleChoiceCards
                    name={`profile-level-${selectedModule.id}`}
                    options={levelOptions}
                    value={levels[selectedModule.id] ?? null}
                    onChange={(level) =>
                      setLevels((current) => ({
                        ...current,
                        [selectedModule.id]: level,
                      }))
                    }
                  />
                </section>
              )}
            </>
          ) : (
            <p className="text-sm text-base-content/65">
              Aucun module disponible.
            </p>
          )}
        </div>
      )}
      <div className="flex justify-end border-t border-base-300 pt-4 mt-auto">
        <button
          type="button"
          className="btn btn-primary"
          disabled={saving || query.isLoading || query.isError}
          onClick={() => void save()}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );

  if (!onClose) return <main className="mx-auto max-w-3xl p-6">{content}</main>;
  return createPortal(
    <div
      className="modal modal-open"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-settings-title"
        className="modal-box max-h-[90vh] w-11/12 max-w-3xl overflow-y-auto"
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}
