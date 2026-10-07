import { useMemo, useState, type PropsWithChildren } from "react";
import { AuthChatbotHostContext, type ChatbotHost, type ChatbotStep } from "./AuthChatbotHostContext";
import AuthChatbotDialogue from "./AuthChatbotDialogue";

export default function AuthChatbotProvider({ children }: PropsWithChildren) {
  const [step, setStep] = useState<ChatbotStep | null>(null);
  const host = useMemo<ChatbotHost>(() => ({
    register: setStep,
    unregister: (stepId) => setStep((current) => (current?.stepId === stepId ? null : current)),
  }), []);
  return <AuthChatbotHostContext value={host}>
    {children}
    {step && <AuthChatbotDialogue {...step} introduction={false} />}
  </AuthChatbotHostContext>;
}
