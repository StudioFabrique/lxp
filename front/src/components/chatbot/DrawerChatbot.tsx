import useChatbot from "./hooks/useChatbot";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HeaderChatbot from "./chatbot-parts/headerChatbot";
import MessageChatbot from "./chatbot-parts/messageChatbot";
import MessageLoaderChatbot from "./chatbot-parts/messageLoaderChatbot";
import TextInputChatbot from "./chatbot-parts/textInputChatbot";

type Props = {
  setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerChatbot({ setShowChatbot }: Props) {
  const { dialog, handleSubmit, isLoading, prompt, setPrompt } = useChatbot();

  const ref = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialog, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-5 right-6 w-[24rem] max-w-[calc(100vw-3rem)] h-152 max-h-[calc(100vh-8rem)] bg-base-100 z-50 rounded-2xl shadow-2xl border border-base-300 flex flex-col overflow-hidden"
    >
      {/* En-tête du Chatbot */}
      <HeaderChatbot onClose={() => setShowChatbot(false)} />

      {/* Zone de chat (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 bg-base-200/30 space-y-4">
        {dialog.map((message, index) => (
          <MessageChatbot
            key={index}
            message={message}
            isLoading={isLoading}
            messageLoader={<MessageLoaderChatbot />}
          />
        ))}

        {/* Div invisible pour scroller en bas */}
        <div ref={ref} className="h-1" />
      </div>

      {/* Zone de saisie (Fixée en bas) */}
      <TextInputChatbot
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </motion.div>
  );
}
