import { useCallback, useContext, useEffect, useState } from "react";
import useHttp from "../../../../src.legacy/hooks/use-http";
import { ChatbotContext } from "../../../store/ChatbotProvider";

type ChatbotSource = {
  course: string;
  section: string;
  activity: string;
  score: number;
  heading_path: string;
  lessonId?: number;
  moduleId?: number;
};

export type ChatbotValues = {
  origin: "user" | "bot";
  message: string;
  date: Date;
  type?: "normal" | "warning" | "error";
  mode?: string;
  sources?: ChatbotSource[];
  textSelection?: string;
};

const useChatbot = () => {
  const { sendRequest, error, isLoading } = useHttp();

  const [prompt, setPrompt] = useState<string>("");

  const [dialog, setDialog] = useState<ChatbotValues[]>([]);

  const [pendingReset, setPendingReset] = useState<boolean>(false);

  const { currentActivity, activityTextSelection, setActivityTextSelection } =
    useContext(ChatbotContext);

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
        textSelection: activityTextSelection || undefined, // Ajout local immédiat dans l'UI
      },
    ]);

    const targetTextSelection = activityTextSelection; // Mémoire locale du texte
    setActivityTextSelection("");

    if (pendingReset) {
      setPendingReset(false);
    }

    const applyData = (data: {
      text: string;
      type?: "normal" | "warning" | "error";
      mode?: string;
      sources?: ChatbotSource[];
    }) => {
      const processedText = data.text;

      setDialog((prevState) => [
        ...prevState,
        {
          origin: "bot",
          message: processedText,
          date: new Date(),
          type: data.type || "normal",
          mode: data.mode,
          sources: data.sources,
        },
      ]);
      setPrompt("");
    };

    sendRequest(
      {
        path: "/chatbot/prompt",
        method: "post",
        body: {
          prompt: prompt.trim(),
          fullPrompt: message,
          courseId: currentActivity?.courseId,
          clearHistory: pendingReset,
          textSelection: targetTextSelection || null,
        },
      },
      applyData,
    );
  };

  useEffect(() => {
    if (error && error.length > 0) {
      console.error("Chatbot error:", error);
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
  }, [error]);

  const getConversationData = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      dialogs: ChatbotValues[];
    }) => {
      if (data.success) {
        setDialog(data.dialogs);
      }
    };
    sendRequest({ path: `/chatbot/dialogs`, method: "get" }, applyData);
  }, [sendRequest]);

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
  };
};

export default useChatbot;
