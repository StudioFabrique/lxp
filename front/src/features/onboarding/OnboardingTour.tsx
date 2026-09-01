import {
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { EVENTS, Joyride, type Step } from "react-joyride";
import toast from "react-hot-toast";

import { AuthContext } from "../../store/AuthProvider";
import type {
  OnboardingStatus,
  UserOnboarding,
} from "../../utils/interfaces/user";
import OnboardingTooltip, {
  type OnboardingTooltipData,
} from "./OnboardingTooltip";
import OnboardingStopConfirmation from "./OnboardingStopConfirmation";
import { OnboardingContext } from "./OnboardingContext";
import {
  subscribeToOnboardingEvents,
  type OnboardingEventDetail,
} from "./onboarding-events";
import { useDemoMode } from "../../store/DemoContext";

type Layout = "admin" | "student";

type StageRequirement = {
  selector: string;
  label: string;
  invalidValues?: string[];
  highlightSelector?: string;
};

type StageDefinition = {
  target: string;
  title: string;
  content: string;
  placement?: Step["placement"];
  waitingForAction?: boolean;
  next?: string;
  previous?: string;
  nextLabel?: string;
  requirements?: StageRequirement[];
  index: number;
  total: number;
};

const invalidLabelClasses = ["text-info"];

const getRequirementElement = (requirement: StageRequirement) =>
  document.querySelector<HTMLElement>(requirement.selector);

const getRequirementHighlightElement = (requirement: StageRequirement) =>
  requirement.highlightSelector
    ? document.querySelector<HTMLElement>(requirement.highlightSelector)
    : null;

const isRequirementMet = (requirement: StageRequirement) => {
  const element = getRequirementElement(requirement);
  if (!element) return false;

  if (element.dataset.onboardingValid !== undefined) {
    return element.dataset.onboardingValid === "true";
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  ) {
    const value = element.value.trim();
    return (
      value.length > 0 && !(requirement.invalidValues ?? []).includes(value)
    );
  }

  return Boolean(element.textContent?.trim());
};

const getMissingRequirements = (
  requirements: StageRequirement[] = [],
  revision?: number,
) => {
  void revision;
  return requirements.filter((requirement) => !isRequirementMet(requirement));
};

const clearRequirementHighlights = (requirements: StageRequirement[] = []) => {
  requirements.forEach((requirement) => {
    getRequirementHighlightElement(requirement)?.classList.remove(
      ...invalidLabelClasses,
    );
  });
};

const splitToken = (token: string) => {
  const separator = token.indexOf(":");
  return separator === -1
    ? { stage: token, contextId: undefined }
    : {
        stage: token.slice(0, separator),
        contextId: Number(token.slice(separator + 1)) || undefined,
      };
};

const withContext = (stage: string, contextId?: number) =>
  contextId ? `${stage}:${contextId}` : stage;

const getResumableToken = (token: string) => {
  const { stage, contextId } = splitToken(token);
  const resumableStage: Record<string, string> = {
    "admin-module-form": "admin-module-title",
    "admin-course-details": "admin-course-create",
    "admin-lesson-details": "admin-lesson-create",
    "admin-activity-type": "admin-activity-create",
    "admin-text-editor": "admin-activity-create",
  };

  return withContext(resumableStage[stage] ?? stage, contextId);
};

const adminStages: Record<string, Omit<StageDefinition, "total">> = {
  "admin-navigation": {
    target: '[data-onboarding="sidebar-navigation"]',
    title: "Votre barre de navigation",
    content:
      "La barre latérale donne accès au tableau de bord et aux espaces de gestion de vos parcours, utilisateurs et ressources.",
    placement: "right",
    next: "admin-dashboard",
    index: 1,
  },
  "admin-dashboard": {
    target: '[data-onboarding="admin-dashboard-header"]',
    title: "Votre tableau de bord",
    content:
      "Le tableau de bord rassemble vos derniers parcours, vos modules et les actions utiles pour administrer la plateforme.",
    placement: "bottom",
    previous: "admin-navigation",
    next: "admin-formation-entry",
    index: 2,
  },
  "admin-formation-entry": {
    target: '[data-onboarding="dashboard-formation-create-entry"]',
    title: "Créez votre première formation",
    content:
      'Cliquez sur "Créer une formation" pour ouvrir le formulaire : le guide vous accompagnera ensuite à chaque étape.',
    placement: "top",
    waitingForAction: true,
    previous: "admin-dashboard",
    index: 3,
  },
  "admin-formation-fields": {
    target: '[data-onboarding="formation-fields"]',
    title: "Votre première formation",
    content:
      "Une formation est le plus haut niveau de vos contenus. Donnez-lui un nom, un niveau et au moins un tag. La description et le code RNCP restent facultatifs.",
    placement: "right",
    next: "admin-formation-save",
    previous: "admin-formation-entry",
    nextLabel: "J’ai compris",
    requirements: [
      {
        selector: '[data-onboarding-field="formation-title"]',
        label: "le nom de la formation",
        highlightSelector: '[data-onboarding-label="formation-title"]',
      },
      {
        selector: '[data-onboarding-field="formation-level"]',
        label: "le niveau de la formation",
        highlightSelector: '[data-onboarding-label="formation-level"]',
      },
      {
        selector: '[data-onboarding-field="formation-tags"]',
        label: "au moins un tag",
        highlightSelector: '[data-onboarding-field="formation-tags"] label',
      },
    ],
    index: 4,
  },
  "admin-formation-save": {
    target: '[data-onboarding="formation-save"]',
    title: "Enregistrez la formation",
    content:
      "Lorsque les informations sont prêtes, utilisez ce bouton. Le guide reprendra automatiquement dès que la formation sera créée.",
    placement: "top",
    waitingForAction: true,
    previous: "admin-formation-fields",
    index: 5,
  },
  "admin-parcours-create": {
    target: '[data-onboarding="parcours-create"]',
    title: "Créez un parcours",
    content:
      "Le parcours organise l’expérience d’un groupe d’apprenants. La formation créée est déjà sélectionnée : saisissez simplement un titre puis cliquez sur Créer.",
    placement: "right",
    waitingForAction: true,
    requirements: [
      {
        selector: '[data-onboarding="parcours-create"] select[name="menu"]',
        label: "la formation associée",
        invalidValues: ["0"],
      },
      {
        selector: '[data-onboarding-field="parcours-title"]',
        label: "le titre du parcours",
        highlightSelector:
          '[data-onboarding="parcours-create"] label[for="title"]',
      },
    ],
    index: 6,
  },
  "admin-parcours-info": {
    target: '[data-onboarding="parcours-essential-information"]',
    title: "Complétez les informations",
    content:
      "Vérifiez le titre du parcours et ajoutez une description si nécessaire. Ces informations se sauvegardent automatiquement ; les autres réglages pourront être complétés plus tard.",
    placement: "right",
    next: "admin-module-title",
    nextLabel: "Créer un module",
    requirements: [
      {
        selector:
          '[data-onboarding="parcours-essential-information"] input[name="title"]',
        label: "le titre du parcours",
        highlightSelector:
          '[data-onboarding="parcours-essential-information"] label[for="title"]',
      },
    ],
    index: 7,
  },
  "admin-module-title": {
    target: '[data-onboarding="module-title-field"]',
    title: "Nommez votre module",
    content:
      "Un module regroupe plusieurs cours. Commencez par saisir un titre clair pour l’identifier facilement.",
    placement: "right",
    previous: "admin-parcours-info",
    next: "admin-module-description",
    requirements: [
      {
        selector: '[data-onboarding="module-form"] input[name="title"]',
        label: "le titre du module",
        highlightSelector: '[data-onboarding="module-form"] label[for="title"]',
      },
    ],
    index: 8,
  },
  "admin-module-description": {
    target: '[data-onboarding="module-description-field"]',
    title: "Décrivez le module",
    content:
      "La description présente le contenu et les objectifs du module. Elle reste facultative et pourra être complétée plus tard.",
    placement: "right",
    previous: "admin-module-title",
    next: "admin-module-quiz-instructions",
    index: 9,
  },
  "admin-module-quiz-instructions": {
    target: '[data-onboarding="module-quiz-instructions-field"]',
    title: "Préparez les futurs quiz",
    content:
      "Ces instructions guideront la génération des quiz du module. Ce champ est primordial.",
    placement: "right",
    previous: "admin-module-description",
    next: "admin-module-duration",
    index: 10,
  },
  "admin-module-duration": {
    target: '[data-onboarding="module-duration-field"]',
    title: "Indiquez la durée",
    content:
      "Saisissez la durée estimée du module en heures. Elle doit être supérieure à zéro.",
    placement: "right",
    previous: "admin-module-quiz-instructions",
    next: "admin-module-save",
    requirements: [
      {
        selector: '[data-onboarding="module-form"] input[name="duration"]',
        label: "la durée du module",
        invalidValues: ["0"],
        highlightSelector:
          '[data-onboarding="module-form"] label[for="duration"]',
      },
    ],
    index: 11,
  },
  "admin-module-save": {
    target: '[data-onboarding="module-save"]',
    title: "Enregistrez le module",
    content:
      "L’image, les ressources et les compétences sont facultatives. Enregistrez maintenant le module sans ouvrir les drawers associés.",
    placement: "top",
    waitingForAction: true,
    previous: "admin-module-duration",
    requirements: [
      {
        selector: '[data-onboarding="module-form"] input[name="title"]',
        label: "le titre du module",
        highlightSelector: '[data-onboarding="module-form"] label[for="title"]',
      },
      {
        selector: '[data-onboarding="module-form"] input[name="duration"]',
        label: "la durée du module",
        invalidValues: ["0"],
        highlightSelector:
          '[data-onboarding="module-form"] label[for="duration"]',
      },
    ],
    index: 12,
  },
  "admin-course-create": {
    target: '[data-onboarding="course-create"]',
    title: "Ajoutez un cours",
    content:
      "Les cours structurent les leçons d’un module. Cliquez sur Ajouter un cours, saisissez un titre, puis validez pour ouvrir les informations détaillées.",
    placement: "right",
    waitingForAction: true,
    index: 13,
  },
  "admin-course-details": {
    target: '[data-onboarding="course-details"]',
    title: "Préparez le cours",
    content:
      "Ajoutez une description et au moins un tag. Vous pouvez aussi préparer des titres de leçons, mais nous allons en créer une ensemble juste après.",
    placement: "left",
    waitingForAction: true,
    requirements: [
      {
        selector: '[data-onboarding-field="course-title"]',
        label: "le titre du cours",
        highlightSelector: '[data-onboarding-label="course-title"]',
      },
      {
        selector: '[data-onboarding-field="course-tags"]',
        label: "au moins un tag pour le cours",
        highlightSelector: '[data-onboarding-label="course-tags"]',
      },
    ],
    index: 14,
  },
  "admin-lesson-create": {
    target: '[data-onboarding="lesson-create"]',
    title: "Ajoutez une leçon",
    content:
      "Ce bouton ajoute une leçon au cours que vous venez de créer. Une leçon contient les activités consultées par les apprenants.",
    placement: "right",
    waitingForAction: true,
    index: 15,
  },
  "admin-lesson-details": {
    target: '[data-onboarding="lesson-details"]',
    title: "Décrivez la leçon",
    content:
      "Saisissez un titre, choisissez le tag du cours et précisez la modalité. La description aide les apprenants à comprendre l’objectif de la leçon.",
    placement: "left",
    waitingForAction: true,
    requirements: [
      {
        selector: '[data-onboarding-field="lesson-title"]',
        label: "le titre de la leçon",
        highlightSelector: '[data-onboarding-label="lesson-title"]',
      },
      {
        selector: '[data-onboarding-field="lesson-tag"]',
        label: "le tag de la leçon",
        highlightSelector: '[data-onboarding-label="lesson-tag"]',
      },
    ],
    index: 16,
  },
  "admin-activity-create": {
    target: '[data-onboarding="activity-create"]',
    title: "Créez une activité",
    content:
      "Une activité est l’unité de contenu affichée aux apprenants. Cliquez ici pour choisir son format.",
    placement: "right",
    waitingForAction: true,
    index: 17,
  },
  "admin-activity-type": {
    target: '[data-onboarding="activity-type-text"]',
    title: "Choisissez l’activité texte",
    content:
      "Andria accepte aussi les images, vidéos, ressources et contenus interactifs. Pour ce premier contenu, choisissez Texte.",
    placement: "bottom",
    waitingForAction: true,
    previous: "admin-activity-create",
    index: 18,
  },
  "admin-text-editor": {
    target: '[data-onboarding="text-editor"]',
    title: "Rédigez votre première activité",
    content:
      "Donnez un titre à l’activité, saisissez quelques lignes et explorez la barre de mise en forme. Le bouton d’enregistrement apparaît dès que l’éditeur contient du texte.",
    placement: "top",
    waitingForAction: true,
    requirements: [
      {
        selector: '[data-onboarding-field="activity-title"]',
        label: "le titre de l’activité",
      },
      {
        selector: '[data-onboarding-field="activity-content"]',
        label: "le contenu de l’activité",
      },
    ],
    index: 19,
  },
  "admin-complete": {
    target: "#main-scroll-container",
    title: "Votre premier contenu est prêt",
    content:
      "Vous connaissez maintenant la chaîne complète : formation, parcours, module, cours, leçon et activité. Vous pourrez relancer ce guide depuis le menu latéral.",
    placement: "center",
    nextLabel: "Compris",
    index: 20,
  },
};

const studentStages: Record<string, Omit<StageDefinition, "total">> = {
  "student-navigation": {
    target: '[data-onboarding="sidebar-navigation"]',
    title: "Votre navigation",
    content:
      "Le menu donne accès à votre accueil, vos parcours, votre calendrier et vos ressources supplémentaires.",
    placement: "right",
    next: "student-dashboard",
    index: 1,
  },
  "student-dashboard": {
    target: '[data-onboarding="student-dashboard-header"]',
    title: "Votre tableau de bord",
    content:
      "L’accueil résume ce qui compte aujourd’hui et vous permet de reprendre rapidement votre apprentissage.",
    placement: "bottom",
    previous: "student-navigation",
    next: "student-content",
    index: 2,
  },
  "student-content": {
    target: '[data-onboarding="student-content"]',
    title: "Reprenez là où vous en étiez",
    content:
      "Cette zone affiche votre prochaine activité ou les parcours disponibles. Votre progression se met à jour au fil de la lecture.",
    placement: "right",
    previous: "student-dashboard",
    next: "student-complete",
    index: 3,
  },
  "student-complete": {
    target: "#main-scroll-container",
    title: "Vous êtes prêt à apprendre",
    content:
      "Ouvrez un parcours, choisissez un module puis avancez activité par activité. Le guide reste accessible depuis le menu latéral.",
    placement: "center",
    previous: "student-content",
    nextLabel: "Compris",
    index: 4,
  },
};

const OnboardingTourContent = ({
  layout,
  initialOnboarding,
  children,
}: PropsWithChildren<{
  layout: Layout;
  initialOnboarding: UserOnboarding;
}>) => {
  const { updateOnboarding } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<OnboardingStatus>(
    initialOnboarding.status,
  );
  const [stepToken, setStepToken] = useState(() =>
    getResumableToken(initialOnboarding.step),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const [requirementRevision, setRequirementRevision] = useState(0);
  const [failedStepToken, setFailedStepToken] = useState<string>();
  const navigatedStepRef = useRef("");

  const saveState = useCallback(
    async (nextStatus: OnboardingStatus, nextStep: string) => {
      setStatus(nextStatus);
      setStepToken(nextStep);
      try {
        await updateOnboarding(nextStatus, nextStep);
      } catch {
        toast.error("Le tutoriel n’a pas pu enregistrer votre progression.");
      }
    },
    [updateOnboarding],
  );

  const start = useCallback(async () => {
    setIsSaving(true);
    setFailedStepToken(undefined);
    navigatedStepRef.current = "";
    const firstStep =
      layout === "admin" ? "admin-navigation" : "student-navigation";
    await saveState("in_progress", firstStep);
    setIsSaving(false);
  }, [layout, saveState]);

  const stop = useCallback(async () => {
    setIsSaving(true);
    await saveState("skipped", "");
    setShowStopConfirmation(false);
    setIsSaving(false);
  }, [saveState]);

  const complete = useCallback(async () => {
    await saveState("completed", "");
    toast.success("Tutoriel terminé !");
  }, [saveState]);

  const goToStage = useCallback(
    (stage: string, contextId?: number) => {
      void saveState("in_progress", withContext(stage, contextId));
    },
    [saveState],
  );

  useEffect(() => {
    if (status !== "in_progress" || failedStepToken === stepToken) return;

    const previousRootOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const preventPointerScroll = (event: Event) => event.preventDefault();
    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (!scrollKeys.includes(event.key)) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.matches("input, textarea, select, [contenteditable='true']") ||
        (event.key === " " && target?.closest("button, a"))
      ) {
        return;
      }

      event.preventDefault();
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("wheel", preventPointerScroll, {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", preventPointerScroll, {
      capture: true,
      passive: false,
    });
    document.addEventListener("keydown", preventKeyboardScroll, true);

    return () => {
      document.documentElement.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("wheel", preventPointerScroll, true);
      document.removeEventListener("touchmove", preventPointerScroll, true);
      document.removeEventListener("keydown", preventKeyboardScroll, true);
    };
  }, [failedStepToken, status, stepToken]);

  useEffect(() => {
    if (status !== "in_progress") return;

    const refreshRequirements = () => {
      setRequirementRevision((current) => current + 1);
    };
    const observer = new MutationObserver(refreshRequirements);

    document.addEventListener("change", refreshRequirements, true);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-onboarding-valid"],
    });

    return () => {
      document.removeEventListener("change", refreshRequirements, true);
      observer.disconnect();
    };
  }, [status, stepToken]);

  useEffect(() => {
    if (status !== "in_progress" || !stepToken) return;
    if (navigatedStepRef.current === stepToken) return;
    navigatedStepRef.current = stepToken;
    const { stage, contextId } = splitToken(stepToken);

    let target: string | undefined;
    if (stage.startsWith("student-")) {
      target = "/student/dashboard";
    } else if (
      ["admin-navigation", "admin-dashboard", "admin-formation-entry"].includes(
        stage,
      )
    ) {
      target = "/admin/dashboard";
    } else if (stage.startsWith("admin-formation")) {
      target = "/admin/dashboard?createFormation=true";
    } else if (stage === "admin-parcours-create" && contextId) {
      target = `/admin/parcours/new?formationId=${contextId}`;
    } else if (stage === "admin-parcours-info" && contextId) {
      target = `/admin/parcours/edit/${contextId}?step=1`;
    } else if (stage.startsWith("admin-module-") && contextId) {
      target = `/admin/parcours/edit/${contextId}?step=4&create=true`;
    } else if (
      stage.startsWith("admin-") &&
      !["admin-complete"].includes(stage) &&
      contextId
    ) {
      target = `/admin/parcours/module/${contextId}`;
    }

    const isModuleFormAlreadyOpen =
      stage.startsWith("admin-module-") &&
      contextId !== undefined &&
      location.pathname === `/admin/parcours/edit/${contextId}` &&
      new URLSearchParams(location.search).get("step") === "4";

    if (
      target &&
      !isModuleFormAlreadyOpen &&
      `${location.pathname}${location.search}` !== target
    ) {
      navigate(target, { replace: true });
    }
  }, [location.pathname, location.search, navigate, status, stepToken]);

  useEffect(() => {
    return subscribeToOnboardingEvents((event: OnboardingEventDetail) => {
      if (event.type === "restart") {
        void start();
        return;
      }
      if (status !== "in_progress" || layout !== "admin") return;

      const { stage, contextId } = splitToken(stepToken);
      switch (event.type) {
        case "formation_entry_clicked":
          if (stage === "admin-formation-entry") {
            goToStage("admin-formation-fields");
          }
          break;
        case "formation_created":
          if (stage === "admin-formation-save") {
            goToStage("admin-parcours-create", event.id);
          }
          break;
        case "parcours_created":
          if (stage === "admin-parcours-create") {
            goToStage("admin-parcours-info", event.id);
          }
          break;
        case "module_created":
          if (stage === "admin-module-save") {
            goToStage("admin-course-create", event.id);
          }
          break;
        case "course_form_opened":
          if (stage === "admin-course-create") {
            goToStage("admin-course-details", contextId);
          }
          break;
        case "course_created":
          if (stage === "admin-course-details") {
            goToStage("admin-lesson-create", contextId);
          }
          break;
        case "lesson_form_opened":
          if (stage === "admin-lesson-create") {
            goToStage("admin-lesson-details", contextId);
          }
          break;
        case "lesson_created":
          if (stage === "admin-lesson-details") {
            goToStage("admin-activity-create", contextId);
          }
          break;
        case "activity_creation_started":
          if (stage === "admin-activity-create") {
            goToStage("admin-activity-type", contextId);
          }
          break;
        case "activity_type_selected":
          if (
            stage === "admin-activity-type" &&
            event.activityType === "text"
          ) {
            goToStage("admin-text-editor", contextId);
          }
          break;
        case "activity_created":
          if (stage === "admin-text-editor") {
            goToStage("admin-complete");
          }
          break;
      }
    });
  }, [goToStage, layout, start, status, stepToken]);

  const stageDefinition = useMemo<StageDefinition | undefined>(() => {
    const { stage, contextId } = splitToken(stepToken);
    const definitions = layout === "admin" ? adminStages : studentStages;
    const definition = definitions[stage];
    if (!definition) return undefined;

    const total = layout === "admin" ? 20 : 4;
    const resolveToken = (next?: string) =>
      next
        ? withContext(
            next,
            next.startsWith("admin-") &&
              !next.startsWith("admin-formation") &&
              next !== "admin-complete"
              ? contextId
              : undefined,
          )
        : undefined;

    return {
      ...definition,
      total,
      next: resolveToken(definition.next),
      previous: resolveToken(definition.previous),
    };
  }, [layout, stepToken]);

  const missingRequirements = useMemo(
    () =>
      getMissingRequirements(
        stageDefinition?.requirements,
        requirementRevision,
      ),
    [requirementRevision, stageDefinition],
  );

  const missingRequirementLabelsKey = missingRequirements
    .map((requirement) => requirement.label)
    .join("\u0000");

  const missingRequirementLabels = useMemo(
    () =>
      missingRequirementLabelsKey.length > 0
        ? missingRequirementLabelsKey.split("\u0000")
        : [],
    [missingRequirementLabelsKey],
  );

  useEffect(() => {
    const requirements = stageDefinition?.requirements ?? [];
    requirements.forEach((requirement) => {
      const element = getRequirementHighlightElement(requirement);
      const isMissing = !isRequirementMet(requirement);
      invalidLabelClasses.forEach((className) => {
        element?.classList.toggle(className, isMissing);
      });
    });

    return () => clearRequirementHighlights(requirements);
  }, [requirementRevision, stageDefinition]);

  const validateCurrentStage = useCallback(() => {
    const missing = getMissingRequirements(stageDefinition?.requirements);
    if (missing.length === 0) return true;

    setRequirementRevision((current) => current + 1);
    toast.error(
      `Complétez les champs obligatoires : ${missing
        .map((requirement) => requirement.label)
        .join(", ")}.`,
    );

    const firstElement = getRequirementElement(missing[0]);
    firstElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    firstElement?.focus({ preventScroll: true });
    return false;
  }, [stageDefinition]);

  const step = useMemo<Step[]>(() => {
    if (!stageDefinition) return [];

    const data: OnboardingTooltipData = {
      current: stageDefinition.index,
      total: stageDefinition.total,
      waitingForAction: stageDefinition.waitingForAction,
      missingRequirements: missingRequirementLabels,
      nextLabel: stageDefinition.nextLabel,
      onStop: () => setShowStopConfirmation(true),
      onBack: stageDefinition.previous
        ? () => void saveState("in_progress", stageDefinition.previous!)
        : undefined,
      onNext:
        stageDefinition.next ||
        stepToken === "admin-complete" ||
        stepToken === "student-complete"
          ? () =>
              validateCurrentStage() &&
              (stageDefinition.next
                ? void saveState("in_progress", stageDefinition.next)
                : void complete())
          : undefined,
    };

    return [
      {
        id: stepToken,
        target: stageDefinition.target,
        title: stageDefinition.title,
        content: stageDefinition.content,
        data,
        placement: stageDefinition.placement,
        skipBeacon: true,
        blockTargetInteraction: false,
        disableFocusTrap: Boolean(
          stageDefinition.waitingForAction ||
            stageDefinition.requirements?.length,
        ),
        spotlightPadding: 8,
      },
    ];
  }, [
    complete,
    missingRequirementLabels,
    saveState,
    stageDefinition,
    stepToken,
    validateCurrentStage,
  ]);

  const run =
    status === "in_progress" &&
    failedStepToken !== stepToken &&
    step.length > 0;

  return (
    <OnboardingContext
      value={{ status, step: stepToken, isSaving, start, skip: stop }}
    >
      {children}
      {run && (
        <Joyride
          key={stepToken}
          run
          steps={step}
          tooltipComponent={OnboardingTooltip}
          scrollToFirstStep
          onEvent={({ type }) => {
            if (type !== EVENTS.TARGET_NOT_FOUND) return;

            const resumableToken = getResumableToken(stepToken);
            if (resumableToken !== stepToken) {
              toast.error(
                "Cette étape n’est plus ouverte. Le tutoriel reprend à l’étape précédente.",
              );
              void saveState("in_progress", resumableToken);
              return;
            }

            setFailedStepToken(stepToken);
            toast.error(
              "Le tutoriel a été mis en pause car cette étape n’est plus disponible. Vous pouvez le relancer depuis le menu.",
            );
          }}
          floatingOptions={{
            strategy: "fixed",
            shiftOptions: {
              mainAxis: true,
              crossAxis: true,
              padding: 16,
            },
            flipOptions: { padding: 16 },
          }}
          styles={{
            floater: {
              boxSizing: "border-box",
              maxWidth: "calc(100vw - 2rem)",
            },
          }}
          options={{
            buttons: [],
            closeButtonAction: "skip",
            dismissKeyAction: false,
            overlayClickAction: false,
            overlayColor: "rgba(2, 6, 23, 0.72)",
            primaryColor: "var(--color-primary)",
            backgroundColor: "var(--color-base-100)",
            textColor: "var(--color-base-content)",
            arrowColor: "var(--color-base-100)",
            showProgress: false,
            spotlightRadius: 10,
            targetWaitTimeout: 15_000,
            zIndex: 2000,
          }}
        />
      )}
      {showStopConfirmation && status === "in_progress" && (
        <OnboardingStopConfirmation
          isSaving={isSaving}
          onCancel={() => setShowStopConfirmation(false)}
          onConfirm={() => void stop()}
        />
      )}
    </OnboardingContext>
  );
};

