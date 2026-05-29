import { useEffect, useRef, useState } from "react";
import { ChatbotValues } from "./use-chatbot";

const useChatbotUi = (
  dialog: ChatbotValues[],
  setDialog: React.Dispatch<React.SetStateAction<ChatbotValues[]>>,
) => {
  const [showChatbot, setShowChatbot] = useState(false);

  // Loader fake pour simuler le temps de réponse du chatbot au demarrage
  const [isLoadingUi, setIsLoadingUi] = useState(false);

  // Taille variable pour le drawer
  const [size, setSize] = useState<"small" | "large" | "full">("small");
  const [isSubmitButtonAnimated, setIsSubmitButtonAnimated] =
    useState<boolean>(false);

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
      setShowScrollBottom(false);
    }
  };

  const handleScrollEvent = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;

    // Calcul pour savoir si on est tout en bas
    const isBottom =
      container.scrollHeight - scrollTop <= container.clientHeight + 50;

    if (isBottom) {
      setShowScrollBottom(false);
      setShowScrollTop(scrollTop > 150);
    } else {
      setShowScrollBottom(true);
      setShowScrollTop(false);
    }
  };

  const handleOpenChatbot = async () => {
    setSize(dialog.length === 0 ? "small" : "large");
    setShowChatbot(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    handleScrollToBottom();
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  const handleMaximizeChatbot = () => {
    setSize(size === "large" ? "full" : "large");
  };

  const handleResizeChatbot = () => {
    setSize(dialog.length === 0 ? "small" : "large");
  };

  const handleMinimizeChatbot = () => {
    setSize("small");
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
      setShowScrollTop(false);
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialog.length]);

  // Quand l'étudiant ouvre le chatbot pour la première fois et qu'il n'y a pas de message,
  // pendant 1 seconde, le loader s'affiche puis le chatbot salue l'étudiant de manière engageante
  useEffect(() => {
    if (dialog.length === 0 && showChatbot) {
      setIsLoadingUi(true);
      const timer = setTimeout(() => {
        setDialog((prevState) => [
          ...prevState,
          {
            origin: "bot",
            message: "Bonjour ! Comment puis-je vous aider ?",
            date: new Date(),
          },
        ]);
        setIsLoadingUi(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dialog.length, setDialog, showChatbot]);

  return {
    showChatbot,
    isLoadingUi,
    size,
    isSubmitButtonAnimated,
    setIsSubmitButtonAnimated,
    showScrollTop,
    showScrollBottom,
    scrollContainerRef,
    bottomRef,
    handleScrollToTop,
    handleScrollToBottom,
    handleScrollEvent,
    handleOpenChatbot,
    handleCloseChatbot,
    handleMaximizeChatbot,
    handleResizeChatbot,
    handleMinimizeChatbot,
  };
};

export default useChatbotUi;
