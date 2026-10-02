import { useId } from "react";
import { createPortal } from "react-dom";
import { useIsPresent } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dropoutPreferencesSchema } from "../preferences.schema";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  dashboardIAApi,
  type DropoutPreferences,
} from "../api/dashboardIA.api";
import { ChartNoAxesCombined, Mail } from "lucide-react";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import CreateTeacherGroup from "../../auth/components/CreateTeacherGroup";
import { groupApi } from "../../group/api/group.api";
import ExistingTeacherGroups from "../../auth/components/ExistingTeacherGroups";

export default function DropoutPreferencesForm({
  initial,
  onSaved,
  submitLabel = "Enregistrer",
  onBack,
  completeOnboarding = true,
  footerContainer,
}: {
  initial: DropoutPreferences;
  onSaved: () => void;
  submitLabel?: string;
  onBack?: () => void;
  completeOnboarding?: boolean;
  footerContainer?: HTMLElement | null;
}) {
  const formId = useId();
  const isPresent = useIsPresent();
  const groups = useQuery({
    queryKey: ["onboarding-student-groups"],
    queryFn: groupApi.queries.getStudentGroups,
    enabled: !completeOnboarding,
  });
  const form = useForm({
    resolver: zodResolver(dropoutPreferencesSchema),
    defaultValues: {
      enabled: initial.enabled,
      frequency: initial.frequency,
      minCritical: initial.minCritical ?? 1,
    },
  });
  const [enabled, setEnabled] = useFormField(form, "enabled");
  const [frequency, setFrequency] = useFormField(form, "frequency");
  const [minCritical, setMinCritical] = useFormField(form, "minCritical");
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof dashboardIAApi.updateDropoutPreferences>[0]) => dashboardIAApi.updateDropoutPreferences(input),
    onSuccess: (value) => {
      client.setQueryData(["dropout-preferences"], value);
      onSaved();
    },
  });
  const card = (
    <BoxWrapper
      className={`relative z-10 h-auto rounded-lg transition-colors ${enabled ? "border-primary/25 bg-primary/5" : "border-base-300 bg-base-200/70"}`}
    >
      <label className="flex cursor-pointer items-start gap-4">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${enabled ? "bg-primary/10 text-primary" : "bg-base-300 text-base-content/40"}`}
        >
          <ChartNoAxesCombined className="size-6" aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">
            Activer l’analyse automatique du décrochage
          </span>
          <span
            className={`mt-1 block text-sm ${enabled ? "text-base-content/70" : "text-base-content/45"}`}
          >
            Vous recevrez un récapitulatif uniquement lorsqu’un de vos groupes
            présente un cas critique.
          </span>
        </span>
        <input
          type="checkbox"
          className="checkbox checkbox-primary mt-2 shrink-0"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
      </label>
      {enabled && (
        <fieldset className="border-t border-primary/15 pt-4">
          <legend className="sr-only">
            Recevoir un récapitulatif par email
          </legend>
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <Mail className="size-4 text-primary" aria-hidden="true" /> Recevoir
            un récapitulatif par email
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["weekly", "monthly"] as const).map((value) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${frequency === value ? "border-primary/50 bg-primary/10" : "border-base-300 bg-base-100 hover:border-primary/30"}`}
              >
                <input
                  type="radio"
                  name="frequency"
                  className="radio radio-primary radio-sm"
                  checked={frequency === value}
                  onChange={() => setFrequency(value)}
                />
                {value === "weekly" ? "Chaque semaine" : "Chaque mois"}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {enabled && (
        <fieldset className="border-t border-primary/15 pt-4">
          <legend className="mb-3 font-semibold">
            Seuil d’alerte par groupe
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {([1, 2] as const).map((value) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${minCritical === value ? "border-primary/50 bg-primary/10" : "border-base-300 bg-base-100 hover:border-primary/30"}`}
              >
                <input
                  type="radio"
                  name="minCritical"
                  className="radio radio-primary radio-sm"
                  checked={minCritical === value}
                  onChange={() => setMinCritical(value)}
                />
                Dès {value} {value === 1 ? "cas critique" : "cas critiques"}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </BoxWrapper>
  );

  const actions = (
      <div
        className={
          onBack
            ? "mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4"
            : "flex justify-end"
        }
      >
        {onBack && (
          <button
            type="button"
            className="btn btn-ghost text-base normal-case"
            disabled={mutation.isPending}
            onClick={onBack}
          >
            Précédent
          </button>
        )}
        <button
          type="submit"
          form={formId}
          className="btn btn-primary text-base normal-case"
          disabled={mutation.isPending}
        >
          {submitLabel}
        </button>
      </div>
  );

  return (
    <form
      id={formId}
      className={`flex flex-col gap-5 ${onBack ? "min-h-0 flex-1" : ""}`}
      onSubmit={form.handleSubmit((values) => {
        if (mutation.isPending) return;
        mutation.mutate({
          enabled: values.enabled,
          frequency: values.frequency,
          minCritical: values.minCritical,
          completeOnboarding: true,
        });
      }, showFormErrors)}
    >
      {enabled ? (
        <CursorGlowCard
          autoGlow
          glowColor="primary"
          glowSize={2.4}
          className="rounded-lg"
        >
          {card}
        </CursorGlowCard>
      ) : (
        card
      )}
      {!completeOnboarding && (
        <div className={`grid items-stretch gap-5 ${groups.data?.length ? "sm:grid-cols-2" : ""}`}>
          <ExistingTeacherGroups groups={groups} />
          <CreateTeacherGroup hasGroups={Boolean(groups.data?.length)} />
        </div>
      )}
      {mutation.isError && (
        <p role="alert" className="text-error">
          Impossible d’enregistrer les paramètres.
        </p>
      )}
      {/* Exit animations retain the form after the next step's footer appears. */}
      {isPresent && (footerContainer ? createPortal(actions, footerContainer) : actions)}

    </form>
  );
}
