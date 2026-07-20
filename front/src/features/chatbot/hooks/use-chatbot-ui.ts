import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChatbotValues } from "./use-chatbot";
import { ChatbotContext } from "../../../store/ChatbotProvider";

export type chatbotWindowSize = "small" | "large" | "full";

const useChatbotUi = (
  dialog: ChatbotValues[],
  setDialog: React.Dispatch<React.SetStateAction<ChatbotValues[]>>,
) => {
  const { activityTextSelection, setActivityTextSelection } =
    useContext(ChatbotContext);

  const [showChatbot, setShowChatbot] = useState(false);

  const [isLoadingUi, setIsLoadingUi] = useState(false);

  const [size, setSize] = useState<chatbotWindowSize>("small");
  const [isSubmitButtonAnimated, setIsSubmitButtonAnimated] =
    useState<boolean>(false);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleScrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollContainerRef]);

  const handleScrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollBottom(false);
    }
  }, [bottomRef]);

  const handleScrollEvent = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;

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

  const handleOpenChatbot = useCallback(
    async (
      overrideSize: chatbotWindowSize = dialog.length > 1 ? "large" : "small",
    ) => {
      setSize(overrideSize);
      setShowChatbot(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      handleScrollToBottom();
    },
    [dialog, handleScrollToBottom],
  );

  const handleCloseChatbot = useCallback(() => {
    setShowChatbot(false);
  }, []);

  const handleMaximizeChatbot = () => {
    setSize(size === "large" ? "full" : "large");
  };

  const handleResizeChatbot = () => {
    setSize(dialog.length === 0 ? "small" : "large");
  };

  const handleMinimizeChatbot = () => {
    setSize("small");
  };

  const handleRemoveTextSelected = () => {
    setActivityTextSelection("");
  };

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

  useEffect(() => {
    if (activityTextSelection) handleOpenChatbot();
  }, [activityTextSelection, handleOpenChatbot]);

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
    handleRemoveTextSelected,
  };
};

export default useChatbotUi;
