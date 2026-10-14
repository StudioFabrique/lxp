import { AnimatePresence } from "motion/react";
import { useContext } from "react";
import ChatbotAssistant from "./chatbot-assistant";
import DrawerChatbot from "./drawer-chatbot";
import useChatbot from "../hooks/use-chatbot";
import useChatbotUi from "../hooks/use-chatbot-ui";
import useChatBotQuiz from "../hooks/use-chatbot-quiz";
import QuizModal from "../../quiz/components/modals/quiz-modal";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import { useDemoMode } from "../../../store/DemoContext";

type Props = {
  enableQuizSuggestion?: boolean;
};

export default function Chatbot({ enableQuizSuggestion = false }: Props) {
  const { forceHideChatbot } = useContext(ChatbotContext);
  // Sans IA, l'assistant virtuel reste là pour guider dans l'interface : ni historique, ni question, ni quiz.
  const { aiDisabled } = useDemoMode();
  const aiEnabled = !aiDisabled;

  const chatbot = useChatbot({ enabled: aiEnabled });
  const chatbotUi = useChatbotUi(chatbot.dialog, chatbot.setDialog);
  const chatbotQuiz = useChatBotQuiz(
    chatbotUi.showChatbot,
    chatbotUi.handleCloseChatbot,
    enableQuizSuggestion && aiEnabled,
  );

  const { quizState } = chatbotQuiz;

  return (
    <>
      <ChatbotAssistant
        aiEnabled={aiEnabled}
        enableQuizSuggestion={enableQuizSuggestion}
        hidden={chatbotUi.showChatbot || forceHideChatbot}
        chatbot={chatbot}
        chatbotUi={chatbotUi}
        chatbotQuiz={chatbotQuiz}
      />

      <AnimatePresence>
        {aiEnabled && chatbotUi.showChatbot && !forceHideChatbot && (
          <DrawerChatbot
            chatbot={chatbot}
            chatbotUi={chatbotUi}
            chatbotQuiz={chatbotQuiz}
          />
        )}
      </AnimatePresence>

      <QuizModal
        isOpen={quizState.isOpen}
        quiz={quizState.currentQuiz}
        currentIndex={quizState.currentIndex}
        totalQuizzes={quizState.quizzes?.length || 0}
        isAnswered={quizState.isAnswered}
        isCorrect={quizState.isCorrect}
        isStreaming={quizState.isStreaming}
        isReplacing={quizState.isReplacing}
        showResults={quizState.showResults}
        attempts={quizState.attempts || []}
        score={quizState.score}
        onClose={quizState.onCloseQuizzes}
        onReport={quizState.onReportQuizQuestion}
        onAnswer={quizState.onAnswerQuiz}
        onNext={quizState.onNextQuiz}
      />
    </>
  );
}
