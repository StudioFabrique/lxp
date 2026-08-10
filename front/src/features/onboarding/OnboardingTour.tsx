import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { Joyride, type Step } from "react-joyride";
import toast from "react-hot-toast";

import { AuthContext } from "../../store/AuthProvider";
import type {
  OnboardingStatus,
  UserOnboarding,
} from "../../utils/interfaces/user";
import OnboardingTooltip, {
  type OnboardingTooltipData,
} from "./OnboardingTooltip";
import OnboardingWelcome from "./OnboardingWelcome";
import {
  subscribeToOnboardingEvents,
  type OnboardingEventDetail,
} from "./onboarding-events";

type Layout = "admin" | "student";

type StageDefinition = {
  target: string;
  title: string;
  content: string;
  placement?: Step["placement"];
  waitingForAction?: boolean;
  next?: string;
  previous?: string;
  nextLabel?: string;
  index: number;
  total: number;
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
    "admin-course-details": "admin-course-create",
    "admin-lesson-details": "admin-lesson-create",
    "admin-activity-type": "admin-activity-create",
    "admin-text-editor": "admin-activity-create",
  };

  return withContext(resumableStage[stage] ?? stage, contextId);
};

const adminStages: Record<string, Omit<StageDefinition, "total">> = {
  "admin-formation-fields": {
    target: '[data-onboarding="formation-fields"]',
    title: "Votre première formation",
    content:
      "Une formation est le niveau le plus haut de votre catalogue. Donnez-lui un nom, un niveau et au moins un tag. La description et le code RNCP restent facultatifs.",
    placement: "right",
    next: "admin-formation-save",
    nextLabel: "J’ai compris",
    index: 1,
  },
  "admin-formation-save": {
    target: '[data-onboarding="formation-save"]',
    title: "Enregistrez la formation",
    content:
      "Lorsque les informations sont prêtes, utilisez ce bouton. Le guide reprendra automatiquement dès que la formation sera créée.",
    placement: "top",
    waitingForAction: true,
    previous: "admin-formation-fields",
    index: 2,
  },
  "admin-parcours-create": {
    target: '[data-onboarding="parcours-create"]',
    title: "Créez un parcours",
    content:
      "Le parcours organise l’expérience d’un groupe d’apprenants. La formation créée est déjà sélectionnée : saisissez simplement un titre puis cliquez sur Créer.",
    placement: "right",
    waitingForAction: true,
    index: 3,
  },
  "admin-parcours-info": {
    target: '[data-onboarding="parcours-information"]',
    title: "Complétez les informations",
    content:
      "Le titre et la description se sauvegardent automatiquement. Vous pouvez également définir les dates, les contacts, les tags et une classe virtuelle.",
    placement: "right",
    next: "admin-module-form",
    nextLabel: "Créer un module",
    index: 4,
  },
  "admin-module-form": {
    target: '[data-onboarding="module-form"]',
    title: "Ajoutez un premier module",
    content:
      "Un module regroupe vos cours. Renseignez son titre, sa description et sa durée, puis enregistrez-le. L’image, les contacts et les compétences peuvent être ajoutés maintenant ou plus tard.",
    placement: "top",
    waitingForAction: true,
    previous: "admin-parcours-info",
    index: 5,
  },
  "admin-course-create": {
    target: '[data-onboarding="course-create"]',
    title: "Ajoutez un cours",
    content:
      "Les cours structurent les leçons d’un module. Cliquez sur Ajouter un cours, saisissez un titre, puis validez pour ouvrir les informations détaillées.",
    placement: "right",
    waitingForAction: true,
    index: 6,
  },
  "admin-course-details": {
    target: '[data-onboarding="course-details"]',
    title: "Préparez le cours",
    content:
      "Ajoutez une description et au moins un tag. Vous pouvez aussi préparer des titres de leçons, mais nous allons en créer une ensemble juste après.",
    placement: "left",
    waitingForAction: true,
    index: 7,
  },
  "admin-lesson-create": {
    target: '[data-onboarding="lesson-create"]',
    title: "Ajoutez une leçon",
    content:
      "Ce bouton ajoute une leçon au cours que vous venez de créer. Une leçon contient les activités consultées par les apprenants.",
    placement: "right",
    waitingForAction: true,
    index: 8,
  },
  "admin-lesson-details": {
    target: '[data-onboarding="lesson-details"]',
    title: "Décrivez la leçon",
    content:
      "Saisissez un titre, choisissez le tag du cours et précisez la modalité. La description aide les apprenants à comprendre l’objectif de la leçon.",
    placement: "left",
    waitingForAction: true,
    index: 9,
  },
  "admin-activity-create": {
    target: '[data-onboarding="activity-create"]',
    title: "Créez une activité",
    content:
      "Une activité est l’unité de contenu affichée aux apprenants. Cliquez ici pour choisir son format.",
    placement: "right",
    waitingForAction: true,
    index: 10,
  },
  "admin-activity-type": {
    target: '[data-onboarding="activity-type-text"]',
    title: "Choisissez l’activité texte",
    content:
      "Andria accepte aussi les images, vidéos, ressources et contenus interactifs. Pour ce premier contenu, choisissez Texte.",
    placement: "bottom",
    waitingForAction: true,
    previous: "admin-activity-create",
    index: 11,
  },
  "admin-text-editor": {
    target: '[data-onboarding="text-editor"]',
    title: "Rédigez votre première activité",
    content:
      "Donnez un titre à l’activité, saisissez quelques lignes et explorez la barre de mise en forme. Le bouton d’enregistrement apparaît dès que l’éditeur contient du texte.",
    placement: "top",
    waitingForAction: true,
    index: 12,
  },
  "admin-complete": {
    target: "#main-scroll-container",
    title: "Votre premier contenu est prêt",
    content:
      "Vous connaissez maintenant la chaîne complète : formation, parcours, module, cours, leçon et activité. Vous pourrez relancer ce guide depuis le menu latéral.",
    placement: "center",
    nextLabel: "Compris",
    index: 13,
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
}: {
  layout: Layout;
  initialOnboarding: UserOnboarding;
}) => {
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
    navigatedStepRef.current = "";
    const firstStep =
      layout === "admin" ? "admin-formation-fields" : "student-navigation";
    await saveState("in_progress", firstStep);
    setIsSaving(false);
  }, [layout, saveState]);

  const stop = useCallback(async () => {
    setIsSaving(true);
    await saveState("skipped", "");
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
    if (status !== "in_progress" || !stepToken) return;
    if (navigatedStepRef.current === stepToken) return;
    navigatedStepRef.current = stepToken;
    const { stage, contextId } = splitToken(stepToken);

    let target: string | undefined;
    if (stage.startsWith("student-")) {
      target = "/student/dashboard";
    } else if (stage.startsWith("admin-formation")) {
      target = "/admin/formation";
    } else if (stage === "admin-parcours-create" && contextId) {
      target = `/admin/parcours/new?formationId=${contextId}`;
    } else if (stage === "admin-parcours-info" && contextId) {
      target = `/admin/parcours/edit/${contextId}`;
    } else if (stage === "admin-module-form" && contextId) {
      target = `/admin/parcours/edit/${contextId}?step=4&create=true`;
    } else if (
      stage.startsWith("admin-") &&
      !["admin-complete"].includes(stage) &&
      contextId
    ) {
      target = `/admin/parcours/module/${contextId}`;
    }

    if (target && `${location.pathname}${location.search}` !== target) {
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
          if (stage === "admin-module-form") {
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

    const total = layout === "admin" ? 13 : 4;
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

  const step = useMemo<Step[]>(() => {
    if (!stageDefinition) return [];

    const data: OnboardingTooltipData = {
      current: stageDefinition.index,
      total: stageDefinition.total,
      waitingForAction: stageDefinition.waitingForAction,
      nextLabel: stageDefinition.nextLabel,
      onStop: () => void stop(),
      onBack: stageDefinition.previous
        ? () => void saveState("in_progress", stageDefinition.previous!)
        : undefined,
      onNext:
        stageDefinition.next ||
        stepToken === "admin-complete" ||
        stepToken === "student-complete"
          ? () =>
              stageDefinition.next
                ? void saveState("in_progress", stageDefinition.next)
                : void complete()
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
        disableFocusTrap: Boolean(stageDefinition.waitingForAction),
        spotlightPadding: 8,
      },
    ];
  }, [complete, saveState, stageDefinition, stepToken, stop]);

  const showWelcome = status === "pending";
  const run = status === "in_progress" && step.length > 0;

  return (
    <>
      {showWelcome && (
        <OnboardingWelcome
          layout={layout}
          isSaving={isSaving}
          onStart={() => void start()}
          onSkip={() => void stop()}
        />
      )}
      {run && (
        <Joyride
          key={stepToken}
          run
          steps={step}
          tooltipComponent={OnboardingTooltip}
          scrollToFirstStep
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
    </>
  );
};

const OnboardingTour = ({ layout }: { layout: Layout }) => {
  const { user } = useContext(AuthContext);
  if (!user) return null;

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
    />
  );
};

export default OnboardingTour;
