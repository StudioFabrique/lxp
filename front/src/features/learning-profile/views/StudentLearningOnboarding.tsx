import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Gauge, GraduationCap, Shapes } from "lucide-react";
import TagItem from "../../../components/UI/tag-item/tag-item";
import AuthPageWrapper from "../../auth/components/AuthPageWrapper";
import { ThemeContext } from "../../../store/ThemeProvider";
import ProfileItemsEditor from "../../profile/components/information/ProfileItemsEditor";
import { profileApi } from "../../profile/api/profile.api";
import { themeLabels } from "../../../config/themes";
import type Hobby from "../../user/interfaces/hobby";
import type { Link } from "../../user/interfaces/link";
import { LearningChoiceCardsPlaceholder } from "../views/onboarding-placeholder";
import {
  levelOptions,
  paceOptions,
  preferenceOptions,
} from "../learning-choice-options";
import {
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
import { cn } from "../../../utils/cn";

type OnboardingStep = {
  key: string;
  label: string;
  kind: "pace" | "preferences" | "module" | "profile" | "theme" | "summary";
  moduleId?: number;
};

export default function StudentLearningOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { chooseTheme, availableLightThemes, availableDarkThemes } =
    useContext(ThemeContext);
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
  const [selectedThemes, setSelectedThemes] = useState(() => ({
    light: localStorage.getItem("lightTheme") ?? "classic",
    dark: localStorage.getItem("darkTheme") ?? "classic-dark",
  }));
  const reduceMotion = useReducedMotion();

  const steps = useMemo<OnboardingStep[]>(() => {
    if (!context) return [];
    if (!context.availableFormations.length) return [];
    const onboardingSteps: OnboardingStep[] = [];

    if (context.onboardingMode === "initial") {
      onboardingSteps.push({ key: "theme", label: "Apparence", kind: "theme" });
    }

    onboardingSteps.push(
      { key: "pace", label: "Rythme", kind: "pace" },
      { key: "preferences", label: "Préférences", kind: "preferences" },
    );

    for (const formation of context.availableFormations) {
      for (const parcours of formation.parcours) {
        for (const module of parcours.modules.filter((item) => context.onboardingMode === "initial" || !item.assessment)) {
          onboardingSteps.push({ key: `module:${module.id}`, label: module.title, kind: "module", moduleId: module.id });
        }
      }
    }
    onboardingSteps.push({ key: "profile", label: "À propos de vous", kind: "profile" });

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
    setPreferences(context.profile.preferences);
    setLevels(
      Object.fromEntries(
        context.availableFormations.flatMap((formation) => formation.parcours.flatMap((parcours) => parcours.modules
          .filter((module) => module.assessment)
          .map((module) => [module.id, module.assessment!.level]))),
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
  const formation = context.availableFormations.find((item) => item.parcours.some((parcours) => parcours.modules.some((module) => module.id === step.moduleId))) ?? context.availableFormations[0];
  const parcours = formation?.parcours.find((item) => item.modules.some((module) => module.id === step.moduleId)) ?? formation?.parcours[0];
  const module = parcours?.modules.find((item) => item.id === step.moduleId);

  const continueToNext = async () => {
    if (step.kind === "pace" && !pace) {
      toast.error("Choisissez un rythme pour continuer.");
      return;
    }
    if (step.kind === "preferences" && preferences.length === 0) {
      toast.error("Choisissez au moins une préférence.");
      return;
    }
    if (
      step.kind === "module" &&
      step.moduleId &&
      !levels[step.moduleId]
    ) {
      toast.error("Choisissez un niveau pour continuer.");
      return;
    }

    setSaving(true);
    try {
      if (step.kind === "pace" && pace)
        await learningProfileApi.update({ pace });
      if (step.kind === "preferences")
        await learningProfileApi.update({ preferences });
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
    <section className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-3 px-1 pt-8 pb-[9px]">
      {parcours ? (
        <header className="px-5 py-3 sm:px-6">
          <h2 className="mt-1 text-2xl font-extrabold leading-tight text-secondary first-letter:uppercase sm:text-3xl">
            {parcours.title}
          </h2>
          <p className="mt-1.5 text-sm font-medium text-base-content/65 first-letter:uppercase">
            {formation.title}
          </p>
        </header>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={step.key}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: "easeOut" }}
          className={cn("flex min-h-0 w-full flex-1 flex-col overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm", step.kind === "module" ? "sm:p-5" : "sm:p-7")}
        >
          {step.kind === "pace" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">
                Quel rythme préférez-vous ?
              </h1>
              <p className="text-sm text-base-content/65">
                Choisissez la proposition qui vous convient. Vous pourrez la
                modifier plus tard.
              </p>
              <SingleChoiceCards
                name="pace"
                options={paceOptions}
                value={pace}
                onChange={setPace}
              />
            </div>
          ) : null}

          {step.kind === "preferences" ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold">
                Comment aimez-vous apprendre ?
              </h1>
              <p className="text-sm text-base-content/70">
                Sélectionnez au moins une préférence. Les mots clés ci-dessous
                vous aident à choisir comment aborder les contenus.
              </p>
              <PreferenceCards value={preferences} onChange={setPreferences} />
            </div>
          ) : null}

          {step.kind === "module" && module ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">
                  Quel est votre niveau dans « {module.title} » ?
                </h1>
                <p className="mt-1 text-sm text-base-content/65">
                  Appuyez-vous sur les cours et leurs tags pour vous situer.
                </p>
              </div>
              {module.courses.length ? (
                <div>
                  <p className="mb-1 text-sm font-semibold">
                    Cours du module
                  </p>
                  <ul className="space-y-1 text-sm leading-5">
                    {module.courses.map((course) => (
                      <li
                        key={course.title}
                        className="space-y-1"
                      >
                        <span className="font-medium">{course.title}</span>
                        <div className="flex flex-wrap gap-1.5">{course.tags.map((tag) => <TagItem key={tag.id} tag={tag} noIcon />)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <SingleChoiceCards
                name={`level-${module.id}`}
                options={levelOptions}
                value={levels[module.id] ?? null}
                onChange={(level) =>
                  setLevels((current) => ({
                    ...current,
                    [module.id]: level,
                  }))
                }
                compact
              />
            </div>
          ) : null}

          {step.kind === "profile" ? (
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                Souhaitez-vous en dire un peu plus ?
              </h1>
              <p className="text-sm text-base-content/65">
                Cette étape est entièrement facultative. Vous pouvez la passer
                sans rien renseigner.
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

          {step.kind === "theme" ? (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">Choisissez votre thème</h1>
                <p className="mt-2 text-sm text-base-content/65">
                  Personnalisez les modes clair et sombre. Vous pourrez toujours
                  les modifier depuis votre profil.
                </p>
              </div>
              {(
                [
                  ["light", "Thèmes clairs", availableLightThemes],
                  ["dark", "Thèmes sombres", availableDarkThemes],
                ] as const
              ).map(([mode, label, themeList]) => (
                <section key={mode}>
                  <h2 className="mb-2 text-sm font-bold">{label}</h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {themeList.map((themeName) => {
                      const selected = selectedThemes[mode] === themeName;
                      return (
                        <button
                          key={themeName}
                          type="button"
                          data-theme={themeName}
                          aria-pressed={selected}
                          onClick={() => {
                            chooseTheme(themeName, mode);
                            setSelectedThemes((current) => ({
                              ...current,
                              [mode]: themeName,
                            }));
                          }}
                          className={cn("group flex min-w-0 items-center gap-2 rounded-xl border bg-base-300 p-3 text-left shadow-sm transition hover:-translate-y-0.5", selected ? "border-primary ring-2 ring-primary/25" : "border-base-300")}
                        >
                          <span className="flex size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-base-content/20">
                            <span className="h-full w-1/2 bg-primary" />
                            <span className="h-full w-1/2 bg-secondary" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-base-content">
                            {themeLabels[themeName] ?? themeName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {step.kind === "summary" ? (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Votre profil</h1>
                <p className="mt-2 text-sm text-base-content/65">
                  Vérifiez vos réponses avant de commencer. Vous pourrez les
                  modifier plus tard depuis votre profil.
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
                {context.availableFormations.flatMap((item) => item.parcours.flatMap((parcours) => parcours.modules)).map((module) => (
                  <div key={module.id} className="flex min-h-28 items-start gap-4 rounded-xl border border-primary bg-primary/10 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <GraduationCap className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <dt className="text-sm text-base-content/65">{module.title}</dt>
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

          <div
            className={cn("mt-auto flex justify-between gap-3 border-t border-base-300", step.kind === "module" ? "pt-4" : "pt-5")}
          >
            <button
              type="button"
              className="btn btn-ghost"
              disabled={index === 0 || saving}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            >
              Précédent
            </button>
            {step.kind === "summary" ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving}
                onClick={() => void confirm()}
              >
                {saving ? <span className="loading loading-spinner loading-sm" aria-label="Confirmation en cours" /> : "Confirmer"}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving}
                onClick={() => void continueToNext()}
              >
                Continuer
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </section>
  );
}
