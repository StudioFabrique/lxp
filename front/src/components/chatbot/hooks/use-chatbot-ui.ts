import { useEffect, useRef, useState } from "react";
import { ChatbotValues } from "./use-chatbot";

const useChatbotUi = (dialog: ChatbotValues[]) => {
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

  // Événement de défilement manuel
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
      if (showScrollBottom) {
        setShowScrollTop(false);
      } else {
        setShowScrollTop(scrollTop > 150);
      }
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
      setShowScrollTop(false);
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialog.length]);

  // Pour le tout premier rendu à l'ouverture, scroller tout en bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return {
    size,
    setSize,
    isSubmitButtonAnimated,
    setIsSubmitButtonAnimated,
    showScrollTop,
    showScrollBottom,
    scrollContainerRef,
    bottomRef,
    handleScrollToTop,
    handleScrollToBottom,
    handleScrollEvent,
  };
};

export default useChatbotUi;
