import useChatbot from "./hooks/useChatbot";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HeaderChatbot from "./chatbot-parts/headerChatbot";
import MessageChatbot from "./chatbot-parts/messageChatbot";
import MessageLoaderChatbot from "./chatbot-parts/messageLoaderChatbot";
import TextInputChatbot from "./chatbot-parts/textInputChatbot";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

type Props = {
  setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerChatbot({ setShowChatbot }: Props) {
  const { dialog, handleSubmit, isLoading, prompt, setPrompt } = useChatbot();

  // États distincts pour les deux boutons
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll vers le haut
  const handleScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll vers le bas
  const handleScrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollBottom(false); // On cache la notification puisqu'on y est
    }
  };

  // Événement de défilement manuel
  const handleScrollEvent = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;

    // Calcul pour savoir si on est tout en bas
    const isBottom =
      container.scrollHeight - scrollTop <= container.clientHeight + 50;

    // On affiche si on a descendu de plus de 150px
    setShowScrollTop(scrollTop > 150);

    // On masque le bouton flottant si l'utilisateur est tout en bas
    if (isBottom) {
      setShowScrollBottom(false);
    }
  };

  // Détection de l'arrivée d'un nouveau message
  useEffect(() => {
    if (!scrollContainerRef.current || dialog.length === 0) return;

    const container = scrollContainerRef.current;

    const isBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 60;

    if (!isBottom) {
      setShowScrollBottom(true);
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialog.length]);

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

      {/* Zone de chat */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScrollEvent}
        className="flex-1 overflow-y-auto p-4 bg-base-200/30 space-y-4 relative flex flex-col"
      >
        <div className="flex-1 space-y-4">
          {dialog.map((message, index) => (
            <MessageChatbot
              key={index}
              message={message}
              isLoading={isLoading}
              messageLoader={<MessageLoaderChatbot />}
            />
          ))}
        </div>

        {/* Boutons flottants par dessus le chat */}
        <div className="sticky bottom-2 right-0 pointer-events-none flex flex-col items-center gap-2 z-20">
          {/* Bouton pour remonter */}
          {showScrollTop && (
            <button
              onClick={handleScrollToTop}
              className="pointer-events-auto btn btn-neutral btn-sm btn-circle shadow-md hover:scale-105 transition-transform"
              title="Remonter en haut"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          )}

          {/* Bouton pour descendre */}
          {showScrollBottom && (
            <button
              onClick={handleScrollToBottom}
              className="pointer-events-auto btn btn-primary btn-sm btn-circle shadow-md hover:scale-105 transition-transform"
              title="Descendre en bas"
            >
              <ArrowDownIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Div invisible */}
        <div ref={bottomRef} className="h-1 shrink-0" />
      </div>

      {/* Zone de saisie */}
      <TextInputChatbot
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </motion.div>
  );
}
