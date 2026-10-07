import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { ArrowRight } from "lucide-react";

import { INTRO_LEVELS, INTRO_LEVEL_COUNT } from "./intro-levels";
import { gsap, prefersReducedMotion } from "./intro-motion";
import IntroExplanationCard from "./IntroExplanationCard";
import IntroLevelRail from "./IntroLevelRail";
import IntroLevelStack from "./IntroLevelStack";
import IntroSceneHeading from "./IntroSceneHeading";
import IntroStepControls from "./IntroStepControls";

type Props = {
  /** Ancre du chatbot de l'introduction, placée dans l'espace vide au-dessus de la pyramide. */
  chatbotAnchorRef: RefObject<HTMLDivElement | null>;
  /** Informe de chaque changement de palier (0 : introduction). */
  onStepChange: (step: number) => void;
  /** Appelé quand l'utilisateur a vu tous les niveaux et passe à l'exploration. */
  onContinue: () => void;
};

/** Palier 0 : présentation et chatbot ; paliers 1 à 7 : un niveau chacun. */
const LAST_STEP = INTRO_LEVEL_COUNT;
/** Distance de défilement qui sépare deux paliers, en hauteurs de la zone. */
const STEP_HEIGHT_CQH = 70;
const PLATE_DEPTH = 60;

/**
 * Découverte des sept niveaux par le défilement.
 *
 * Au palier 0, aucun niveau n'est sélectionné : la pile est très inclinée vers
 * le lecteur, son titre est au-dessus et le chatbot dialogue. Ensuite le scroll
 * pilote une timeline GSAP : la pile se redresse, l'explication du niveau
 * remplace le titre en haut. Les boutons et
 * le clavier avancent d'un palier en faisant défiler la même zone, il n'y a
 * donc qu'une source de vérité.
 */
