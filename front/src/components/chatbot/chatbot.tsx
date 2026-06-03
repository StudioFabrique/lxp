import { AnimatePresence } from "framer-motion";
import DrawerChatbot from "./drawer-chatbot";
import ChatbotButton from "./chatbot-button";
import useChatbot from "./hooks/use-chatbot";
import useChatbotUi from "./hooks/use-chatbot-ui";
import useChatBotQuiz from "./hooks/use-chatbot-quiz";

export default function Chatbot() {
  const chatbot = useChatbot();
  const chatbotUi = useChatbotUi(chatbot.dialog, chatbot.setDialog);
  const chatbotQuiz = useChatBotQuiz(
    chatbotUi.showChatbot,
    chatbotUi.handleOpenChatbot,
    chatbotUi.handleCloseChatbot,
  );

  return (
    <>
      {/* Ajouter ici la modal de quizz */}

      {/* Bouton d'ouverture animé */}
      <AnimatePresence>
        {!chatbotUi.showChatbot && (
          <ChatbotButton onOpenChatbot={chatbotUi.handleOpenChatbot} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatbotUi.showChatbot && (
          <DrawerChatbot
            chatbot={chatbot}
            chatbotUi={chatbotUi}
            chatbotQuiz={chatbotQuiz}
          />
        )}
      </AnimatePresence>
    </>
  );
}
