import { useCallback, useContext, useEffect, useState } from "react";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import { isAiServerError } from "../../../utils/helpers/ai-helpers";
import { chatbotApi } from "../api/chatbot.api";
import type { ChatbotValues } from "../interfaces/chatbot";

export type { ChatbotSource, ChatbotValues } from "../interfaces/chatbot";

export const AI_UNAVAILABLE_MESSAGE =
  "L'assistant est temporairement indisponible. Veuillez réessayer plus tard.";

type Options = {
  /** Faux quand les fonctionnalités IA sont désactivées : l'historique n'est pas chargé et aucune question n'est envoyée. */
  enabled?: boolean;
};

/** Résultat d'une question : la réponse à afficher, et si elle est un échec (le brouillon est alors conservé). */
export type ChatbotReply = { message: ChatbotValues; failed: boolean };

const useChatbot = ({ enabled = true }: Options = {}) => {
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

  const sendPrompt = async (text: string): Promise<ChatbotReply> => {
    const trimmed = text.trim();
    const message = activityTextSelection
      ? `${text}. J'ai besoin d'aide concernant : ${activityTextSelection}`
      : trimmed;
    const beginningDate = new Date();

    setDialog((prevState) => [
      ...prevState,
      {
        origin: "user",
        message: text,
        date: beginningDate,
        textSelection: activityTextSelection || undefined,
      },
    ]);

    const unavailable: ChatbotValues = {
      origin: "bot",
      message: AI_UNAVAILABLE_MESSAGE,
      date: new Date(),
      type: "error",
    };

    if (aiUnavailable) return { message: unavailable, failed: true };

    const targetTextSelection = activityTextSelection;
    setActivityTextSelection("");

    if (pendingReset) {
      setPendingReset(false);
    }

    try {
      setIsLoading(true);
      const data = await chatbotApi.mutations.sendPrompt({
        prompt: trimmed,
        fullPrompt: message,
        courseId: currentActivity?.courseId,
        clearHistory: pendingReset,
        textSelection: targetTextSelection || null,
      });

      setAiUnavailable(false);
      const reply: ChatbotValues = {
        origin: "bot",
        message: data.text,
        date: new Date(),
        type: data.type || "normal",
        mode: data.mode,
        sources: data.sources,
      };
      setDialog((prevState) =>
        prevState
          .filter((entry) => !(entry.origin === "bot" && entry.type === "error"))
          .concat(reply),
      );
      return { message: reply, failed: false };
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
            : prevState.concat(unavailable),
        );
        return { message: unavailable, failed: true };
      }
      const failure: ChatbotValues = {
        origin: "bot",
        message:
          "L'assistant ne peut pas vous répondre pour l'instant, réessayez plus tard.",
        date: new Date(),
        type: "error",
      };
      setDialog((prevState) => [...prevState, failure]);
      return { message: failure, failed: true };
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { failed } = await sendPrompt(prompt);
    if (!failed) setPrompt("");
  };

  const retryAi = useCallback(() => {
    setAiUnavailable(false);
    setDialog((prevState) =>
      prevState.filter(
        (entry) => !(entry.origin === "bot" && entry.type === "error"),
      ),
    );
  }, [setAiUnavailable]);

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
  }, [setAiUnavailable]);

  useEffect(() => {
    if (enabled) getConversationData();
  }, [enabled, getConversationData]);

  return {
    prompt,
    pendingReset,
    setPrompt,
    isLoading,
    dialog:
      aiUnavailable &&
      !dialog.some(
        (entry) =>
          entry.origin === "bot" &&
          entry.type === "error" &&
          entry.message === AI_UNAVAILABLE_MESSAGE,
      )
        ? dialog.concat({
            origin: "bot",
            message: AI_UNAVAILABLE_MESSAGE,
            date: new Date(),
            type: "error",
          })
        : dialog,
    setDialog,
    onSubmit,
    sendPrompt,
    handleNewChat,
    aiUnavailable,
    retryAi,
  };
};

export default useChatbot;
