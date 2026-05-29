import { useCallback, useContext, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { z } from "zod";
import { regexGeneric } from "../../../utils/constantes";
import { ChatbotContext } from "../../../store/chatbotContext";

const dialogSchema = z.object({
  origin: z.enum(["user", "bot"]),
  message: z
    .string({ required_error: "Le message est requis." })
    .regex(regexGeneric, { message: "Format de message invalide." }),
  date: z.coerce.date(),
});

export type ChatbotValues = {
  origin: "user" | "bot";
  message: string;
  date: Date;
};

const useChatbot = () => {
  const [prompt, setPrompt] = useState<string>("");

  const [dialog, setDialog] = useState<ChatbotValues[]>([]);

  const { sendRequest, error, isLoading } = useHttp();

  const { currentCourseId } = useContext(ChatbotContext);

  const onSubmit = async (e: React.FormEvent) => {
    let message = "";
    e.preventDefault();
    message = prompt.trim();
    if (message.length === 0 || message.length > 255) {
      return;
    }
    const beginningDate = new Date();
    setDialog((prevState) => [
      ...prevState,
      { origin: "user", message: message, date: beginningDate },
    ]);

    const applyData = (data: { text: string }) => {
      const processedText = data.text;

      setDialog((prevState) => [
        ...prevState,
        { origin: "bot", message: processedText, date: new Date() },
      ]);
      setPrompt("");
    };

    sendRequest(
      {
        path: "/chatbot/prompt",
        method: "post",
        body: { prompt: message, courseId: currentCourseId || undefined },
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
    setPrompt,
    isLoading,
    dialog,
    setDialog,
    onSubmit,
  };
};

export default useChatbot;
