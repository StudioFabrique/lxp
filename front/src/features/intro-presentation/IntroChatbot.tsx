import { useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";

import AuthChatbotDialogue from "../auth/components/AuthChatbotDialogue";
import {
  INTRO_HELP,
  LEVEL_TYPING_MS,
  OVERVIEW_DIALOGUE,
  typingDuration,
} from "./intro-dialogue";
import { INTRO_ARRIVAL_DELAY_S, INTRO_CHATBOT_SETTLE_MS } from "./intro-chatbot-arrival";
import { INTRO_PYRAMID_LEVELS } from "./intro-levels";
import IntroDialogueNav from "./IntroDialogueNav";
import { useIntroGuide, type IntroGuide } from "./useIntroGuide";

type Props = {
  /** Élément placé dans la section de la présentation : l’assistant virtuel cherche sa place dans cette zone. */
  scopeRef: RefObject<HTMLDivElement | null>;
  /** Palier de la découverte : 0 pour l'introduction, puis un niveau de la pyramide par palier. */
  step: number;
  /** Explication d'un composant du niveau (groupes, tags...), qui remplace celle du niveau. */
  detailMessage?: string;
  /** Explications du niveau, lues avec « Précédent » et « Suivant » : l’assistant virtuel se déplace à chaque changement. */
  guide: IntroGuide;
  /** Passe à l'étape suivante : proposé comme « Continuer » au dernier message de chaque étape. */
  onContinue: () => void;
};

/**
 * L’assistant virtuel de l'onboarding, déplaçable et avec ses questions d'aide. Au
 * palier d'introduction il présente ses messages un à un ; ensuite il explique le niveau
 * courant, puis chacun de ses composants, en se plaçant à côté d'eux.
 */
const IntroChatbot = ({ scopeRef, step, detailMessage, guide, onContinue }: Props) => {
  // Le premier message attend que l'assistant virtuel ait fini de rejoindre sa place depuis le bas de l'écran.
  const reducedMotion = useReducedMotion();
  const [firstDelay] = useState(reducedMotion ? 0 : INTRO_ARRIVAL_DELAY_S);
  const overview = useIntroGuide(OVERVIEW_DIALOGUE.length, "overview");
  const level = INTRO_PYRAMID_LEVELS[step - 1];
  const sequence = level ? guide : overview;
  const text =
    detailMessage ?? (level ? level.explanation : OVERVIEW_DIALOGUE[overview.step]);
  const message = (
    <>
      {text}
      <IntroDialogueNav
        previous={sequence.previous}
        next={sequence.next}
        additionalAction={{
          label: "Continuer",
          icon: <ArrowDown className="size-3" aria-hidden="true" />,
          onClick: onContinue,
        }}
      />
    </>
  );

  return (
    <AuthChatbotDialogue
      introduction={false}
      compact
      delay={firstDelay}
      placementDelayMs={reducedMotion ? 0 : INTRO_CHATBOT_SETTLE_MS}
      message={message}
      help={INTRO_HELP}
      typingMs={level ? LEVEL_TYPING_MS : typingDuration(text)}
      scopeRef={scopeRef}
      stepId={
        level ? `intro-level-${level.id}-${guide.step}` : `intro-${overview.step}`
      }
    />
  );
};

export default IntroChatbot;
