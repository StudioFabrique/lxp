import { AnimatePresence } from "framer-motion";
import DrawerChatbot from "./drawer-chatbot";
import ChatbotButton from "./chatbot-button";
import useChatbot from "./hooks/use-chatbot";
import useChatbotUi from "./hooks/use-chatbot-ui";
import useChatBotQuiz from "./hooks/use-chatbot-quiz";
import QuizModal from "../../components/quiz/modals/quiz-modal";
import { useContext } from "react";
import { ChatbotContext } from "../../store/ChatbotProvider";

export default function Chatbot() {
  const { forceHideChatbot } = useContext(ChatbotContext);

  const chatbot = useChatbot();
  const chatbotUi = useChatbotUi(chatbot.dialog, chatbot.setDialog);
  const chatbotQuiz = useChatBotQuiz(
    chatbotUi.showChatbot,
    chatbotUi.handleOpenChatbot,
    chatbotUi.handleCloseChatbot,
  );

  const { quizState } = chatbotQuiz;

  return (
    <>
      {/* Bouton d'ouverture animé */}
      <AnimatePresence>
        {!chatbotUi.showChatbot && !forceHideChatbot && (
          <ChatbotButton onOpenChatbot={chatbotUi.handleOpenChatbot} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatbotUi.showChatbot && !forceHideChatbot && (
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
