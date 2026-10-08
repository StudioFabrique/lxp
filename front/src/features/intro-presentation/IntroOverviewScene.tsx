import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { ArrowRight, ChevronsUp } from "lucide-react";

import {
  INTRO_PYRAMID_LEVELS,
  INTRO_PYRAMID_LEVEL_COUNT,
} from "./intro-levels";
import { ScrollTrigger, gsap, prefersReducedMotion } from "./intro-motion";
import IntroLevelRail from "./IntroLevelRail";
import IntroLevelStack from "./IntroLevelStack";
import IntroSceneHeading from "./IntroSceneHeading";
import IntroStepControls from "./IntroStepControls";
import { cn } from "../../utils/cn";
import { useIntroPresentation } from "./useIntroPresentation";

type Props = {
  /** Ancre du chatbot de l'introduction, placée dans l'espace vide au-dessus de la pyramide. */
  chatbotAnchorRef: RefObject<HTMLDivElement | null>;
  /** Informe de chaque changement de palier (0 : introduction). */
  onStepChange: (step: number) => void;
  /** Appelé quand l'utilisateur a vu tous les niveaux et passe à l'exploration. */
  onContinue: () => void;
};

/** Palier 0 : présentation et chatbot ; paliers 1 à 7 : un niveau chacun. */
const LAST_STEP = INTRO_PYRAMID_LEVEL_COUNT;
/** Distance de défilement qui sépare deux paliers, en hauteurs de la zone. */
const STEP_HEIGHT_CQH = 70;
const PLATE_DEPTH = 60;
/** Délai après le dernier changement de palier avant que la pyramide soit au repos. */
const SETTLE_MS = 800;
/** Délai entre deux niveaux, où seul un léger mouvement de la pile subsiste. */
const NEXT_LEVEL_MS = 120;
/** Zone réservée au chatbot à côté d'une plaque. */
const PANEL_WIDTH = 440;
const PANEL_HEIGHT = 140;

/**
 * Découverte des niveaux par le défilement.
 *
 * Au palier 0, aucun niveau n'est sélectionné : la pyramide est vue du dessus
 * (presque en 2D) devant l'encadré « Organisme de formation », son titre est
 * au-dessus et le chatbot dialogue. Le sens est inversé : la zone démarre en
 * bas de son défilement et on progresse en défilant vers le haut. La
 * progression du scroll, inversée, pilote une timeline GSAP : la pile s'incline
 * et l'explication du niveau remplace le titre. Les boutons et le clavier
 * déplacent la même zone, il n'y a donc qu'une source de vérité.
 */
