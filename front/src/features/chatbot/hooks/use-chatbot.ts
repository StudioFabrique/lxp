import { useCallback, useContext, useEffect, useState } from "react";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import { isAiServerError } from "../../../utils/helpers/ai-helpers";
import { chatbotApi } from "../api/chatbot.api";
import type { ChatbotValues } from "../interfaces/chatbot";

export type { ChatbotSource, ChatbotValues } from "../interfaces/chatbot";

const AI_UNAVAILABLE_MESSAGE =
  "L'assistant est temporairement indisponible. Veuillez réessayer plus tard.";

const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [prompt, setPrompt] = useState<string>("");

  const [dialog, setDialog] = useState<ChatbotValues[]>([]);

  const [pendingReset, setPendingReset] = useState<boolean>(false);

  const {
    currentActivity,
    activityTextSelection,
    setActivityTextSelection,
    aiUnavailable,
    setAiUnavailable,
  } = useContext(ChatbotContext);

  const handleNewChat = useCallback(() => {
    setDialog([
      {
        origin: "bot",
        message:
          "Discussion réinitialisée ! Comment puis-je vous aider à présent ?",
        date: new Date(),
      },
    ]);
    setPrompt("");
    setPendingReset(true);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = activityTextSelection
      ? `${prompt}. J'ai besoin d'aide concernant : ${activityTextSelection}`
      : prompt.trim();
    const beginningDate = new Date();

    setDialog((prevState) => [
      ...prevState,
      {
        origin: "user",
        message: prompt,
        date: beginningDate,
        textSelection: activityTextSelection || undefined,
      },
    ]);

    if (aiUnavailable) return;

    const targetTextSelection = activityTextSelection;
    setActivityTextSelection("");

    if (pendingReset) {
      setPendingReset(false);
    }

    try {
      setIsLoading(true);
      const data = await chatbotApi.mutations.sendPrompt({
        prompt: prompt.trim(),
        fullPrompt: message,
        courseId: currentActivity?.courseId,
        clearHistory: pendingReset,
        textSelection: targetTextSelection || null,
      });
      const processedText = data.text;

      setAiUnavailable(false);
      setDialog((prevState) =>
        prevState
          .filter((entry) => !(entry.origin === "bot" && entry.type === "error"))
          .concat({
            origin: "bot",
            message: processedText,
            date: new Date(),
            type: data.type || "normal",
            mode: data.mode,
            sources: data.sources,
          }),
      );
      setPrompt("");
    } catch (error) {
      if (isAiServerError(error)) {
        setAiUnavailable(true);
        setDialog((prevState) =>
          prevState.some(
            (entry) =>
              entry.origin === "bot" &&
              entry.type === "error" &&
              entry.message === AI_UNAVAILABLE_MESSAGE,
          )
            ? prevState
            : prevState.concat({
                origin: "bot",
                message: AI_UNAVAILABLE_MESSAGE,
                date: new Date(),
                type: "error",
              }),
        );
      } else {
        setDialog((prevState) => [
          ...prevState,
          {
            origin: "bot",
            message:
              "L'assistant ne peut pas vous répondre pour l'instant, réessayez plus tard.",
            date: new Date(),
            type: "error",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryAi = useCallback(() => {
    setAiUnavailable(false);
    setDialog((prevState) =>
      prevState.filter(
        (entry) => !(entry.origin === "bot" && entry.type === "error"),
      ),
    );
  }, []);

  const getConversationData = useCallback(async () => {
    try {
      const data = await chatbotApi.queries.getDialogs();
      if (data.success) {
        setDialog(data.dialogs);
      }
    } catch (error) {
      if (isAiServerError(error)) {
        setAiUnavailable(true);
      }
    }
  }, []);

  useEffect(() => {
    getConversationData();
  }, [getConversationData]);

  return {
    prompt,
    pendingReset,
    setPrompt,
    isLoading,
    dialog,
    setDialog,
    onSubmit,
    handleNewChat,
    aiUnavailable,
    retryAi,
  };
};

export default useChatbot;
