import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Header from "../../../components/headers/Header";
import Loader from "../../../components/loaders/Loader";
import Stepper from "../../../components/UI/stepper-component/stepper-component";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import {
  LearningChoiceCardsPlaceholder,
} from "../views/onboarding-placeholder";
import {
  levelOptions,
  paceOptions,
  PreferenceCards,
  SingleChoiceCards,
} from "../LearningChoiceCards";
import {
  learningProfileApi,
  learningProfileKey,
} from "../learning-profile.api";
import type {
  FormationLevel,
  LearningPace,
  LearningPreference,
} from "../types";

type OnboardingStep = {
  key: string;
  label: string;
  kind: "intro" | "pace" | "preferences" | "formation" | "summary";
  formationId?: number;
};

export default function StudentLearningOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: learningProfileKey, queryFn: learningProfileApi.get });
  const context = query.data;
  const [index, setIndex] = useState(0);
  const [pace, setPace] = useState<LearningPace | null>(null);
  const [preferences, setPreferences] = useState<LearningPreference[]>([]);
  const [levels, setLevels] = useState<Record<number, FormationLevel>>({});
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(false);

  const steps = useMemo<OnboardingStep[]>(() => {
    if (!context) return [];
    const formationSteps = context.formationsToAssess.map((formation) => ({
      key: `formation:${formation.id}`,
      label: formation.title,
      kind: "formation" as const,
      formationId: formation.id,
    }));
    return context.onboardingMode === "initial"
      ? [
          { key: "intro", label: "Introduction", kind: "intro" },
          { key: "pace", label: "Rythme", kind: "pace" },
          { key: "preferences", label: "Préférences", kind: "preferences" },
          ...formationSteps,
          { key: "summary", label: "Récapitulatif", kind: "summary" },
        ]
      : [
          ...formationSteps,
          { key: "summary", label: "Récapitulatif", kind: "summary" },
        ];
  }, [context]);

  useEffect(() => {
    if (!context || started) return;
    setPace(context.profile.pace);
    setPreferences(context.profile.preferences);
    setLevels(
      Object.fromEntries(
        context.availableFormations
          .filter((formation) => formation.assessment)
          .map((formation) => [formation.id, formation.assessment!.level]),
      ),
    );
    const resumeIndex = Math.max(
      0,
      steps.findIndex((step) => step.key === context.profile.currentStep),
    );
    setIndex(resumeIndex);
    setStarted(true);
    void learningProfileApi.update({
      action: "start",
      currentStep: steps[resumeIndex]?.key ?? steps[0]?.key ?? "",
    });
  }, [context, started, steps]);

  if (query.isLoading) return <LearningChoiceCardsPlaceholder />;
  if (query.isError) {
    return (
      <PageWrapper>
        <Header title="Personnalisons votre accompagnement" />
        <BoxWrapper className="items-center py-16 text-center">
          <p>Impossible de charger votre profil d’apprentissage.</p>
          <button className="btn btn-primary mt-4" onClick={() => void query.refetch()}>
            Réessayer
          </button>
        </BoxWrapper>
      </PageWrapper>
    );
  }
  if (!context?.hasAvailableContent) return <Navigate to="/student/dashboard" replace />;
  if (!context.onboardingRequired || steps.length === 0) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const step = steps[index]!;
  const formation = step.formationId
    ? context.availableFormations.find((item) => item.id === step.formationId)
    : null;

  const continueToNext = async () => {
    if (step.kind === "pace" && !pace) {
      toast.error("Choisissez un rythme pour continuer.");
      return;
    }
    if (step.kind === "preferences" && preferences.length === 0) {
      toast.error("Choisissez au moins une préférence.");
      return;
    }
    if (step.kind === "formation" && step.formationId && !levels[step.formationId]) {
      toast.error("Choisissez un niveau pour continuer.");
      return;
    }

    setSaving(true);
    try {
      if (step.kind === "pace" && pace) await learningProfileApi.update({ pace });
      if (step.kind === "preferences") await learningProfileApi.update({ preferences });
      if (step.kind === "formation" && step.formationId) {
        await learningProfileApi.updateFormation(step.formationId, levels[step.formationId]!);
      }
      const next = steps[index + 1];
      if (next) {
        await learningProfileApi.update({ currentStep: next.key });
        setIndex(index + 1);
      }
    } catch {
      toast.error("Cette étape n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  };

  const confirm = async () => {
    setSaving(true);
    try {
      await learningProfileApi.update({ action: "confirm" });
      await queryClient.invalidateQueries({ queryKey: learningProfileKey });
      toast.success("Votre profil d’apprentissage est prêt.");
      navigate("/student/dashboard", { replace: true });
    } catch {
      toast.error("Vérifiez que toutes les réponses ont été enregistrées.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper as="main">
      <Header
        title="Personnalisons votre accompagnement"
        description="Vos réponses pourront être modifiées depuis Mon profil."
      />
      <BoxWrapper className="gap-6 p-4 sm:p-6">
        <Stepper
          actualStep={{ id: index + 1, label: step.label, saved: false, isValid: true }}
          stepsList={steps.map((item, stepIndex) => ({
            id: stepIndex + 1,
            label: item.label,
            saved: stepIndex < index,
            isValid: true,
          }))}
          updateStep={(id) => id <= index + 1 && setIndex(id - 1)}
          disabled={saving}
        />

        <section className="mx-auto w-full max-w-3xl rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-8">
          {step.kind === "intro" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Bienvenue dans vos formations</h1>
              <p>Quelques réponses nous aideront à contextualiser votre accompagnement.</p>
              {context.availableFormations.map((item) => (
                <div key={item.id} className="rounded-xl bg-base-200 p-4">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="mt-1 text-sm text-base-content/70">
                    {item.parcours.map((parcours) => parcours.title).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {step.kind === "pace" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Quel rythme préférez-vous ?</h1>
              <SingleChoiceCards name="pace" options={paceOptions} value={pace} onChange={setPace} />
            </div>
          ) : null}

          {step.kind === "preferences" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Comment aimez-vous apprendre ?</h1>
              <p className="text-sm text-base-content/70">Sélectionnez au moins une préférence.</p>
              <PreferenceCards value={preferences} onChange={setPreferences} />
            </div>
          ) : null}

          {step.kind === "formation" && formation ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-primary">{formation.title}</p>
                <h1 className="text-2xl font-bold">Quel est votre niveau actuel ?</h1>
                <p className="mt-1 text-sm text-base-content/70">
                  Parcours : {formation.parcours.map((item) => item.title).join(" · ")}
                </p>
              </div>
              <SingleChoiceCards
                name={`level-${formation.id}`}
                options={levelOptions}
                value={levels[formation.id] ?? null}
                onChange={(level) => setLevels((current) => ({ ...current, [formation.id]: level }))}
              />
            </div>
          ) : null}

          {step.kind === "summary" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Votre profil est prêt</h1>
              <p>Confirmez vos réponses. Vous pourrez les modifier à tout moment depuis Mon profil.</p>
              <div className="rounded-xl bg-base-200 p-4 text-sm">
                <p><strong>Formations renseignées :</strong> {context.availableFormations.length}</p>
                {context.onboardingMode === "initial" ? (
                  <p className="mt-2"><strong>Préférences choisies :</strong> {preferences.length}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex justify-between gap-3 border-t border-base-300 pt-5">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={index === 0 || saving}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            >
              Précédent
            </button>
            {step.kind === "summary" ? (
              <button type="button" className="btn btn-primary" disabled={saving} onClick={() => void confirm()}>
                {saving ? <Loader /> : "Confirmer"}
              </button>
            ) : (
              <button type="button" className="btn btn-primary" disabled={saving} onClick={() => void continueToNext()}>
                Continuer
              </button>
            )}
          </div>
        </section>
      </BoxWrapper>
    </PageWrapper>
  );
}