const IntroOverviewScene = ({
  chatbotAnchorRef,
  onStepChange,
  onContinue,
}: Props) => {
  // Avec la barre réduite de la première présentation, le titre prend la ligne libre à sa droite.
  const { sidebarPhase } = useIntroPresentation();
  const isCompactSidebar = sidebarPhase !== "normal";
  const scrollRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  // L'organisme n'est sélectionné dans le rail qu'à l'apparition de son encadré.
  const [isOrganisationShown, setIsOrganisationShown] = useState(false);

  const columnRef = useRef<HTMLDivElement>(null);
  // Palier une fois la pyramide immobile : le chatbot ne se déplace qu'alors,
  // vers la plaque du niveau, et non pendant le défilement.
  const [settledStep, setSettledStep] = useState(0);
  const [panelStyle, setPanelStyle] = useState<CSSProperties | undefined>();

  const settledRef = useRef(0);
  useEffect(() => {
    // Entre deux niveaux, la pyramide ne bouge presque plus : un court délai
    // suffit. Depuis ou vers l'introduction, elle se redresse : on l'attend.
    const delay =
      settledRef.current === 0 || activeStep === 0 ? SETTLE_MS : NEXT_LEVEL_MS;
    const timer = setTimeout(() => {
      settledRef.current = activeStep;
      setSettledStep(activeStep);
    }, delay);
    return () => clearTimeout(timer);
  }, [activeStep]);

  // Au palier d'un niveau, la zone du chatbot se pose à droite de l'étiquette
  // de la plaque correspondante ; au palier 0, elle reprend sa place de départ.
  useLayoutEffect(() => {
    const column = columnRef.current;
    const label = stageRef.current?.querySelector<HTMLElement>(
      `[data-intro-plate="${settledStep - 1}"] > span`,
    );
    if (settledStep < 1 || !column || !label) {
      setPanelStyle(undefined);
      return;
    }
    const columnRect = column.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, columnRect.width);
    const left = Math.min(
      labelRect.right - columnRect.left + 24,
      columnRect.width - width,
    );
    const top =
      labelRect.top + labelRect.height / 2 - columnRect.top - PANEL_HEIGHT / 2;
    setPanelStyle({
      left,
      top,
      width,
      height: PANEL_HEIGHT,
      right: "auto",
      margin: 0,
    });
  }, [settledStep]);

  useEffect(() => onStepChange(settledStep), [settledStep, onStepChange]);

  useEffect(() => {
    const scroller = scrollRef.current;
    const spacer = spacerRef.current;
    const stage = stageRef.current;
    if (!scroller || !spacer || !stage) return;

    const context = gsap.context(() => {
      const reduced = prefersReducedMotion();
      const stack = stage.querySelector<HTMLElement>(".intro-stack");
      const tilt = stage.querySelector<HTMLElement>(".intro-tilt");
      const plates = gsap.utils.toArray<HTMLElement>(".intro-plate", stage);
      const organisation = stage.querySelector<HTMLElement>(
        ".intro-organisation",
      );
      const organisationFade = stage.querySelector<HTMLElement>(
        ".intro-organisation-fade",
      );
      const hint = stage.querySelector<HTMLElement>(".intro-scroll-hint");

      // Pile vue du dessus, presque en 2D, plaques posées en profondeur.
      gsap.set(stack, { rotationX: 6, rotation: 0 });
      plates.forEach((plate, index) =>
        gsap.set(plate, { z: index * PLATE_DEPTH }),
      );

      if (!reduced) {
        // Mouvement de caméra de bas en haut : on part du côté de la pyramide,
        // vue rasante en gradins, puis la caméra monte jusqu'à la vue du dessus.
        gsap.from(tilt, {
          rotationX: 38,
          duration: 2.4,
          delay: 0.2,
          ease: "power2.inOut",
        });
        // Séquence d'ouverture, au rythme de la vidéo de présentation : chaque
        // plaque tombe en profondeur en tournant, pendant que sa ligne de
        // l'arborescence glisse depuis le bord gauche vers son retrait en se
        // retournant, puis son icône pulse brièvement.
        const STAGGER = 0.2;
        const START = 0.2;
        // L'encadré de l'organisme apparaît en fin de séquence ; sa
        // ligne dans l'arborescence glisse en même temps que lui.
        const [organisationItem, ...levelItems] =
          gsap.utils.toArray<HTMLElement>(".intro-rail-item", stage);
        // Dans la cadence de l'arborescence, juste après le dernier niveau :
        // aucune pause entre les lignes.
        const FRAME_DELAY = START + levelItems.length * STAGGER;
        const slideIn = (
          items: HTMLElement[],
          delay: number,
          withPulse = true,
        ) => {
          // Fondu bref et mouvement continu, séparés : un fondu porté par la
          // courbe du mouvement laisse la ligne invisible puis la fait surgir.
          gsap.from(items, {
            opacity: 0,
            duration: 0.35,
            delay,
            ease: "power1.out",
            stagger: STAGGER,
          });
          gsap.from(items, {
            x: (_index: number, item: HTMLElement) =>
              -parseFloat(getComputedStyle(item).marginLeft),
            force3D: true,
            lazy: false,
            duration: 0.9,
            delay,
            ease: "power3.out",
            stagger: STAGGER,
          });
          if (!withPulse) return;
          gsap.to(
            items.flatMap((item) =>
              Array.from(item.querySelectorAll(".intro-rail-icon")),
            ),
            {
              scale: 1.14,
              force3D: true,
              duration: 0.22,
              delay: delay + 0.45,
              yoyo: true,
              repeat: 1,
              ease: "sine.inOut",
              stagger: STAGGER,
            },
          );
        };
        gsap.from(plates, {
          opacity: 0,
          z: (index: number) => index * PLATE_DEPTH + 520,
          rotation: (index: number) => (index % 2 ? 24 : -24),
          x: (index: number) => (index % 2 ? 24 : -24) * 3,
          duration: 0.75,
          delay: START,
          ease: "back.out(1.3)",
          stagger: STAGGER,
        });
        slideIn(levelItems, START);
        // Pas de pulsation pour l'organisme : il glisse simplement avec son encadré.
        slideIn([organisationItem], FRAME_DELAY, false);
        gsap.from([organisationFade, hint], {
          opacity: 0,
          duration: 0.8,
          delay: FRAME_DELAY,
          ease: "power1.out",
          // L'organisme est sélectionné à l'apparition de son encadré ; le fondu
          // du rail se joue pendant celui de l'encadré.
          onStart: () => setIsOrganisationShown(true),
        });
      } else {
        setIsOrganisationShown(true);
      }

      // Le scroll démarre en bas : défiler vers le haut fait avancer.
      scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      ScrollTrigger.create({
        trigger: spacer,
        scroller,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: 1 / LAST_STEP,
          // Le palier le plus proche, quelle que soit la vitesse du geste.
          directional: false,
          inertia: false,
          duration: { min: 0.2, max: 0.5 },
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          // Progression inversée : le haut de la zone correspond au dernier palier.
          const progress = 1 - self.progress;
          setActiveStep(Math.round(progress * LAST_STEP));
          if (reduced) {
            timeline.progress(progress);
            return;
          }
          gsap.to(timeline, {
            progress,
            duration: 0.6,
            ease: "power1.out",
            overwrite: true,
          });
        },
      });

      // L'encadré de l'organisme et la consigne s'effacent dès le premier palier.
      timeline.to([organisation, hint], { autoAlpha: 0, duration: 0.5 }, 0.1);
      // La pile se redresse vers le lecteur, d'abord vite puis doucement.
      timeline.to(stack, { rotationX: 54, rotation: -12, duration: 1 }, 0);
      // La pyramide remonte en haut de la zone : le chatbot vient près de chaque plaque.
      timeline.to(stack, { y: -70, duration: 1 }, 0);
      timeline.to(
        stack,
        { rotationX: 46, rotation: -4, duration: LAST_STEP - 1 },
        1,
      );
    }, stage);

    return () => context.revert();
  }, []);

  // Une fois le départ lancé, plus rien ne doit relancer l'animation ni le scroll.
  const leaveTimeline = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => () => void leaveTimeline.current?.kill(), []);

  /**
   * Replie la pyramide dans la première carte, comme dans la vidéo de
   * présentation : les plaques s'écartent en profondeur, puis se rabattent en
   * s'effaçant en partant du sommet pendant que la pile se met à plat. La
   * descente niveau par niveau démarre ensuite.
   */
  const startExploring = () => {
    const stage = stageRef.current;
    const scroller = scrollRef.current;
    if (leaveTimeline.current) return;
    if (!stage || !scroller || prefersReducedMotion()) {
      onContinue();
      return;
    }
    scroller.style.overflowY = "hidden";
    const plates = gsap.utils.toArray<HTMLElement>(".intro-plate", stage);
    const stack = stage.querySelector<HTMLElement>(".intro-stack");
    const timeline = gsap.timeline({ onComplete: onContinue });
    timeline.to(
      stage.querySelectorAll("[data-intro-controls], .intro-start"),
      { autoAlpha: 0, duration: 0.3 },
      0,
    );
    timeline.to(
      plates,
      {
        z: (index: number) => index * 90,
        duration: 0.5,
        ease: "power2.inOut",
        stagger: 0.03,
      },
      0,
    );
    timeline.to(
      plates,
      {
        z: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
        stagger: { each: 0.05, from: "end" },
      },
      0.5,
    );
    timeline.to(
      stack,
      {
        rotationX: 0,
        rotation: 0,
        y: 0,
        scale: 1.05,
        duration: 0.65,
        ease: "power2.in",
      },
      0.5,
    );
    leaveTimeline.current = timeline;
  };

  const goToStep = (step: number) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const clamped = Math.min(Math.max(step, 0), LAST_STEP);
    const distance = scroller.scrollHeight - scroller.clientHeight;
    scroller.scrollTo({
      top: distance - (distance / LAST_STEP) * clamped,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowUp: 1,
      PageUp: 1,
      ArrowDown: -1,
      PageDown: -1,
    };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    goToStep(activeStep + move);
  };

  const levelIndex = activeStep - 1;
  const level = INTRO_PYRAMID_LEVELS[levelIndex];
  const isLast = activeStep === LAST_STEP;

  return (
    // La zone de défilement est atteignable au clavier : ses flèches changent de palier.
    <div
      ref={scrollRef}
      tabIndex={0}
      role="region"
      aria-label="Découverte des niveaux, faites défiler vers le haut ou utilisez les flèches"
      onKeyDown={handleKeyDown}
      className="absolute inset-0 overflow-y-auto overscroll-contain [container-type:size]"
    >
      <div
        ref={spacerRef}
        style={{ height: `${100 + LAST_STEP * STEP_HEIGHT_CQH}cqh` }}
      >
        <div
          ref={stageRef}
          className={cn(
            "sticky top-0 flex h-[100cqh] flex-col px-4 pb-16 sm:px-8",
            isCompactSidebar ? "pt-20" : "pt-10",
          )}
        >
          {isCompactSidebar ? (
            // Alignée sur la barre réduite, centrée dans l'espace libre à sa droite.
            <div className="pointer-events-none absolute right-14 top-0 left-[calc(var(--intro-bar-width,30rem)+1.5rem)] flex h-[3.75rem] items-center justify-center">
              <IntroSceneHeading className="text-center" />
            </div>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {level
              ? `${level.label} : ${level.explanation}`
              : "Comment s'organisent vos contenus ?"}
          </p>

          <div className="grid min-h-0 flex-1 items-center gap-6 pr-14 lg:grid-cols-[minmax(16rem,22rem)_1fr]">
            <IntroLevelRail
              activeIndex={
                activeStep === 0 && !isOrganisationShown ? -1 : activeStep
              }
              selectableUpTo={LAST_STEP}
              onSelect={goToStep}
            />
            <div
              ref={columnRef}
              className="relative flex min-w-0 flex-col items-center self-stretch"
            >
              {/* Les explications des niveaux sont dites par le chatbot. */}
              {isCompactSidebar ? (
                <div className="min-h-24 w-full shrink-0" />
              ) : (
                <div className="grid min-h-32 w-full shrink-0 place-items-center">
                  <IntroSceneHeading className="text-center" />
                </div>
              )}
              {/* Zone réservée au chatbot : le calcul de placement de l'onboarding
                  ignore la pyramide 3D et le restreint à l'espace de ce panneau,
                  vide entre le titre et la pyramide. */}
              <div
                data-onboarding-panel
                aria-hidden="true"
                style={panelStyle}
                className={cn(
                  "pointer-events-none absolute inset-x-0 mx-auto h-52 w-full max-w-xl",
                  isCompactSidebar ? "top-2" : "top-20",
                )}
              >
                <div ref={chatbotAnchorRef} />
              </div>
              <div className="flex flex-1 items-center">
                <IntroLevelStack
                  activeIndex={levelIndex}
                  onSelect={(index) => goToStep(index + 1)}
                />
              </div>
              <p className="intro-scroll-hint flex items-center gap-2 text-sm text-base-content/70">
                <ChevronsUp className="size-4" aria-hidden="true" />
                Faire défiler vers le haut pour naviguer entre les différents
                niveaux
              </p>
            </div>
          </div>

          {/* En bas à droite : « Suivant » (même action que la flèche du haut) pour le premier
              palier, puis « Commencer à explorer », disponible dès le premier niveau. */}
          {activeStep === 0 ? (
            <button
              type="button"
              className="btn btn-primary btn-sm absolute bottom-4 right-4 sm:right-8"
              onClick={() => goToStep(1)}
            >
              Suivant
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="intro-start btn btn-primary btn-sm absolute bottom-4 right-4 sm:right-8"
              onClick={startExploring}
            >
              Commencer à explorer
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          )}

          {/* Flèches en colonne, à droite de la zone : le défilement est vertical. */}
          <IntroStepControls
            current={activeStep}
            total={LAST_STEP}
            previousLabel="Palier précédent"
            onPrevious={() => goToStep(activeStep - 1)}
            isPreviousDisabled={activeStep === 0}
            nextLabel="Palier suivant"
            onNext={() => goToStep(activeStep + 1)}
            isNextDisabled={isLast}
            isReversed
          />
        </div>
      </div>
    </div>
  );
};

export default IntroOverviewScene;
