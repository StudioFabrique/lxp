import { useContext, useEffect } from "react";
import { ChatbotContext } from "../store/chatbotContext";

export default function useChatBotQuiz(onTriggerRandomQuiz: () => void) {
  const { hasTrigerredAQuiz } = useContext(ChatbotContext);

  useEffect(() => {
    if (hasTrigerredAQuiz) {
      onTriggerRandomQuiz();
    }
  }, [hasTrigerredAQuiz, onTriggerRandomQuiz]);
}
