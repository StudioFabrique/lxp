import type { RefObject } from "react";

import AuthChatbotDialogue from "../auth/components/AuthChatbotDialogue";
import {
  INTRO_HELP,
  OVERVIEW_DIALOGUE,
  typingDuration,
} from "./intro-dialogue";
import { useIntroDialogueStep } from "./useIntroDialogueStep";

type Props = {
  /** Élément placé dans la section de la présentation : le chatbot cherche sa place dans cette zone. */
  scopeRef: RefObject<HTMLDivElement | null>;
};

/**
 * Le chatbot de l'onboarding, déplaçable et avec ses questions d'aide, pour le
 * palier d'introduction. Chaque message le fait se déplacer vers un autre
 * espace libre. Dès le premier niveau, la présentation le retire et le chatbot
 * de l'application reprend sa place en bas à droite.
 */
const IntroChatbot = ({ scopeRef }: Props) => {
  const step = useIntroDialogueStep(OVERVIEW_DIALOGUE);
  const message = OVERVIEW_DIALOGUE[step];

  return (
    <AuthChatbotDialogue
      introduction={false}
      compact
      message={message}
      help={INTRO_HELP}
      typingMs={typingDuration(message)}
      scopeRef={scopeRef}
      stepId={`intro-${step}`}
    />
  );
};

export default IntroChatbot;
