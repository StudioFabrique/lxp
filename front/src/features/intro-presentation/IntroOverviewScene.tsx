import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ArrowRight, Check, ChevronsUp } from "lucide-react";

import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import { OPENING_ANIMATION_MS } from "./intro-dialogue";
import {
  INTRO_PYRAMID_LEVELS,
  INTRO_PYRAMID_LEVEL_COUNT,
} from "./intro-levels";
import { ScrollTrigger, gsap, prefersReducedMotion } from "./intro-motion";
import IntroChatbot from "./IntroChatbot";
import IntroLevelDetail from "./IntroLevelDetail";
import IntroLevelRail from "./IntroLevelRail";
import IntroLevelStack from "./IntroLevelStack";
import IntroSceneHeading from "./IntroSceneHeading";
import { readableTextColor } from "../../utils/helpers/color-helpers";
import { useInstanceBranding } from "./useInstanceBranding";
import { useIntroGuide } from "./useIntroGuide";
import { useIntroPresentation } from "./useIntroPresentation";

type Props = {
  /** Une carte par niveau : l'élément retenu, ce qu'il contient et ses composants. */
  cards: IntroCard[];
  isSaving: boolean;
  /** Appelé quand l'utilisateur termine la présentation, au dernier niveau. */
  onComplete: () => void;
};

/** Palier 0 : présentation et chatbot ; paliers 1 à 7 : un niveau chacun. */
const LAST_STEP = INTRO_PYRAMID_LEVEL_COUNT;
/** Distance de défilement qui sépare deux paliers, en hauteurs de la zone. */
const STEP_HEIGHT_CQH = 70;
const PLATE_DEPTH = 60;

const pad = (value: number) => String(value).padStart(2, "0");
/** Délai après le dernier changement de palier avant que la pyramide soit au repos. */
const SETTLE_MS = 800;
/** Délai entre deux niveaux, où seul un léger mouvement de la pile subsiste. */
const NEXT_LEVEL_MS = 120;
/** Zone réservée au chatbot, sous le composant qu'il explique. */
const PANEL_WIDTH = 560;
const PANEL_HEIGHT = 200;
/** Largeur du détail du niveau, en part de la colonne, et son plafond en pixels. */
const DETAIL_SHARE = 0.46;
const DETAIL_MAX_WIDTH = 512;
const DETAIL_GAP = 24;
/** Réduction de la pile quand elle laisse la place au détail du niveau. */
const STACK_SCALE_WITH_DETAIL = 0.85;
/** Largeur de colonne en dessous de laquelle le détail passe sous la pyramide. */
const MIN_SIDE_BY_SIDE_WIDTH = 720;

/**
 * Découverte des niveaux par le défilement.
 *
 * Au palier 0, aucun niveau n'est sélectionné : la pyramide est vue du dessus
 * (presque en 2D) devant l'encadré « Organisme de formation », dont le nom est
 * affiché en grand, et le chatbot dialogue. Le sens est inversé : la zone
 * démarre en bas de son défilement et on progresse en défilant vers le haut. La
 * progression du scroll, inversée, pilote une timeline GSAP : la pile s'incline
 * puis se range sur le côté, et le détail du niveau se déploie depuis sa plaque
 * sans toucher aux autres plaques. Le chatbot explique le niveau puis chacun de
 * ses composants. Les boutons et le clavier déplacent la même zone, il n'y a
 * donc qu'une source de vérité.
 */
/** Couleurs des plaques quand aucun fond coloré ne les précède : celles du thème. */
const THEME_PLATE_COLORS = {
  glass: "var(--color-base-100)",
  text: "var(--color-base-content)",
};

