import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Check, Gauge, GraduationCap, Shapes } from "lucide-react";
import TagItem from "../../../components/UI/tag-item/tag-item";
import AuthPageWrapper from "../../auth/components/AuthPageWrapper";
import ProfileItemsEditor from "../../profile/components/information/ProfileItemsEditor";
import { profileApi } from "../../profile/api/profile.api";
import ThemeSelectionStep from "../ThemeSelectionStep";
import type Hobby from "../../user/interfaces/hobby";
import type { Link } from "../../user/interfaces/link";
import { LearningChoiceCardsPlaceholder } from "../views/onboarding-placeholder";
import {
  levelOptions,
  paceOptions,
  preferenceOptions,
} from "../learning-choice-options";
import {
  LevelChoiceButtons,
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
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";

type OnboardingStep = {
  key: string;
  label: string;
  kind: "learning" | "module" | "profile" | "theme" | "summary";
  moduleId?: number;
};

const capitalizeTitle = (title: string) =>
  title.charAt(0).toLocaleUpperCase("fr-FR") + title.slice(1);

const availablePreferenceValues = new Set(
  preferenceOptions.map(({ value }) => value),
);

export default function StudentLearningOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
  });
  const context = query.data;
  const [index, setIndex] = useState(0);
  const [pace, setPace] = useState<LearningPace | null>(null);
  const [preferences, setPreferences] = useState<LearningPreference[]>([]);
  const [levels, setLevels] = useState<Record<number, FormationLevel>>({});
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(false);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [profileInformation, setProfileInformation] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [profileItemsChanged, setProfileItemsChanged] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const steps = useMemo<OnboardingStep[]>(() => {
    if (!context) return [];
    if (!context.availableFormations.length) return [];
    const onboardingSteps: OnboardingStep[] = [];

    if (context.onboardingMode === "initial") {
      onboardingSteps.push({ key: "theme", label: "Apparence", kind: "theme" });
    }

    onboardingSteps.push({
      key: "learning",
      label: "Votre façon d’apprendre",
      kind: "learning",
    });

    for (const formation of context.availableFormations) {
      for (const parcours of formation.parcours) {
        for (const module of parcours.modules.filter(
          (item) => context.onboardingMode === "initial" || !item.assessment,
        )) {
          onboardingSteps.push({
            key: `module:${module.id}`,
            label: module.title,
            kind: "module",
            moduleId: module.id,
          });
        }
      }
    }
    onboardingSteps.push({
      key: "profile",
      label: "À propos de vous",
      kind: "profile",
    });

    onboardingSteps.push({ key: "summary", label: "Terminé", kind: "summary" });
    return onboardingSteps;
  }, [context]);

  useEffect(() => {
    profileApi.queries
      .getInformation()
      .then(({ data }) => {
        setProfileInformation(data);
        setHobbies(data.hobbies ?? []);
        setLinks(data.links ?? []);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!context || started) return;
    setPace(context.profile.pace);
    setPreferences(
      context.profile.preferences.filter((preference) =>
        availablePreferenceValues.has(preference),
      ),
    );
    setLevels(
      Object.fromEntries(
        context.availableFormations.flatMap((formation) =>
          formation.parcours.flatMap((parcours) =>
            parcours.modules
              .filter((module) => module.assessment)
              .map((module) => [module.id, module.assessment!.level]),
          ),
        ),
      ),
    );
    const savedStep = context.profile.currentStep;
    const resumeKey =
      savedStep === "pace" || savedStep === "preferences"
        ? "learning"
        : savedStep;
    const resumeIndex = Math.max(
      0,
      steps.findIndex((step) => step.key === resumeKey),
    );
    setIndex(resumeIndex);
    setStarted(true);
    void learningProfileApi.update({
      action: "start",
      currentStep: steps[resumeIndex]?.key ?? steps[0]?.key ?? "",
    });
  }, [context, started, steps]);

  useEffect(() => {
    if (contentScrollRef.current) contentScrollRef.current.scrollTop = 0;
  }, [index]);

  if (query.isLoading) return <LearningChoiceCardsPlaceholder />;
  if (query.isError) {
    return (
      <AuthPageWrapper title="Personnalisons votre parcours">
        <div className="py-12 text-center">
          <p>Impossible de charger votre profil d’apprentissage.</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => void query.refetch()}
          >
            Réessayer
          </button>
        </div>
      </AuthPageWrapper>
    );
  }
  if (!context?.hasAvailableContent)
    return <Navigate to="/student/dashboard" replace />;
  if (!context.onboardingRequired || steps.length === 0) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const step = steps[index]!;
  const moduleCount = steps.filter((item) => item.kind === "module").length;
  const moduleNumber = steps
    .slice(0, index + 1)
    .filter((item) => item.kind === "module").length;
  const cannotContinue =
    saving ||
    (step.kind === "learning" && (!pace || preferences.length === 0)) ||
    (step.kind === "module" && (!step.moduleId || !levels[step.moduleId]));
  const formation =
    context.availableFormations.find((item) =>
      item.parcours.some((parcours) =>
        parcours.modules.some((module) => module.id === step.moduleId),
      ),
    ) ?? context.availableFormations[0];
  const parcours =
    formation?.parcours.find((item) =>
      item.modules.some((module) => module.id === step.moduleId),
    ) ?? formation?.parcours[0];
  const module = parcours?.modules.find((item) => item.id === step.moduleId);

  const continueToNext = async () => {
    if (step.kind === "learning" && !pace) {
      toast.error("Choisissez un rythme pour continuer.");
      return;
    }
    if (step.kind === "learning" && preferences.length === 0) {
      toast.error("Choisissez au moins une préférence.");
      return;
    }
    if (step.kind === "module" && step.moduleId && !levels[step.moduleId]) {
      toast.error("Choisissez un niveau pour continuer.");
      return;
    }

    setSaving(true);
    try {
      if (step.kind === "learning" && pace)
        await learningProfileApi.update({ pace, preferences });
      if (step.kind === "module" && step.moduleId) {
        await learningProfileApi.updateModule(
          step.moduleId,
          levels[step.moduleId]!,
        );
      }
      const next = steps[index + 1];
      if (
        step.kind === "profile" &&
        profileItemsChanged &&
        profileInformation
      ) {
        const payload = new FormData();
        payload.append(
          "data",
          JSON.stringify({
            user: { ...profileInformation, hobbies, links },
          }),
        );
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
    <section className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-3 px-1 pt-4 pb-[9px]">
      {parcours ? (
        <header className="px-5 py-3 pr-24 sm:px-6 sm:pr-28">
          <h2 className="mt-1 text-2xl font-extrabold leading-tight text-base-content first-letter:uppercase sm:text-3xl">
            {capitalizeTitle(parcours.title)}
          </h2>
          <p className="mt-1.5 text-sm font-medium text-base-content/65 first-letter:uppercase">
            {capitalizeTitle(formation.title)}
          </p>
        </header>
      ) : null}

      <OnboardingProgressPanel
        contentKey={step.key}
        currentStep={index + 1}
        stepCount={steps.length}
        progressLabel="Progression du questionnaire"
        contentRef={contentScrollRef}
        footer={
          <div className="mt-4 flex shrink-0 justify-between gap-3 border-t border-base-300 pt-5">
            <button
              type="button"
              className="btn btn-ghost text-base normal-case"
              disabled={index === 0 || saving}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            >
              Précédent
            </button>
            {step.kind === "summary" ? (
              <button
                type="button"
                className="btn btn-primary text-base normal-case"
                disabled={saving}
                onClick={() => void confirm()}
              >
                {saving ? (
                  <span
                    className="loading loading-spinner loading-sm"
                    aria-label="Confirmation en cours"
                  />
                ) : (
                  "Confirmer"
                )}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary text-base normal-case disabled:cursor-not-allowed disabled:border-base-300 disabled:bg-base-300 disabled:text-base-content/45 disabled:shadow-none"
                disabled={cannotContinue}
                onClick={() => void continueToNext()}
              >
                Continuer
              </button>
            )}
          </div>
        }
      >
        {step.kind === "learning" ? (
          <div className="space-y-7">
            <section
              className="space-y-4"
              aria-labelledby="learning-pace-title"
            >
              <div>
                <h1 id="learning-pace-title" className="text-2xl font-bold">
                  Quel rythme préférez-vous ?
                </h1>
                <p className="mt-2 text-sm leading-5 text-base-content/65">
                  Choisissez la proposition qui vous convient. Vous pourrez la
                  modifier plus tard.
                </p>
              </div>
              <SingleChoiceCards
                name="pace"
                options={paceOptions}
                value={pace}
                onChange={setPace}
                compact
              />
            </section>

            <section
              className="space-y-4"
              aria-labelledby="learning-preferences-title"
            >
              <div>
                <h2
                  id="learning-preferences-title"
                  className="text-2xl font-bold"
                >
                  Comment aimez-vous apprendre ?
                </h2>
                <p className="mt-2 text-sm leading-5 text-base-content/70">
                  Sélectionnez au moins une préférence.
                </p>
              </div>
              <PreferenceCards value={preferences} onChange={setPreferences} />
            </section>
          </div>
        ) : null}

        {step.kind === "module" && module ? (
          <div className="space-y-5">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="shrink-0 text-lg font-bold text-accent"
                  aria-label={`Module ${moduleNumber} sur ${moduleCount}`}
                >
                  {moduleNumber}/{moduleCount}
                </span>
                <h1 className="min-w-0 text-2xl font-bold">
                  Quel est votre niveau dans{" "}
                  <span className="font-extrabold text-primary">
                    {capitalizeTitle(module.title)}
                  </span>{" "}
                  ?
                </h1>
              </div>
            </div>
            <div className="pt-2">
              <LevelChoiceButtons
                name={`level-${module.id}`}
                value={levels[module.id] ?? null}
                onChange={(level) =>
                  setLevels((current) => ({
                    ...current,
                    [module.id]: level,
                  }))
                }
              />
            </div>
            {module.courses.length ? (
              <ul className="text-sm leading-5">
                {module.courses.map((course) => (
                  <li
                    key={course.title}
                    className="space-y-1.5 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="block font-semibold">
                      {capitalizeTitle(course.title)}
                    </span>
                    {course.tags.length ? (
                      <div className="flex flex-wrap gap-1">
                        {course.tags.map((tag) => (
                          <TagItem key={tag.id} tag={tag} noIcon compact />
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {step.kind === "profile" ? (
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              Souhaitez-vous en dire un peu plus ?
            </h1>
            <p className="flex min-h-10 items-end text-sm leading-5 text-base-content/65">
              <span>
                Cette étape est entièrement facultative. Vous pouvez la passer
                sans rien renseigner.
              </span>
            </p>
            <ProfileItemsEditor
              hobbies={hobbies}
              links={links}
              onHobbiesChange={(items) => {
                setHobbies(items);
                setProfileItemsChanged(true);
              }}
              onLinksChange={(items) => {
                setLinks(items);
                setProfileItemsChanged(true);
              }}
            />
          </div>
        ) : null}

        {step.kind === "theme" ? <ThemeSelectionStep /> : null}

        {step.kind === "summary" ? (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold">Votre profil</h1>
              <p className="mt-2 flex min-h-10 items-end text-sm leading-5 text-base-content/65">
                <span>
                  Vérifiez vos réponses avant de commencer. Vous pourrez les
                  modifier plus tard depuis votre profil.
                </span>
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex min-h-28 items-start gap-4 rounded-xl border border-primary bg-primary/10 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Gauge className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm text-base-content/65">Rythme</dt>
                  <dd className="mt-1 font-semibold">
                    {paceOptions.find((option) => option.value === pace)
                      ?.label ?? "Non renseigné"}
                  </dd>
                </div>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
                  <Check className="size-4" aria-hidden="true" />
                </span>
              </div>
              {context.availableFormations
                .flatMap((item) =>
                  item.parcours.flatMap((parcours) => parcours.modules),
                )
                .map((module) => (
                  <div
                    key={module.id}
                    className="flex min-h-28 items-start gap-4 rounded-xl border border-primary bg-primary/10 p-4"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <GraduationCap className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <dt className="text-sm text-base-content/65">
                        {capitalizeTitle(module.title)}
                      </dt>
                      <dd className="mt-1 font-semibold">
                        {levelOptions.find(
                          (option) => option.value === levels[module.id],
                        )?.label ?? "Non renseigné"}
                      </dd>
                    </div>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                ))}
              <div className="flex min-h-32 items-start gap-4 rounded-xl border border-primary bg-primary/10 p-4 sm:col-span-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Shapes className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm text-base-content/65">
                    Préférences d’apprentissage
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {preferenceOptions
                      .filter((option) => preferences.includes(option.value))
                      .map((option) => (
                        <span
                          key={option.value}
                          className="rounded-lg border border-primary/25 bg-base-100 px-3 py-2 text-sm font-semibold"
                        >
                          {option.label}
                        </span>
                      ))}
                  </dd>
                </div>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
                  <Check className="size-4" aria-hidden="true" />
                </span>
              </div>
            </dl>
          </div>
        ) : null}
      </OnboardingProgressPanel>
    </section>
  );
}
