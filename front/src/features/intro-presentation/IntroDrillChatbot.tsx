import type { RefObject } from "react";

import AuthChatbotDialogue from "../auth/components/AuthChatbotDialogue";
import { INTRO_DRILL_HELP, LEVEL_TYPING_MS } from "./intro-dialogue";

type Props = {
  /** Panneau placé à côté du composant expliqué : le chatbot s'y installe. */
  scopeRef: RefObject<HTMLDivElement | null>;
  message: string;
  /** Change à chaque message : le chatbot se déplace alors vers le nouveau panneau. */
  stepId: string;
};

/** Chatbot de la descente : il explique le niveau, puis chacun de ses composants. */
const IntroDrillChatbot = ({ scopeRef, message, stepId }: Props) => (
  <AuthChatbotDialogue
    introduction={false}
    compact
    message={message}
    help={INTRO_DRILL_HELP}
    typingMs={LEVEL_TYPING_MS}
    scopeRef={scopeRef}
    stepId={stepId}
  />
);

export default IntroDrillChatbot;
