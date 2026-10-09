import { useEffect, useMemo, useRef } from "react";
import { SkipForward } from "lucide-react";

import {
  AuthChatbotTransitionContext,
  type ChatbotMemory,
  type ChatbotMemoryAccess,
} from "../auth/components/AuthChatbotTransitionContext";
import { useIntroCards } from "./useIntroCards";
import IntroOverviewScene from "./IntroOverviewScene";
import IntroSceneHeading from "./IntroSceneHeading";
import { useIntroPresentation } from "./useIntroPresentation";
import { useIntroSpaceReady } from "./useIntroSpaceReady";

type Props = {
  isSaving: boolean;
  onSkip: () => void;
  onComplete: () => void;
};

/**
 * Présentation de la méthodologie, affichée dans la zone de contenu du layout :
 * découverte des niveaux par le scroll, le détail de chaque niveau se déployant
 * à côté de sa plaque, jusqu'aux activités.
 */
const IntroPresentation = ({ isSaving, onSkip, onComplete }: Props) => {
  const { setChatbotHidden } = useIntroPresentation();
  const { cards, isLoading } = useIntroCards(true);
  // Les titres réels sont attendus, mais jamais plus de quelques secondes.
  const isReady = useIntroSpaceReady(isLoading);
  const rootRef = useRef<HTMLElement>(null);
  // Position et geste du chatbot, conservés d'une étape à l'autre pour qu'il se déplace au lieu de réapparaître.
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

  // Pendant toute la présentation, son chatbot remplace celui de l'application.
  useEffect(() => {
    setChatbotHidden(true);
    return () => setChatbotHidden(false);
  }, [setChatbotHidden]);

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
      className="absolute inset-0 select-none overflow-hidden outline-none"
    >
      {isReady ? (
        <IntroOverviewScene
          cards={cards}
          isSaving={isSaving}
          onComplete={onComplete}
        />
      ) : (
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
      )}

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
