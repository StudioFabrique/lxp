import { useContext, useId, useLayoutEffect, useRef, type ReactNode } from "react";
import AuthChatbotDialogue from "./AuthChatbotDialogue";
import { AuthChatbotHostContext } from "./AuthChatbotHostContext";

type Props = { message?: ReactNode; introduction?: boolean; delay?: number; compact?: boolean };

export default function AuthOnboardingChatbot(props: Props) {
  const register = useContext(AuthChatbotHostContext);
  const anchorRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { message, compact, delay, introduction = true } = props;
  useLayoutEffect(() => {
    if (!introduction && register) register({ message, compact, delay, scopeRef: anchorRef, stepId: id });
  }, [register, introduction, message, compact, delay, id]);
  if (introduction || !register) return <AuthChatbotDialogue {...props} />;
  return <div ref={anchorRef} aria-hidden="true" />;
}