/**
 * Contexte inerte, pour la démonstration.
 *
 * Le tutoriel enregistre sa progression sur le compte (`user.onboarding`). En
 * démonstration ce compte est partagé par tous les visiteurs simultanés, et le
 * verrou lecture seule refuse l'écriture : le faire tourner n'aurait aucun sens.
 * On garde en revanche le fournisseur, plusieurs vues appelant `useOnboarding`
 * — qui lève une erreur hors de son contexte. La visite guidée de la
 * démonstration est portée par `DemoTour`.
 */
const InertOnboarding = ({ children }: PropsWithChildren) => (
  <OnboardingContext
    value={{
      status: "skipped",
      step: "",
      isSaving: false,
      start: async () => {},
      skip: async () => {},
    }}
  >
    {children}
  </OnboardingContext>
);

const OnboardingTour = ({
  layout,
  children,
}: PropsWithChildren<{ layout: Layout }>) => {
  const { user } = useContext(AuthContext);
  const { demoMode } = useDemoMode();

  if (demoMode) return <InertOnboarding>{children}</InertOnboarding>;
  if (!user) return children;

  return (
    <OnboardingTourContent
      key={user._id}
      layout={layout}
      initialOnboarding={
        user.onboarding ?? {
          status: "pending",
          step: "",
          version: 1,
        }
      }
    >
      {children}
    </OnboardingTourContent>
  );
};

export default OnboardingTour;
