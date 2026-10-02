import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";
import {
  onboardingStepSchema,
  type OnboardingValues,
} from "../onboarding.schema";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  LoaderCircle,
  ArrowRight,
  Rocket,
  UsersRound,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { ThemeContext } from "../../../store/ThemeProvider";
import TagItem from "../../../components/UI/tag-item/tag-item";
import AuthPageWrapper from "../../auth/components/AuthPageWrapper";
import ProfileItemsEditor from "../../profile/components/information/ProfileItemsEditor";
import { profileApi } from "../../profile/api/profile.api";
import ThemeSelectionStep from "../ThemeSelectionStep";
import { LearningChoiceCardsPlaceholder } from "../views/onboarding-placeholder";
import { paceOptions, preferenceOptions } from "../learning-choice-options";
import {
  LevelChoiceButtons,
  PreferenceCards,
  SingleChoiceCards,
} from "../LearningChoiceCards";
import {
  learningProfileApi,
  learningProfileKey,
} from "../learning-profile.api";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import { cn } from "../../../utils/cn";

type OnboardingStep = {
  key: string;
  label: string;
  kind: "pace" | "preferences" | "module" | "profile" | "theme";
  moduleId?: number;
};

const capitalizeTitle = (title: string) =>
  title.charAt(0).toLocaleUpperCase("fr-FR") + title.slice(1);

const availablePreferenceValues = new Set(
  preferenceOptions.map(({ value }) => value),
);