const IntroOverviewScene = ({
  chatbotAnchorRef,
  onStepChange,
  onContinue,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => onStepChange(activeStep), [activeStep, onStepChange]);

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
      const cards = gsap.utils.toArray<HTMLElement>(".intro-explanation", stage);
      const prologue = gsap.utils.toArray<HTMLElement>(".intro-prologue", stage);

      // Pile vue presque de face, à peine inclinée, plaques posées en profondeur.
      gsap.set(stack, { rotationX: 18, rotation: -6 });
      plates.forEach((plate, index) =>
        gsap.set(plate, { z: index * PLATE_DEPTH }),
      );

      if (!reduced) {
        // Mouvement de caméra de bas en haut : on part du côté de la pyramide,
        // vue rasante en gradins, puis la caméra monte jusqu'à la vue de départ.
        gsap.from(tilt, {
          rotationX: 38,
          duration: 2.4,
          delay: 0.2,
          ease: "power2.inOut",
        });
        // Les plaques se montent de la base vers le sommet pendant la montée.
        gsap.from(plates, {
          opacity: 0,
          duration: 0.6,
          ease: "power1.out",
          stagger: 0.12,
        });
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: spacer,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 0.6,
          snap: {
            snapTo: 1 / LAST_STEP,
            // Le palier le plus proche, quelle que soit la vitesse du geste.
            directional: false,
            inertia: false,
            duration: { min: 0.2, max: 0.5 },
            ease: "power1.inOut",
          },
          onUpdate: (self) => setActiveStep(Math.round(self.progress * LAST_STEP)),
        },
      });

      // Le titre s'efface dès que le défilement commence.
      timeline.to(
        prologue,
        { autoAlpha: 0, y: -16, duration: 0.5 },
        0.1,
      );
      // La pile se redresse vers le lecteur, d'abord vite puis doucement.
      timeline.to(stack, { rotationX: 54, rotation: -12, duration: 1 }, 0);
      // La pyramide descend un peu pour laisser la place à l'explication.
      timeline.to(stack, { y: 28, duration: 1 }, 0);
      timeline.to(stack, { rotationX: 46, rotation: -4, duration: LAST_STEP - 1 }, 1);

      // Chaque explication cède la place à la suivante ; aux paliers, elle est entière.
      cards.forEach((card, index) => {
        const step = index + 1;
        timeline.fromTo(
          card,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.4 },
          step - 0.5,
        );
        if (step < LAST_STEP) {
          timeline.to(card, { opacity: 0, y: -24, duration: 0.4 }, step + 0.1);
        }
      });
    }, stage);

    return () => context.revert();
  }, []);

  const goToStep = (step: number) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const clamped = Math.min(Math.max(step, 0), LAST_STEP);
    const distance = scroller.scrollHeight - scroller.clientHeight;
    scroller.scrollTo({
      top: (distance / LAST_STEP) * clamped,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: 1,
      PageDown: 1,
      ArrowUp: -1,
      PageUp: -1,
    };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    goToStep(activeStep + move);
  };

  const levelIndex = activeStep - 1;
  const level = INTRO_LEVELS[levelIndex];
  const isLast = activeStep === LAST_STEP;

  return (
    // La zone de défilement est atteignable au clavier : ses flèches changent de palier.
    <div
      ref={scrollRef}
      tabIndex={0}
      role="region"
      aria-label="Découverte des niveaux, utilisez les flèches haut et bas"
      onKeyDown={handleKeyDown}
      className="absolute inset-0 overflow-y-auto overscroll-contain [container-type:size]"
    >
      <div
        ref={spacerRef}
        style={{ height: `${100 + LAST_STEP * STEP_HEIGHT_CQH}cqh` }}
      >
        <div
          ref={stageRef}
          className="sticky top-0 flex h-[100cqh] flex-col px-4 pb-16 pt-10 sm:px-8"
        >
          <p className="sr-only" aria-live="polite">
            {level
              ? `${level.label} : ${level.explanation}`
              : "Comment s'organisent vos contenus ?"}
          </p>

          <div className="grid min-h-0 flex-1 items-center gap-6 pr-14 lg:grid-cols-[minmax(16rem,22rem)_1fr]">
            <IntroLevelRail
              activeIndex={levelIndex}
              selectableUpTo={INTRO_LEVEL_COUNT - 1}
              onSelect={(index) => goToStep(index + 1)}
            />
            <div className="relative flex min-w-0 flex-col items-center self-stretch">
              {/* Titre puis explications partagent la même cellule : à chaque
                  palier, l'explication du niveau remplace le titre. */}
              <div className="grid min-h-32 w-full shrink-0 place-items-center">
                <div className="intro-prologue col-start-1 row-start-1">
                  <IntroSceneHeading className="text-center" />
                </div>
                {INTRO_LEVELS.map((item) => (
                  <IntroExplanationCard key={item.id} level={item} />
                ))}
              </div>
              {/* Zone réservée au chatbot : le calcul de placement de l'onboarding
                  ignore la pyramide 3D et le restreint à l'espace de ce panneau,
                  vide entre le titre et la pyramide. */}
              <div
                data-onboarding-panel
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-52 w-full max-w-xl"
              >
                <div ref={chatbotAnchorRef} />
              </div>
              <div className="flex flex-1 items-center">
                <IntroLevelStack activeIndex={levelIndex} />
              </div>
            </div>
          </div>

          {/* Flèches en colonne, à droite de la zone : le défilement est vertical. */}
          <IntroStepControls
            current={activeStep}
            total={INTRO_LEVEL_COUNT}
            previousLabel="Palier précédent"
            onPrevious={() => goToStep(activeStep - 1)}
            isPreviousDisabled={activeStep === 0}
            nextLabel="Palier suivant"
            onNext={() => goToStep(activeStep + 1)}
            isNextDisabled={isLast}
          />

          <div className="absolute bottom-4 right-4 flex items-center gap-4 sm:right-8">
            {isLast ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onContinue}
              >
                Explorer en cliquant
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroOverviewScene;
