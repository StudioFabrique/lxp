import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardIAApi, type DropoutPreferences } from "../api/dashboardIA.api";
import { ChartNoAxesCombined, Mail, Users } from "lucide-react";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import TeacherGroupFields from "../../auth/components/TeacherGroupFields";
import { groupApi } from "../../group/api/group.api";

export default function DropoutPreferencesForm({ initial, onSaved, submitLabel = "Enregistrer", onBack, completeOnboarding = true }: { initial: DropoutPreferences; onSaved: (createGroupNext?: boolean) => void; submitLabel?: string; onBack?: () => void; completeOnboarding?: boolean }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [createGroupNext, setCreateGroupNext] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [parcoursId, setParcoursId] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState<Record<string, boolean>>({});
  const [groupCreated, setGroupCreated] = useState(false);
  const [frequency, setFrequency] = useState<"weekly" | "monthly">(initial.frequency);
  const [minCritical, setMinCritical] = useState<1 | 2>(initial.minCritical ?? 1);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input: Parameters<typeof dashboardIAApi.updateDropoutPreferences>[0]) => {
      if (!completeOnboarding && createGroupNext && !groupCreated) {
        const formData = new FormData();
        formData.append("data", JSON.stringify({ group: { name: groupName.trim(), desc: "" }, parcoursId,
          users: Object.entries(selectedStudents).map(([id, isActive]) => ({ _id: id, isActive })) }));
        await groupApi.mutations.create(formData);
        setGroupCreated(true);
      }
      return dashboardIAApi.updateDropoutPreferences(input);
    },
    onSuccess: (value) => {
      client.setQueryData(["dropout-preferences"], value);
      onSaved();
    },
  });
  const card = <BoxWrapper className={`relative z-10 h-auto rounded-lg transition-colors ${enabled ? "border-primary/25 bg-primary/5" : "border-base-300 bg-base-200/70"}`}>
    <label className="flex cursor-pointer items-start gap-4">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${enabled ? "bg-primary/10 text-primary" : "bg-base-300 text-base-content/40"}`}>
        <ChartNoAxesCombined className="size-6" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold">Activer l’analyse automatique du décrochage</span>
        <span className={`mt-1 block text-sm ${enabled ? "text-base-content/70" : "text-base-content/45"}`}>Vous recevrez un récapitulatif uniquement lorsqu’un de vos groupes présente un cas critique.</span>
      </span>
      <input type="checkbox" className="checkbox checkbox-primary mt-2 shrink-0" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
    </label>
    {enabled && <fieldset className="border-t border-primary/15 pt-4">
      <legend className="sr-only">Recevoir un récapitulatif par email</legend>
      <div className="mb-3 flex items-center gap-2 font-semibold"><Mail className="size-4 text-primary" aria-hidden="true" /> Recevoir un récapitulatif par email</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["weekly", "monthly"] as const).map((value) => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${frequency === value ? "border-primary/50 bg-primary/10" : "border-base-300 bg-base-100 hover:border-primary/30"}`}>
          <input type="radio" name="frequency" className="radio radio-primary radio-sm" checked={frequency === value} onChange={() => setFrequency(value)} />
          {value === "weekly" ? "Chaque semaine" : "Chaque mois"}
        </label>)}
      </div>
    </fieldset>}
    {enabled && <fieldset className="border-t border-primary/15 pt-4">
      <legend className="mb-3 font-semibold">Seuil d’alerte par groupe</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {([1, 2] as const).map((value) => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${minCritical === value ? "border-primary/50 bg-primary/10" : "border-base-300 bg-base-100 hover:border-primary/30"}`}>
          <input type="radio" name="minCritical" className="radio radio-primary radio-sm" checked={minCritical === value} onChange={() => setMinCritical(value)} />
          Dès {value} {value === 1 ? "cas critique" : "cas critiques"}
        </label>)}
      </div>
    </fieldset>}
  </BoxWrapper>;

  return <form className={`flex flex-col gap-5 ${onBack ? "min-h-0 flex-1" : ""}`} onSubmit={(event) => {
    event.preventDefault();
    mutation.mutate({ enabled, frequency, minCritical, completeOnboarding: true });
  }}>
    {enabled ? <CursorGlowCard autoGlow glowColor="primary" glowSize={2.4} className="rounded-lg">{card}</CursorGlowCard> : card}
    {!completeOnboarding && <BoxWrapper className={`h-auto transition-colors ${createGroupNext ? "border-secondary/25 bg-secondary/5" : "border-base-300 bg-base-200/70"}`}>
      <div className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Users className="size-6" aria-hidden="true" /></span>
      <label className="flex flex-1 cursor-pointer items-start gap-3"><span className="flex-1"><span className="block font-semibold">Créer mon groupe maintenant</span>
        <span className="mt-1 block text-sm text-base-content/65">Nommez votre groupe et ajoutez vos apprenants. Vous pourrez aussi le créer plus tard.</span></span>
        <input type="checkbox" className="checkbox checkbox-primary mt-2 shrink-0" checked={createGroupNext} onChange={(event) => setCreateGroupNext(event.target.checked)} /></label>
      </div>
      {createGroupNext && <TeacherGroupFields name={groupName} setName={setGroupName} parcoursId={parcoursId} setParcoursId={setParcoursId} selected={selectedStudents} setSelected={setSelectedStudents} />}
    </BoxWrapper>}
    {mutation.isError && <p role="alert" className="text-error">Impossible de créer le groupe ou d’enregistrer les paramètres.</p>}
    <div className={onBack ? "mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4" : "flex justify-end"}>
      {onBack && <button type="button" className="btn btn-ghost text-base normal-case" disabled={mutation.isPending} onClick={onBack}>Précédent</button>}
      <button type="submit" className="btn btn-primary text-base normal-case" disabled={mutation.isPending || (!completeOnboarding && createGroupNext && !groupName.trim())}>{submitLabel}</button>
    </div>
  </form>;
}