export default function StudentLearningOnboarding() {
  const { theme } = useContext(ThemeContext);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
  });
  const context = query.data;
  const [index, setIndex] = useState(0);
  const steps = useMemo<OnboardingStep[]>(() => {
    if (!context) return [];
    if (!context.availableFormations.length) return [];
    const onboardingSteps: OnboardingStep[] = [];

    if (context.onboardingMode === "initial") {
      onboardingSteps.push({ key: "theme", label: "Apparence", kind: "theme" });
      onboardingSteps.push({
        key: "pace",
        label: "Votre rythme",
        kind: "pace",
      });
      onboardingSteps.push({
        key: "preferences",
        label: "Vos méthodes d’apprentissage",
        kind: "preferences",
      });
    }

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
    if (context.onboardingMode === "initial") {
      onboardingSteps.push({
        key: "profile",
        label: "À propos de vous",
        kind: "profile",
      });
    }
    return onboardingSteps;
  }, [context]);

  const activeStep = steps[index];
  const schema = onboardingStepSchema(
    activeStep?.kind ?? "theme",
    activeStep?.moduleId,
  );
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      pace: null,
      preferences: [],
      levels: {},
      hobbies: [],
      links: [],
    },
  });
  const [pace, setPace] = useFormField(form, "pace");
  const [preferences, setPreferences] = useFormField(form, "preferences");
  const [levels, setLevels] = useFormField(form, "levels");
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [welcomeStarted, setWelcomeStarted] = useState(false);
  const [hobbies, setHobbies] = useFormField(form, "hobbies");
  const [links, setLinks] = useFormField(form, "links");
  const [profileInformation, setProfileInformation] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [profileItemsChanged, setProfileItemsChanged] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    profileApi.queries
      .getInformation()
      .then(({ data }) => {
        setProfileInformation(data);
        setHobbies(data.hobbies ?? []);
        setLinks(data.links ?? []);
      })
      .catch(() => undefined);
  }, [setHobbies, setLinks]);

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
      savedStep === "learning"
        ? "pace"
        : savedStep === "summary"
          ? "profile"
          : savedStep;
    const resumeIndex = Math.max(
      0,
      steps.findIndex((step) => step.key === resumeKey),
    );
    setIndex(resumeIndex);
    setStarted(true);
    const resumingAdditional =
      context.onboardingMode === "additional" &&
      steps.some((step) => step.key === savedStep);
    if (resumingAdditional) setWelcomeStarted(true);
    if (
      resumingAdditional ||
      (context.onboardingMode === "initial" && savedStep)
    ) {
      void learningProfileApi.update({
        action: "start",
        currentStep: steps[resumeIndex]?.key ?? steps[0]?.key ?? "",
      });
    }
  }, [context, started, steps, setPace, setPreferences, setLevels]);

  useEffect(() => {
    if (
      reduceMotion ||
      context?.onboardingMode !== "initial" ||
      !context.onboardingRequired ||
      context.profile.currentStep
    )
      return;
    const timer = window.setTimeout(() => setIntroFinished(true), 900);
    return () => window.clearTimeout(timer);
  }, [
    context?.onboardingMode,
    context?.onboardingRequired,
    context?.profile.currentStep,
    reduceMotion,
  ]);

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

  const showIntro =
    context.onboardingMode === "initial" &&
    !context.profile.currentStep &&
    !welcomeStarted &&
    !reduceMotion &&
    !introFinished;
  const isAdditional = context.onboardingMode === "additional";
  const showWelcome =
    !welcomeStarted &&
    !showIntro &&
    (isAdditional || !context.profile.currentStep);
  const welcomeFormations = isAdditional
    ? context.availableFormations
        .map((formation) => ({
          ...formation,
          parcours: formation.parcours.filter((entry) =>
            entry.modules.some((module) => !module.assessment),
          ),
        }))
        .filter((formation) => formation.parcours.length > 0)
    : context.availableFormations;
  const pendingParcours = welcomeFormations.flatMap(
    (formation) => formation.parcours,
  );
  const welcomeGroupNames = Array.from(new Set(
    pendingParcours.some((entry) => entry.groupNames !== undefined)
      ? pendingParcours.flatMap((entry) => entry.groupNames ?? [])
      : context.groupNames,
  ));
  // An assessed module identifies a parcours the student has already started.
  const newParcoursCount = pendingParcours.filter((entry) =>
    entry.modules.every((module) => !module.assessment),
  ).length;
  const addedModuleCount = pendingParcours
    .filter((entry) => entry.modules.some((module) => module.assessment))
    .reduce(
      (count, entry) =>
        count + entry.modules.filter((module) => !module.assessment).length,
      0,
    );
  const additionalWelcome =
    newParcoursCount === 0
      ? {
          title:
            addedModuleCount > 1
              ? "De nouveaux modules vous attendent"
              : "Un nouveau module vous attend",
          description:
            addedModuleCount > 1
              ? "De nouveaux modules ont été ajoutés à vos parcours."
              : "Un nouveau module a été ajouté à votre parcours.",
          button:
            addedModuleCount > 1
              ? "Découvrir les modules"
              : "Découvrir le module",
        }
      : addedModuleCount > 0
        ? {
            title: "De nouveaux contenus vous attendent",
            description:
              "Vous avez été ajouté à de nouveaux parcours et de nouveaux modules sont disponibles dans vos parcours actuels.",
            button: "Découvrir les nouveautés",
          }
        : {
            title:
              newParcoursCount > 1
                ? "De nouveaux parcours vous attendent"
                : "Un nouveau parcours vous attend",
            description:
              newParcoursCount > 1
                ? "Vous avez été ajouté à de nouveaux parcours."
                : "Vous avez été ajouté à un nouveau parcours.",
            button:
              newParcoursCount > 1
                ? "Découvrir mes parcours"
                : "Découvrir mon parcours",
          };
  const welcomeTags = Array.from(
    new Map(
      welcomeFormations.flatMap((formation) =>
        formation.parcours.flatMap((entry) =>
          entry.tags.map((tag) => [tag.id, tag] as const),
        ),
      ),
    ).values(),
  ).slice(0, 5);

  const begin = async () => {
    setSaving(true);
    try {
      await learningProfileApi.update({
        action: "start",
        currentStep: steps[index]?.key ?? steps[0].key,
      });
      setWelcomeStarted(true);
    } catch {
      toast.error("Impossible de démarrer votre accueil.");
    } finally {
      setSaving(false);
    }
  };

  const step = steps[index]!;
  const moduleCount = steps.filter((item) => item.kind === "module").length;
  const moduleNumber = steps
    .slice(0, index + 1)
    .filter((item) => item.kind === "module").length;
  const cannotContinue =
    saving ||
    (step.kind === "pace" && !pace) ||
    (step.kind === "preferences" && preferences.length === 0) ||
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

  const completeOnboarding = async () => {
    await learningProfileApi.update({ action: "confirm" });
    await queryClient.invalidateQueries({ queryKey: learningProfileKey });
    toast.success("Votre profil d’apprentissage est prêt.");
    navigate("/student/dashboard", { replace: true });
  };

  const continueToNext = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      if (step.kind === "pace")
        await learningProfileApi.update({ pace: values.pace! });
      if (step.kind === "preferences")
        await learningProfileApi.update({ preferences: values.preferences });
      if (step.kind === "module" && step.moduleId) {
        await learningProfileApi.updateModule(
          step.moduleId,
          values.levels[step.moduleId]!,
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
            user: {
              ...profileInformation,
              hobbies: values.hobbies,
              links: values.links,
            },
          }),
        );
        await profileApi.mutations.updateInformation(payload);
        setProfileItemsChanged(false);
      }
      if (next) {
        await learningProfileApi.update({ currentStep: next.key });
        setIndex(index + 1);
      } else {
        await completeOnboarding();
      }
    } catch {
      toast.error("Cette étape n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  }, showFormErrors);

  return (
    <LayoutGroup>
      <section className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-3 px-1 pt-4 pb-[9px]">
        {context.onboardingMode === "initial" && (
          <motion.div
            layout
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              cn(showIntro
                ? "my-auto flex flex-col items-center gap-2 text-center"
                : showWelcome
                  ? "mb-5 mt-[clamp(2.5rem,7vh,6rem)] flex flex-col items-center gap-2 text-center"
                  : "mb-3 flex flex-col items-center gap-2 text-center")
            }
          >
            <motion.img
              className="h-auto w-56"
              src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
              alt="logo ANDRIA"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 5,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <span className="mt-2 max-w-xs text-xs font-semibold text-base-content">
              Apprentissage Numérique &amp; Développement Renforcé par
              Intelligence Artificielle
            </span>
          </motion.div>
        )}
        {showIntro ? null : showWelcome ? (
          <motion.section
            className={cn("flex w-full flex-1 flex-col text-center", isAdditional ? "mb-[clamp(1rem,6vh,3rem)] overflow-y-auto py-5" : "")}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <div className="mx-auto w-full max-w-md">
              <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
                {isAdditional ? (
                  additionalWelcome.title
                ) : (
                  <>
                    Bienvenue sur{" "}
                    <span
                      style={{
                        color:
                          "color-mix(in oklab, var(--color-primary) 15%, var(--color-base-content))",
                      }}
                    >
                      ANDRIA
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-2 text-sm leading-5 text-base-content/70 sm:text-base sm:leading-6">
                {isAdditional
                  ? `${additionalWelcome.description} Indiquez votre niveau dans les nouveaux modules pour adapter votre apprentissage.`
                  : "Votre parcours commence ici. Personnalisez votre expérience d'apprentissage."}
              </p>
            </div>
            <div
              className={
                cn(isAdditional ? "flex flex-1 flex-col justify-center" : "")
              }
            >
              <div className="mx-auto w-full max-w-md">
                <dl className="mx-auto mt-5 flex w-full flex-col gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <Rocket className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <dt className="text-base font-medium text-base-content/60">Vos parcours</dt>
                      <dd className="mt-2">
                        <ul className="flex flex-wrap gap-1.5 text-lg font-semibold leading-6 text-base-content" aria-label="Vos parcours">
                          {pendingParcours.map((entry) => (
                            <li key={entry.id} className="min-w-0 max-w-full rounded-md border border-base-content/15 bg-base-100/50 px-2.5 py-1">
                              <span className="break-words">{capitalizeTitle(entry.title)}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </div>
                  {welcomeGroupNames.length > 0 && (
                    <div className="flex items-start gap-3">
                      <UsersRound className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <dt className="text-base font-medium text-base-content/60">Vos groupes</dt>
                        <dd className="mt-2">
                          <ul className="flex flex-wrap gap-1.5 text-lg font-semibold leading-6 text-base-content" aria-label="Vos groupes">
                            {welcomeGroupNames.map((name) => (
                              <li key={name} className="min-w-0 max-w-full rounded-md border border-base-content/15 bg-base-100/50 px-2.5 py-1">
                                <span className="break-words">{capitalizeTitle(name)}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
                {welcomeTags.length > 0 && (
                  <ul
                    aria-label="Tags du parcours"
                    className={cn("flex flex-wrap justify-center gap-2", isAdditional ? "mt-4 sm:mt-5" : "mt-5 sm:mt-6")}
                  >
                    {welcomeTags.map((tag, tagIndex) => (
                      <motion.li
                        key={tag.id}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: 8, scale: 0.94 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.3,
                          delay: reduceMotion ? 0 : 0.35 + tagIndex * 0.12,
                        }}
                      >
                        <TagItem tag={tag} noIcon compact />
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary mx-auto mt-5 shrink-0 w-full max-w-xs gap-2 rounded-lg sm:mt-6 sm:min-h-12 sm:max-w-sm sm:text-base"
              disabled={saving}
              onClick={() => void begin()}
            >
              {isAdditional ? additionalWelcome.button : "Commencer"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </motion.section>
        ) : (
          <motion.form
            onSubmit={continueToNext}
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <AnimatePresence initial={false}>
              {parcours && moduleNumber === 0 ? (
                <motion.header
                  key="course-heading"
                  className="shrink-0 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      duration: reduceMotion ? 0 : 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: { duration: reduceMotion ? 0 : 0.2 },
                  }}
                >
                  <div className="px-5 pt-3 pb-6 pr-24 sm:px-6 sm:pr-28">
                    <h2 className="mt-1 text-2xl font-extrabold leading-tight text-base-content first-letter:uppercase sm:text-3xl">
                      {capitalizeTitle(parcours.title)}
                    </h2>
                    <p className="mt-1.5 text-sm font-medium text-base-content/65 first-letter:uppercase">
                      {capitalizeTitle(formation.title)}
                    </p>
                  </div>
                </motion.header>
              ) : null}
            </AnimatePresence>

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
                    disabled={(index === 0 && !welcomeStarted) || saving}
                    onClick={() => {
                      if (index === 0) setWelcomeStarted(false);
                      else setIndex((current) => current - 1);
                    }}
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-base normal-case disabled:cursor-not-allowed disabled:border-base-300 disabled:bg-base-300 disabled:text-base-content/45 disabled:shadow-none"
                    disabled={cannotContinue}
                  >
                    {saving && index === steps.length - 1 ? (
                      <LoaderCircle
                        className="size-4 animate-spin"
                        aria-label="Confirmation en cours"
                      />
                    ) : index === steps.length - 1 ? (
                      "Terminer"
                    ) : (
                      "Continuer"
                    )}
                  </button>
                </div>
              }
            >
              {step.kind === "pace" ? (
                <section
                  className="space-y-4"
                  aria-labelledby="learning-pace-title"
                >
                  <div>
                    <h1 id="learning-pace-title" className="text-2xl font-bold">
                      Quel rythme préférez-vous ?
                    </h1>
                    <p className="mt-2 text-sm leading-5 text-base-content/65">
                      Choisissez la proposition qui vous convient. Vous pourrez
                      la modifier plus tard.
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
              ) : null}

              {step.kind === "preferences" ? (
                <section
                  className="space-y-4"
                  aria-labelledby="learning-preferences-title"
                >
                  <div>
                    <h1
                      id="learning-preferences-title"
                      className="text-2xl font-bold"
                    >
                      Quelles méthodes vous aident à apprendre ?
                    </h1>
                    <p className="mt-2 text-sm leading-5 text-base-content/70">
                      Choisissez les approches qui vous aident à comprendre et à
                      progresser.
                    </p>
                  </div>
                  <PreferenceCards
                    value={preferences}
                    onChange={setPreferences}
                  />
                </section>
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
                  <div>
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
                                <TagItem
                                  key={tag.id}
                                  tag={tag}
                                  noIcon
                                  compact
                                />
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
                      Cette étape est entièrement facultative. Vous pouvez la
                      passer sans rien renseigner.
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
            </OnboardingProgressPanel>
          </motion.form>
        )}
      </section>
    </LayoutGroup>
  );
}
