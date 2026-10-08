import type { RefObject } from "react";

import AuthChatbotDialogue from "../auth/components/AuthChatbotDialogue";
import {
  INTRO_HELP,
  LEVEL_TYPING_MS,
  OVERVIEW_DIALOGUE,
  typingDuration,
} from "./intro-dialogue";
import { INTRO_PYRAMID_LEVELS } from "./intro-levels";
import { useIntroDialogueStep } from "./useIntroDialogueStep";

type Props = {
  /** Élément placé dans la section de la présentation : le chatbot cherche sa place dans cette zone. */
  scopeRef: RefObject<HTMLDivElement | null>;
  /** Palier de la découverte : 0 pour l'introduction, puis un niveau de la pyramide par palier. */
  step: number;
};

/**
 * Le chatbot de l'onboarding, déplaçable et avec ses questions d'aide. Au
 * palier d'introduction il enchaîne ses messages ; ensuite il explique le niveau
 * courant. Chaque message le fait se déplacer vers un autre espace libre.
 */
const IntroChatbot = ({ scopeRef, step }: Props) => {
  const dialogueStep = useIntroDialogueStep(OVERVIEW_DIALOGUE);
  const level = INTRO_PYRAMID_LEVELS[step - 1];
  const message = level ? level.explanation : OVERVIEW_DIALOGUE[dialogueStep];

  return (
    <AuthChatbotDialogue
      introduction={false}
      compact
      message={message}
      help={INTRO_HELP}
      typingMs={level ? LEVEL_TYPING_MS : typingDuration(message)}
      scopeRef={scopeRef}
      stepId={level ? `intro-level-${level.id}` : `intro-${dialogueStep}`}
    />
  );
};

export default IntroChatbot;
