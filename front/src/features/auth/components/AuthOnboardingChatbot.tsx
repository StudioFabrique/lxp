import { useContext, useId, useLayoutEffect, useRef, type ReactNode } from "react";
import AuthChatbotDialogue from "./AuthChatbotDialogue";
import { AuthChatbotHostContext, type ChatbotHelp } from "./AuthChatbotHostContext";

type Props = { message?: ReactNode; help?: ChatbotHelp; introduction?: boolean; delay?: number; compact?: boolean; typingMs?: number };

export default function AuthOnboardingChatbot(props: Props) {
  const host = useContext(AuthChatbotHostContext);
  const anchorRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { message, help, compact, delay, typingMs, introduction = true } = props;
  useLayoutEffect(() => {
    if (!introduction && host) host.register({ message, help, compact, delay, typingMs, scopeRef: anchorRef, stepId: id });
  }, [host, introduction, message, help, compact, delay, typingMs, id]);
  // Le layout reste monté d'une page à l'autre : sans ce retrait, le chatbot d'une page quittée reste affiché.
  useLayoutEffect(() => () => host?.unregister(id), [host, id]);
  if (introduction || !host) return <AuthChatbotDialogue {...props} />;
  return <div ref={anchorRef} aria-hidden="true" />;
}
