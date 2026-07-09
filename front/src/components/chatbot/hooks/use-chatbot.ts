import { useCallback, useContext, useEffect, useState } from "react";
import apiClient from "../../../lib/axios";
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
  const [isLoading, setIsLoading] = useState(false);

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
        textSelection: activityTextSelection || undefined,
      },
    ]);

    const targetTextSelection = activityTextSelection;
    setActivityTextSelection("");

    if (pendingReset) {
      setPendingReset(false);
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post("/chatbot/prompt", {
        prompt: prompt.trim(),
        fullPrompt: message,
        courseId: currentActivity?.courseId,
        clearHistory: pendingReset,
        textSelection: targetTextSelection || null,
      });
      const data = response.data as {
        text: string;
        type?: "normal" | "warning" | "error";
        mode?: string;
        sources?: ChatbotSource[];
      };
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
    } catch {
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
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationData = useCallback(async () => {
    try {
      const response = await apiClient.get("/chatbot/dialogs");
      const data = response.data as {
        success: boolean;
        dialogs: ChatbotValues[];
      };
      if (data.success) {
        setDialog(data.dialogs);
      }
    } catch {
      // silently fail
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
  };
};

export default useChatbot;
