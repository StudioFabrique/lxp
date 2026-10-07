import { useEffect, useMemo, useRef, useState } from "react";
import { SkipForward } from "lucide-react";

import {
  AuthChatbotTransitionContext,
  type ChatbotMemory,
  type ChatbotMemoryAccess,
} from "../auth/components/AuthChatbotTransitionContext";
import { useIntroCards } from "./useIntroCards";
import IntroChatbot from "./IntroChatbot";
import IntroDrillScene from "./IntroDrillScene";
import IntroOverviewScene from "./IntroOverviewScene";
import IntroSceneHeading from "./IntroSceneHeading";
import { useIntroPresentation } from "./useIntroPresentation";

type Props = {
  isSaving: boolean;
  onSkip: () => void;
  onComplete: () => void;
};

/**
 * Présentation de la méthodologie, affichée dans la zone de contenu du layout :
 * découverte des niveaux par le scroll, puis descente par les clics jusqu'aux
 * activités.
 */
type Phase = "overview" | "drill";

const IntroPresentation = ({ isSaving, onSkip, onComplete }: Props) => {
  const { setChatbotHidden } = useIntroPresentation();
  const [overviewStep, setOverviewStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("overview");
  const { cards, isLoading } = useIntroCards(true);
  const rootRef = useRef<HTMLElement>(null);
  const chatbotAnchorRef = useRef<HTMLDivElement>(null);
  // Position et geste du chatbot, conservés d'une phase à l'autre pour qu'il se déplace au lieu de réapparaître.
  const memory = useRef<ChatbotMemory>({ position: null, gesture: null, introAvatar: null });
  const chatbotMemory = useMemo<ChatbotMemoryAccess>(
    () => ({
      getPosition: () => memory.current.position,
      setPosition: (position) => { memory.current.position = position; },
      getGesture: () => memory.current.gesture,
      setGesture: (gesture) => { memory.current.gesture = gesture; },
      getIntroAvatar: () => memory.current.introAvatar,
      setIntroAvatar: (rect) => { memory.current.introAvatar = rect; },
    }),
    [],
  );

  // Au palier d'introduction, le chatbot de la présentation remplace celui de
  // l'application ; dès le premier niveau, ce dernier reprend sa place.
  const isIntroduction = phase === "overview" && overviewStep === 0;
  useEffect(() => {
    setChatbotHidden(isIntroduction);
    return () => setChatbotHidden(false);
  }, [isIntroduction, setChatbotHidden]);

  // La page qui était affichée vient de disparaître : le focus passe ici.
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <AuthChatbotTransitionContext value={chatbotMemory}>
    <section
      ref={rootRef}
      tabIndex={-1}
      aria-labelledby="intro-presentation-title"
      className="absolute inset-0 overflow-hidden outline-none"
    >
      {phase === "overview" ? (
        <IntroOverviewScene
          chatbotAnchorRef={chatbotAnchorRef}
          onStepChange={setOverviewStep}
          onContinue={() => setPhase("drill")}
        />
      ) : isLoading ? (
        <div className="grid h-full place-items-center" role="status">
          <div className="sr-only">
            <IntroSceneHeading />
            Préparation de la présentation
          </div>
          <span
            className="loading loading-spinner loading-lg text-primary"
            aria-hidden="true"
          />
        </div>
      ) : (
        <IntroDrillScene
          cards={cards}
          isSaving={isSaving}
          onBackToOverview={() => setPhase("overview")}
          onComplete={onComplete}
        />
      )}

      {isIntroduction ? <IntroChatbot scopeRef={chatbotAnchorRef} /> : null}

      <button
        type="button"
        className="btn btn-ghost btn-sm absolute bottom-4 left-4 z-10"
        disabled={isSaving}
        onClick={onSkip}
      >
        <SkipForward className="size-4" aria-hidden="true" />
        Ignorer la présentation
      </button>
    </section>
    </AuthChatbotTransitionContext>
  );
};

export default IntroPresentation;
