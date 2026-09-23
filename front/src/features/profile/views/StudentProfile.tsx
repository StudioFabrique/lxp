import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { levelOptions, paceOptions } from "../../learning-profile/learning-choice-options";
import { PreferenceCards, SingleChoiceCards } from "../../learning-profile/LearningChoiceCards";
import { learningProfileApi, learningProfileKey } from "../../learning-profile/learning-profile.api";
import type { FormationLevel, LearningPace, LearningPreference } from "../../learning-profile/types";
import { cn } from "../../../utils/cn";

type Props = { onClose?: () => void };

export default function StudentProfile({ onClose }: Props) {
  const [tab, setTab] = useState<"preferences" | "niveaux">("preferences");
  const [pace, setPace] = useState<LearningPace | null>(null);
  const [preferences, setPreferences] = useState<LearningPreference[]>([]);
  const [levels, setLevels] = useState<Record<number, FormationLevel>>({});
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: learningProfileKey, queryFn: learningProfileApi.get });

  useEffect(() => {
    if (!query.data) return;
    setPace(query.data.profile.pace);
    setPreferences(query.data.profile.preferences);
    setLevels(Object.fromEntries(query.data.availableFormations.filter((formation) => formation.assessment).map((formation) => [formation.id, formation.assessment!.level])));
  }, [query.data]);

  const save = async () => {
    if (tab === "preferences" && (!pace || preferences.length === 0)) {
      toast.error("Choisissez un rythme et au moins une préférence.");
      return;
    }
    setSaving(true);
    try {
      if (tab === "preferences") await learningProfileApi.update({ pace: pace!, preferences });
      else {
        const changed = query.data?.availableFormations.filter((formation) => levels[formation.id] && levels[formation.id] !== formation.assessment?.level) ?? [];
        await Promise.all(changed.map((formation) => learningProfileApi.updateFormation(formation.id, levels[formation.id]!)));
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

  const content = <div className="space-y-5">
    <div className="flex items-start justify-between gap-4">
      <div><h2 id="learning-settings-title" className="text-xl font-bold">Mes préférences et niveaux</h2><p className="text-sm text-base-content/65">Personnalisez votre accompagnement.</p></div>
      {onClose && <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={onClose} aria-label="Fermer"><X className="size-5" /></button>}
    </div>
    <div role="tablist" aria-label="Réglages d’apprentissage" className="flex flex-wrap gap-2">
      <button type="button" role="tab" aria-selected={tab === "preferences"} className={cn("btn btn-sm cursor-pointer", tab === "preferences" ? "btn-primary" : "btn-outline")} onClick={() => setTab("preferences")}>Préférences</button>
      <button type="button" role="tab" aria-selected={tab === "niveaux"} className={cn("btn btn-sm cursor-pointer", tab === "niveaux" ? "btn-primary" : "btn-outline")} onClick={() => setTab("niveaux")}>Niveaux par formation</button>
    </div>
    {query.isLoading ? <div role="status" aria-label="Chargement du profil" className="space-y-4"><span className="sr-only">Chargement du profil…</span><div className="skeleton h-8 w-1/2" /><div className="skeleton h-40 w-full" /></div> : query.isError ? <p role="alert">Impossible de charger vos choix.</p> : tab === "preferences" ? <div className="space-y-5">
      <h3 className="font-semibold">Quel rythme préférez-vous ?</h3>
      <SingleChoiceCards name="profile-pace" options={paceOptions} value={pace} onChange={setPace} />
      <h3 className="font-semibold">Comment aimez-vous apprendre ?</h3>
      <PreferenceCards value={preferences} onChange={setPreferences} />
    </div> : <div className="space-y-5">{query.data?.availableFormations.map((formation) => <section key={formation.id} className="rounded-xl border border-base-300 p-4">
      <h3 className="mb-3 font-semibold first-letter:uppercase">{formation.title}</h3>
      <SingleChoiceCards name={`profile-level-${formation.id}`} options={levelOptions} value={levels[formation.id] ?? null} onChange={(level) => setLevels((current) => ({ ...current, [formation.id]: level }))} />
    </section>)}</div>}
    <div className="flex justify-end border-t border-base-300 pt-4"><button type="button" className="btn btn-primary" disabled={saving || query.isLoading || query.isError} onClick={() => void save()}>{saving ? "Enregistrement…" : "Enregistrer"}</button></div>
  </div>;

  if (!onClose) return <main className="mx-auto max-w-3xl p-6">{content}</main>;
  return createPortal(<div className="modal modal-open" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="learning-settings-title" className="modal-box max-h-[90vh] w-11/12 max-w-3xl overflow-y-auto">{content}</div></div>, document.body);
}
