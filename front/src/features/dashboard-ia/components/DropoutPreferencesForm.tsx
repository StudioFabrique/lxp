import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardIAApi, type DropoutPreferences } from "../api/dashboardIA.api";

export default function DropoutPreferencesForm({ initial, onSaved, submitLabel = "Enregistrer", onBack }: { initial: DropoutPreferences; onSaved: () => void; submitLabel?: string; onBack?: () => void }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [frequency, setFrequency] = useState<"weekly" | "monthly">(initial.frequency);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: dashboardIAApi.updateDropoutPreferences,
    onSuccess: (value) => {
      client.setQueryData(["dropout-preferences"], value);
      onSaved();
    },
  });
  return <form className={`flex flex-col gap-5 ${onBack ? "min-h-0 flex-1" : ""}`} onSubmit={(event) => {
    event.preventDefault();
    mutation.mutate({ enabled, frequency });
  }}>
    <label className="flex items-center gap-3">
      <input type="checkbox" className="checkbox checkbox-primary" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
      Activer l'analyse automatique du décrochage
    </label>
    {enabled && <fieldset className="flex flex-col gap-2">
      <legend className="font-semibold">Recevoir un récapitulatif par email</legend>
      <label className="flex items-center gap-2"><input type="radio" name="frequency" className="radio radio-primary radio-sm" checked={frequency === "weekly"} onChange={() => setFrequency("weekly")} /> Chaque semaine</label>
      <label className="flex items-center gap-2"><input type="radio" name="frequency" className="radio radio-primary radio-sm" checked={frequency === "monthly"} onChange={() => setFrequency("monthly")} /> Chaque mois</label>
    </fieldset>}
    {mutation.isError && <p role="alert" className="text-error">Impossible d'enregistrer les paramètres.</p>}
    <div className={onBack ? "mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4" : "flex justify-end"}>
      {onBack && <button type="button" className="btn btn-ghost text-base normal-case" disabled={mutation.isPending} onClick={onBack}>Précédent</button>}
      <button type="submit" className="btn btn-primary text-base normal-case" disabled={mutation.isPending}>{submitLabel}</button>
    </div>
  </form>;
}