const IntroOverviewScene = ({ cards, isSaving, onComplete }: Props) => {
  const { logoUrl, backgroundColor } = useInstanceBranding();
  // Sur un fond coloré (blanc, par exemple) les plaques de verre et leur texte prennent
  // ce fond et un texte lisible dessus, pour ne pas dépendre du thème clair ou sombre.
  const plateText = backgroundColor ? readableTextColor(backgroundColor) : undefined;
  const plateColors =
    backgroundColor && plateText
      ? { glass: backgroundColor, text: plateText }
      : THEME_PLATE_COLORS;
  // Avec la barre réduite de la première présentation, le titre prend la ligne libre à sa droite.
  const { sidebarPhase } = useIntroPresentation();
  const isCompactSidebar = sidebarPhase !== "normal";
  const scrollRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chatbotAnchorRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
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

  // Le chatbot attend la fin de l'ouverture animée pour ne pas la saccader.
  const [isChatbotReady, setIsChatbotReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(
      () => setIsChatbotReady(true),
      prefersReducedMotion() ? 0 : OPENING_ANIMATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  // Le chatbot explique le niveau, puis chacun de ses composants l'un après l'autre.
  const settledCard = settledStep >= 1 ? cards[settledStep] : undefined;
  const guideStep = useIntroGuide(
    (settledCard?.details.length ?? 0) + 1,
    `level-${settledStep}`,
    isChatbotReady && settledStep >= 1,
  );
  const activeDetail = settledCard ? guideStep - 1 : -1;
  const detailMessage =
    settledCard && activeDetail >= 0
      ? settledCard.details[activeDetail]?.explanation
      : undefined;
  const isDetailShown = settledStep >= 1 && activeStep >= 1;

  // Au palier d'un niveau, la zone du chatbot se pose sous le composant expliqué
  // ; au palier 0, elle reprend sa place de départ.
  useLayoutEffect(() => {
    const column = columnRef.current;
    const detail = detailRef.current;
    const stage = stageRef.current;
    if (!isDetailShown || !column || !detail || !stage || !settledCard) {
      // Introduction : la zone du chatbot se pose juste au-dessus du titre de l'organisme.
      const title = settledStep === 0
        ? stage?.querySelector<HTMLElement>(".intro-organisation-fade b")
        : null;
      if (column && title) {
        const columnRect = column.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const width = Math.min(PANEL_WIDTH, columnRect.width);
        setPanelStyle({
          left: (columnRect.width - width) / 2,
          top: Math.max(titleRect.top - columnRect.top - PANEL_HEIGHT - 8, 0),
          width,
          height: PANEL_HEIGHT,
          right: "auto",
          margin: 0,
        });
      } else {
        setPanelStyle(undefined);
      }
      return;
    }
    const columnRect = column.getBoundingClientRect();
    const detailRect = detail.getBoundingClientRect();
    const targetId = activeDetail >= 0 ? settledCard.details[activeDetail]?.id : undefined;
    const target =
      (targetId
        ? detail.querySelector<HTMLElement>(`[data-intro-detail="${targetId}"]`)
        : null) ?? detail.querySelector<HTMLElement>("header");
    const targetRect = (target ?? detail).getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, columnRect.width);
    const left = Math.min(
      Math.max(targetRect.left + targetRect.width / 2 - columnRect.left - width / 2, 0),
      columnRect.width - width,
    );
    const below = detailRect.bottom - columnRect.top + 12;
    const top =
      below + PANEL_HEIGHT <= columnRect.height
        ? below
        : Math.max(detailRect.top - columnRect.top - PANEL_HEIGHT - 12, 0);
    setPanelStyle({
      left,
      top,
      width,
      height: PANEL_HEIGHT,
      right: "auto",
      margin: 0,
    });
  }, [isDetailShown, settledCard, settledStep, activeDetail, isChatbotReady]);

  // Le détail se déploie depuis la plaque : il s'étire vers la droite, puis ses
  // parties apparaissent l'une après l'autre. Rien ne bouge dans la pyramide.
  useLayoutEffect(() => {
    const detail = detailRef.current;
    if (!detail || !isDetailShown || prefersReducedMotion()) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        detail,
        { scaleX: 0.35, opacity: 0, x: -56, transformOrigin: "0% 50%" },
        { scaleX: 1, opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.from(".intro-detail-part", {
        opacity: 0,
        y: 14,
        duration: 0.45,
        delay: 0.25,
        stagger: 0.07,
        ease: "power2.out",
      });
    }, detail.parentElement ?? detail);
    return () => context.revert();
  }, [isDetailShown, settledStep]);

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

      // L'encadré de l'organisme et la consigne s'effacent dès le premier palier ; les
      // plaques, qui reposent alors sur la page, reprennent les couleurs du thème.
      timeline.to([organisation, hint], { autoAlpha: 0, duration: 0.5 }, 0.1);
      timeline.set(
        stage.querySelector(".intro-plate-scope"),
        {
          "--intro-glass": THEME_PLATE_COLORS.glass,
          "--intro-plate-text": THEME_PLATE_COLORS.text,
        },
        0.3,
      );
      // La pile se redresse vers le lecteur, d'abord vite puis doucement.
      timeline.to(stack, { rotationX: 54, rotation: -12, duration: 1 }, 0);
      // La pyramide remonte en haut de la zone et se range sur la gauche, avec une
      // réduction légère : le détail du niveau prend la place libérée à droite.
      const column = columnRef.current;
      const container = stack?.parentElement;
      const columnWidth = column?.clientWidth ?? 0;
      const unit = container ? container.getBoundingClientRect().width / 700 : 1;
      const sideBySide = columnWidth >= MIN_SIDE_BY_SIDE_WIDTH && unit > 0;
      const detailWidth = Math.min(columnWidth * DETAIL_SHARE, DETAIL_MAX_WIDTH);
      const shift = sideBySide ? (detailWidth + DETAIL_GAP) / 2 / unit : 0;
      timeline.to(
        stack,
        {
          y: -70,
          x: -shift,
          scale: sideBySide ? STACK_SCALE_WITH_DETAIL : 1,
          duration: 1,
        },
        0,
      );
      timeline.to(
        stack,
        { rotationX: 46, rotation: -4, duration: LAST_STEP - 1 },
        1,
      );
    }, stage);

    return () => context.revert();
  }, []);

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

          <div className="grid min-h-0 flex-1 items-center gap-6 lg:grid-cols-[minmax(16rem,22rem)_1fr]">
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
                  organisationName={cards[0].title}
                  isOrganisationPlaceholder={cards[0].isPlaceholder}
                  logoUrl={logoUrl}
                  backgroundColor={backgroundColor}
                  plateColors={plateColors}
                  onSelect={(index) => goToStep(index + 1)}
                />
              </div>
              {isDetailShown && settledCard ? (
                <>
                  <div className={cn("mt-4 w-full lg:absolute lg:right-0 lg:z-10 lg:mt-0 lg:w-[min(46%,32rem)]",
                      // Sous le titre de la colonne ; le chatbot se place dessous.
                      isCompactSidebar ? "lg:top-0" : "lg:top-32",
                    )}>
                    <IntroLevelDetail
                      ref={detailRef}
                      card={settledCard}
                      index={settledStep}
                      activeDetail={activeDetail}
                    />
                  </div>
                </>
              ) : null}
              <p className="intro-scroll-hint flex items-center gap-2 text-sm text-base-content/70">
                <ChevronsUp className="size-4" aria-hidden="true" />
                Faire défiler vers le haut pour naviguer entre les différents
                niveaux
              </p>
            </div>
          </div>

          {isChatbotReady ? (
            <IntroChatbot
              scopeRef={chatbotAnchorRef}
              step={settledStep}
              detailMessage={detailMessage}
              guideStep={guideStep}
            />
          ) : null}

          {/* Numérotation du palier, en bas au milieu de la page. */}
          <p
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm tabular-nums"
            aria-label={`Palier ${activeStep} sur ${LAST_STEP}`}
          >
            <span className="text-xl font-bold text-primary">{pad(activeStep)}</span>
            <span className="text-base-content/60"> / {pad(LAST_STEP)}</span>
          </p>

          {/* En bas à droite : « Précédent », puis « Suivant » (même action que le défilement
              vers le haut) ou « Terminer la présentation » au dernier niveau. */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:right-8">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={activeStep === 0}
              onClick={() => goToStep(activeStep - 1)}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Précédent
            </button>
            {isLast ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={isSaving}
                onClick={onComplete}
              >
                {isSaving ? (
                  <span
                    className="loading loading-spinner loading-xs"
                    aria-hidden="true"
                  />
                ) : (
                  <Check className="size-4" aria-hidden="true" />
                )}
                Terminer la présentation
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => goToStep(activeStep + 1)}
              >
                Suivant
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroOverviewScene;
