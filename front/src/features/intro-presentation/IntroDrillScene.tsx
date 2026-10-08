import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Check } from "lucide-react";

import type { IntroCard } from "./intro-content";
import { INTRO_LEVELS, INTRO_LEVEL_COUNT } from "./intro-levels";
import { gsap, prefersReducedMotion } from "./intro-motion";
import IntroDrillChatbot from "./IntroDrillChatbot";
import IntroLevelCard from "./IntroLevelCard";
import IntroLevelRail from "./IntroLevelRail";
import IntroSceneHeading from "./IntroSceneHeading";
import { useIntroGuide } from "./useIntroGuide";

type Props = {
  cards: IntroCard[];
  isSaving: boolean;
  /** Retour à la découverte par le scroll, depuis le premier niveau. */
  onBackToOverview: () => void;
  onComplete: () => void;
};

const LAST_DEPTH = INTRO_LEVEL_COUNT - 1;
const DURATION = 0.6;
/** Zone réservée au chatbot, à droite du composant qu'il explique. */
const PANEL_WIDTH = 440;
const PANEL_HEIGHT = 140;
const PANEL_GAP = 16;
/** Le chatbot attend l'arrivée de la carte avant de commencer à expliquer. */
const GUIDE_START_MS = 900;

/**
 * Descente niveau par niveau, pilotée par les clics.
 *
 * Les sept cartes restent montées : GSAP anime la carte qui arrive (elle grandit
 * depuis la ligne cliquée), recule la précédente et efface les plus anciennes.
 * Les transitions sont lancées par les clics, pas par un effet.
 */
