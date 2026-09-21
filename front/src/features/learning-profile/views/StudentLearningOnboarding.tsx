import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Loader from "../../../components/loaders/Loader";
import Stepper from "../../../components/UI/stepper-component/stepper-component";
import AuthPageWrapper from "../../auth/components/AuthPageWrapper";
import ProfileItemsEditor from "../../profile/components/information/ProfileItemsEditor";
import { profileApi } from "../../profile/api/profile.api";
import type Hobby from "../../user/interfaces/hobby";
import type { Link } from "../../user/interfaces/link";
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
  kind: "intro" | "pace" | "preferences" | "formation" | "profile" | "summary";
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
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [profileInformation, setProfileInformation] = useState<Record<string, unknown> | null>(null);
  const [profileItemsChanged, setProfileItemsChanged] = useState(false);
  const reduceMotion = useReducedMotion();

  const steps = useMemo<OnboardingStep[]>(() => {
    if (!context) return [];
    const formation = context.formationsToAssess[0] ?? context.availableFormations[0];
    if (!formation) return [];
    return [
      { key: "intro", label: "Bienvenue", kind: "intro" },
      { key: "pace", label: "Rythme", kind: "pace" },
      { key: "preferences", label: "Préférences", kind: "preferences" },
      { key: `formation:${formation.id}`, label: "Votre niveau", kind: "formation", formationId: formation.id },
      { key: "profile", label: "À propos de vous", kind: "profile" },
      { key: "summary", label: "Terminé", kind: "summary" },
    ];
  }, [context]);

  useEffect(() => {
    profileApi.queries.getInformation().then(({ data }) => {
      setProfileInformation(data);
      setHobbies(data.hobbies ?? []);
      setLinks(data.links ?? []);
    }).catch(() => undefined);
  }, []);

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
      <AuthPageWrapper title="Personnalisons votre parcours">
        <div className="py-12 text-center">
          <p>Impossible de charger votre profil d’apprentissage.</p>
          <button className="btn btn-primary mt-4" onClick={() => void query.refetch()}>
            Réessayer
          </button>
        </div>
      </AuthPageWrapper>
    );
  }
  if (!context?.hasAvailableContent) return <Navigate to="/student/dashboard" replace />;
  if (!context.onboardingRequired || steps.length === 0) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const step = steps[index]!;
  const formation = context.formationsToAssess[0] ?? context.availableFormations[0];

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
      if (step.kind === "profile" && profileItemsChanged && profileInformation) {
        const payload = new FormData();
        payload.append("data", JSON.stringify({
          user: { ...profileInformation, hobbies, links },
        }));
        await profileApi.mutations.updateInformation(payload);
        setProfileItemsChanged(false);
      }
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
    <AuthPageWrapper
      title="Personnalisons votre parcours"
      description="Quelques repères simples pour adapter votre expérience. Vous pourrez les modifier plus tard."
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-1">
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

        <AnimatePresence mode="wait" initial={false}>
        <motion.section key={step.key} initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }} transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: "easeOut" }} className="w-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
          {formation?.parcours[0] && step.kind !== "intro" ? (
            <div className="mb-6 rounded-xl bg-primary/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Votre parcours</p>
              <p className="mt-0.5 text-lg font-bold first-letter:uppercase">{formation.parcours[0].title}</p>
            </div>
          ) : null}
          {step.kind === "intro" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Bienvenue dans votre parcours</h1>
              <p>Nous allons nous concentrer uniquement sur ce parcours pour garder cette étape courte et utile.</p>
              {formation?.parcours[0] && <div className="rounded-xl border border-primary/30 bg-primary/10 p-5"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Votre parcours</p><h2 className="mt-1 text-2xl font-bold first-letter:uppercase">{formation.parcours[0].title}</h2><p className="mt-1 text-sm text-base-content/70 first-letter:uppercase">{formation.title}</p></div>}
            </div>
          ) : null}

          {step.kind === "pace" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Quel rythme préférez-vous ?</h1>
              <p className="text-sm text-base-content/65">Choisissez la proposition qui vous convient. Vous pourrez la modifier plus tard.</p>
              <SingleChoiceCards name="pace" options={paceOptions} value={pace} onChange={setPace} />
            </div>
          ) : null}

          {step.kind === "preferences" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Comment aimez-vous apprendre ?</h1>
              <p className="text-sm text-base-content/70">Sélectionnez au moins une préférence. Les mots clés ci-dessous vous aident à choisir comment aborder les contenus.</p>
              <PreferenceCards value={preferences} onChange={setPreferences} />
            </div>
          ) : null}

          {step.kind === "formation" && formation ? (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Quel est votre niveau actuel ?</h1>
                <p className="mt-2 text-sm text-base-content/65">Appuyez-vous sur ces exemples tirés du parcours pour vous situer.</p>
              </div>
              {formation.parcours[0]?.tags.length ? <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/55">Notions abordées</p><div className="flex flex-wrap gap-2">{formation.parcours[0].tags.map((tag) => <span key={tag} className="badge badge-outline">{tag}</span>)}</div></div> : null}
              {formation.parcours[0]?.contentSamples.length ? <div className="rounded-xl border border-base-300 bg-base-200/60 p-4"><p className="mb-2 text-sm font-semibold">Exemples de contenus</p><ul className="space-y-2 text-sm">{formation.parcours[0].contentSamples.map((sample) => <li key={`${sample.type}-${sample.title}`} className="flex gap-2"><span className="text-primary">•</span><span>{sample.title} <span className="text-base-content/50">({sample.type === "module" ? "module" : "cours"})</span></span></li>)}</ul></div> : null}
              <SingleChoiceCards
                name={`level-${formation.id}`}
                options={levelOptions}
                value={levels[formation.id] ?? null}
                onChange={(level) => setLevels((current) => ({ ...current, [formation.id]: level }))}
              />
            </div>
          ) : null}

          {step.kind === "profile" ? (
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Souhaitez-vous en dire un peu plus ?</h1>
              <p className="text-sm text-base-content/65">Cette étape est entièrement facultative. Vous pouvez la passer sans rien renseigner.</p>
              <ProfileItemsEditor hobbies={hobbies} links={links} onHobbiesChange={(items) => { setHobbies(items); setProfileItemsChanged(true); }} onLinksChange={(items) => { setLinks(items); setProfileItemsChanged(true); }} />
            </div>
          ) : null}

          {step.kind === "summary" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">Votre profil est prêt</h1>
              <p>Confirmez vos réponses. Vous pourrez les modifier à tout moment depuis Mon avancement.</p>
              <div className="rounded-xl bg-base-200 p-4 text-sm">
                <p><strong>Parcours :</strong> {formation?.parcours[0]?.title}</p>
                <p className="mt-2"><strong>Préférences choisies :</strong> {preferences.length}</p>
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
                {step.kind === "profile" ? "Passer ou continuer" : "Continuer"}
              </button>
            )}
          </div>
        </motion.section>
        </AnimatePresence>
      </div>
    </AuthPageWrapper>
  );
}
