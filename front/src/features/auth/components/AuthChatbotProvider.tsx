import { useState, type PropsWithChildren } from "react";
import { AuthChatbotHostContext, type ChatbotStep } from "./AuthChatbotHostContext";
import AuthChatbotDialogue from "./AuthChatbotDialogue";

export default function AuthChatbotProvider({ children }: PropsWithChildren) {
  const [step, setStep] = useState<ChatbotStep | null>(null);
  return <AuthChatbotHostContext value={setStep}>
    {children}
    {step && <AuthChatbotDialogue {...step} introduction={false} />}
  </AuthChatbotHostContext>;
}
