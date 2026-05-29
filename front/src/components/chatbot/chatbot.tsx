import { AnimatePresence } from "framer-motion";
import DrawerChatbot from "./drawer-chatbot";
import ChatbotButton from "./chatbot-button";
import useChatbot from "./hooks/use-chatbot";
import useChatbotUi from "./hooks/use-chatbot-ui";

export default function Chatbot() {
  const chatbot = useChatbot();
  const chatbotUi = useChatbotUi(chatbot.dialog, chatbot.setDialog);

  return (
    <>
      {/* Bouton d'ouverture animé */}
      <AnimatePresence>
        {!chatbotUi.showChatbot && (
          <ChatbotButton onOpenChatbot={chatbotUi.handleOpenChatbot} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatbotUi.showChatbot && (
          <DrawerChatbot chatbot={chatbot} chatbotUi={chatbotUi} />
        )}
      </AnimatePresence>
    </>
  );
}
