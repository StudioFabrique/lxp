import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { z } from "zod";
import { regexGeneric } from "../../../utils/constantes";

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    const applyData = (data: string) => {
      // Solution plus robuste pour éviter les sauts de ligne
      const processedText = data;

      setDialog((prevState) => [
        ...prevState,
        { origin: "bot", message: processedText, date: new Date() },
      ]);
      setPrompt("");
      const lastDialogs = [
        {
          origin: "user" as "user" | "bot",
          message: message,
          date: beginningDate,
        },
        {
          origin: "bot" as "user" | "bot",
          message: processedText,
          date: new Date(),
        },
      ];
      postDialog(lastDialogs);
    };

    sendRequest(
      {
        path: "/chatbot/prompt",
        method: "post",
        body: { prompt: message },
      },
      applyData,
    );
  };

  const postDialog = (lastDialogs: ChatbotValues[]) => {
    console.log("TRIGGERED");

    try {
      dialogSchema.array().parse(lastDialogs);
    } catch (err) {
      console.error("Dialog validation failed:", err);
      return;
    }

    const applyData = (data: string) => {
      console.log("Dialog saved:", data);
    };
    sendRequest(
      {
        path: `/chatbot/dialogs`,
        method: "post",
        body: { lastDialogs },
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
            "L'assistant ne peut pas vous répondre pour l'instant, réessayez un peu plus tard.",
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
    handleSubmit,
  };
};

export default useChatbot;
