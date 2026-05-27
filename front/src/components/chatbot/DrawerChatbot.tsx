import useChatbot from "./hooks/useChatbot";
import { motion } from "framer-motion";
import HeaderChatbot from "./chatbot-parts/headerChatbot";
import MessageChatbot from "./chatbot-parts/messageChatbot";
import MessageLoaderChatbot from "./chatbot-parts/messageLoaderChatbot";
import TextInputChatbot from "./chatbot-parts/textInputChatbot";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import useChatbotUi from "./hooks/useChatbotUi";
import PrebuiltPrompt from "./chatbot-parts/prebuiltPrompt";

type Props = {
  setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerChatbot({ setShowChatbot }: Props) {
  const { dialog, onSubmit, isLoading, prompt, setPrompt } = useChatbot();

  const chatbotUi = useChatbotUi(dialog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chatbotUi.setIsSubmitButtonAnimated(false);
    chatbotUi.setSize("large");
    chatbotUi.handleScrollToBottom();
    onSubmit(e);
  };

  const handleSetPrebuiltPrompt = (prompt: string) => {
    setPrompt(prompt);
    chatbotUi.setIsSubmitButtonAnimated(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95, width: 380, height: 500 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        width:
          chatbotUi.size === "full"
            ? "100%"
            : chatbotUi.size === "large"
              ? 750
              : 380,
        height:
          chatbotUi.size === "full"
            ? "100vh"
            : chatbotUi.size === "large"
              ? 700
              : 500,
      }}
      exit={{ opacity: 0, y: 20, scale: 0.95, width: 380, height: 500 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-5 right-6 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] bg-base-100 z-50 rounded-2xl shadow-2xl border border-base-300 flex flex-col overflow-hidden"
    >
      {/* En-tête du Chatbot */}
      <HeaderChatbot
        size={chatbotUi.size}
        onChangeSize={() => {
          if (chatbotUi.size === "full") {
            chatbotUi.setSize("large");
          } else {
            chatbotUi.setSize("full");
          }
        }}
        onClose={() => setShowChatbot(false)}
      />

      {/* Zone de chat */}
      <div
        ref={chatbotUi.scrollContainerRef}
        onScroll={chatbotUi.handleScrollEvent}
        className="flex-1 overflow-y-auto p-4 bg-base-200/30 space-y-4 relative flex flex-col"
      >
        <div className="flex-1 space-y-4">
          {dialog.map((message, index) => {
            const isLastMessage = index === dialog.length - 1;
            return (
              <MessageChatbot
                key={index}
                message={message}
                isLoading={isLoading}
                messageLoader={<MessageLoaderChatbot />}
                isLastMessage={isLastMessage}
              />
            );
          })}
          {!isLoading && (
            <PrebuiltPrompt setPrebuiltPrompt={handleSetPrebuiltPrompt} />
          )}
        </div>

        {/* Boutons flottants par dessus le chat */}
        <div className="sticky bottom-2 right-0 pointer-events-none flex flex-col items-center gap-2 z-20">
          {/* Bouton pour remonter */}
          {chatbotUi.showScrollTop && (
            <button
              onClick={chatbotUi.handleScrollToTop}
              className="pointer-events-auto btn btn-neutral btn-sm btn-circle shadow-md hover:scale-105 transition-transform"
              title="Remonter en haut"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          )}

          {/* Bouton pour descendre */}
          {chatbotUi.showScrollBottom && (
            <button
              onClick={chatbotUi.handleScrollToBottom}
              className="pointer-events-auto btn btn-primary btn-sm btn-circle shadow-md hover:scale-105 transition-transform"
              title="Descendre en bas"
            >
              <ArrowDownIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Div invisible */}
        <div ref={chatbotUi.bottomRef} className="h-1 shrink-0" />
      </div>

      {/* Zone de saisie */}
      <TextInputChatbot
        prompt={prompt}
        isSubmitButtonAnimated={chatbotUi.isSubmitButtonAnimated}
        setPrompt={setPrompt}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </motion.div>
  );
}
