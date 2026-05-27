import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DrawerChatbot from "./drawer-chatbot";
import ChatbotButton from "./chatbot-button";
import useChatbot from "./hooks/use-chatbot";
import useChatbotUi from "./hooks/use-chatbot-ui";

export default function Chatbot() {
  const chatbot = useChatbot();
  const chatbotUi = useChatbotUi(chatbot.dialog);

  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      {/* Bouton d'ouverture animé */}
      <AnimatePresence>
        {!showChatbot && (
          <ChatbotButton
            showChatbot={showChatbot}
            setShowChatbot={setShowChatbot}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChatbot && (
          <DrawerChatbot
            chatbot={chatbot}
            chatbotUi={chatbotUi}
            setShowChatbot={setShowChatbot}
          />
        )}
      </AnimatePresence>
    </>
  );
}