const IntroDrillScene = ({
  cards,
  isSaving,
  onBackToOverview,
  onComplete,
}: Props) => {
  const [depth, setDepth] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  // Position de la ligne cliquée dans chaque carte, d'où revient la carte fille.
  const origins = useRef<number[]>([]);
  const hasInteracted = useRef(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const chatbotAnchorRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();
  // Dernier niveau dont la carte est arrivée : le chatbot ne parle qu'ensuite.
  const [readyDepth, setReadyDepth] = useState<number | null>(null);
  const isGuideReady = readyDepth === depth;

  // Arrivée depuis la pyramide repliée : la première carte se déploie.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const first = cardRefs.current[0];
    if (!first) return;
    const tween = gsap.fromTo(
      first,
      { opacity: 0, scale: 0.88, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "expo.out" },
    );
    return () => void tween?.kill();
  }, []);

  const goTo = (nextDepth: number) => {
    const duration = prefersReducedMotion() ? 0 : DURATION;
    const forward = nextDepth > depth;

    cardRefs.current.forEach((element, index) => {
      if (!element) return;
      const origin = `50% ${origins.current[index - 1] ?? 0}px`;

      if (index === nextDepth) {
        const arrive = {
          opacity: 1,
          scale: 1,
          rotationX: 0,
          y: 0,
          z: 0,
          duration,
          ease: "expo.out",
          overwrite: true,
        };
        if (forward) {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              scale: 0.32,
              rotationX: 22,
              y: 0,
              z: 0,
              transformOrigin: origin,
            },
            arrive,
          );
        } else {
          gsap.to(element, { ...arrive, transformOrigin: "50% 0%" });
        }
      } else if (index === nextDepth - 1) {
        gsap.to(element, {
          transformOrigin: "50% 0%",
          y: -58,
          z: -220,
          rotationX: 10,
          scale: 0.94,
          opacity: 0.3,
          duration,
          ease: "power3.inOut",
          overwrite: true,
        });
      } else if (index < nextDepth - 1) {
        gsap.to(element, {
          y: -104,
          z: -440,
          rotationX: 14,
          scale: 0.88,
          opacity: 0,
          duration,
          ease: "power2.inOut",
          overwrite: true,
        });
      } else {
        // Niveaux plus profonds que la destination : ils rentrent dans leur ligne.
        gsap.to(element, {
          transformOrigin: origin,
          opacity: 0,
          scale: 0.32,
          rotationX: 22,
          y: 0,
          z: 0,
          duration,
          ease: "power2.in",
          overwrite: true,
        });
      }
    });

    hasInteracted.current = true;
    setDepth(nextDepth);
  };

  const descend = (originY: number) => {
    origins.current[depth] = originY;
    goTo(depth + 1);
  };

  // Le clic a rendu la carte précédente inerte : le focus suit la nouvelle carte.
  useEffect(() => {
    if (hasInteracted.current) {
      cardRefs.current[depth]?.focus({ preventScroll: true });
    }
  }, [depth]);

  const current = cards[depth];
  const isLast = depth === LAST_DEPTH;

  // Le chatbot présente le niveau, puis chacun de ses composants l'un après l'autre.
  const stepCount = current.details.length + 1;
  const guideStep = useIntroGuide(stepCount, `depth-${depth}`, isGuideReady);
  const activeDetail = guideStep - 1;
  const guideMessage =
    activeDetail >= 0
      ? current.details[activeDetail].explanation
      : INTRO_LEVELS[depth].explanation;

  // À chaque changement de niveau, le chatbot attend que la carte soit arrivée.
  useEffect(() => {
    const timer = setTimeout(
      () => setReadyDepth(depth),
      prefersReducedMotion() ? 0 : GUIDE_START_MS,
    );
    return () => clearTimeout(timer);
  }, [depth]);

  // Le panneau du chatbot se pose à droite du composant expliqué (ou de la carte, pour le niveau).
  useLayoutEffect(() => {
    const area = areaRef.current;
    const card = cardRefs.current[depth];
    if (!area || !card) return;
    const section = activeDetail >= 0
      ? card.querySelectorAll<HTMLElement>("[data-intro-detail]")[activeDetail]
      : null;
    const centerY = section
      ? card.offsetTop + section.offsetTop + section.offsetHeight / 2
      : card.offsetTop + 40;
    const left = card.offsetLeft + card.offsetWidth + PANEL_GAP;
    setPanelStyle({
      left,
      top: Math.max(0, centerY - PANEL_HEIGHT / 2),
      width: Math.min(PANEL_WIDTH, Math.max(area.clientWidth - left, 0)),
      height: PANEL_HEIGHT,
    });
  }, [depth, activeDetail]);

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="relative flex min-h-full flex-col px-4 pb-16 pt-6 sm:px-8">
        <p className="sr-only" aria-live="polite">
          {current.title}
        </p>

        <div className="grid flex-1 items-center gap-6 pr-14 lg:grid-cols-[minmax(16rem,22rem)_1fr]">
          <div className="flex flex-col gap-8">
            <IntroSceneHeading />
            <IntroLevelRail
              activeIndex={depth}
              selectableUpTo={depth}
              onSelect={goTo}
            />
          </div>
          <div className="flex min-w-0 flex-col items-center gap-6">
            <div
              ref={areaRef}
              className="relative h-[46rem] w-full [perspective:1500px]"
            >
              {/* Zone du chatbot : il s'y place à côté du composant qu'il explique. */}
              <div
                data-onboarding-panel
                aria-hidden="true"
                style={panelStyle}
                className="pointer-events-none absolute"
              >
                <div ref={chatbotAnchorRef} />
              </div>
              <div className="relative size-full [transform-style:preserve-3d]">
                {cards.map((card, index) => (
                  <IntroLevelCard
                    key={card.levelId}
                    card={card}
                    index={index}
                    isCurrent={index === depth}
                    activeDetail={index === depth ? activeDetail : -1}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    onDescend={index < LAST_DEPTH ? descend : undefined}
                  />
                ))}
              </div>
            </div>
            <p className="text-center text-lg">
              {isLast
                ? "Vous avez atteint les activités : c'est ici que se trouve le contenu."
                : `Cliquez sur « ${current.rows[0].title} » pour descendre d'un niveau.`}
            </p>
          </div>
        </div>

        {isGuideReady ? (
          <IntroDrillChatbot
            scopeRef={chatbotAnchorRef}
            message={guideMessage}
            stepId={`drill-${depth}-${guideStep}`}
          />
        ) : null}

        {depth === 0 ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm absolute bottom-4 right-4 sm:right-8"
            onClick={onBackToOverview}
          >
            Revoir les niveaux
          </button>
        ) : null}

        {isLast ? (
          <button
            type="button"
            className="btn btn-primary btn-sm absolute bottom-4 right-4 sm:right-8"
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
        ) : null}
      </div>
    </div>
  );
};

export default IntroDrillScene;
