import z from "zod";
import useForm from "../../UI/forms/hooks/use-form";
import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

type ChatbotValues = {
  origin: "user" | "bot";
  message: string;
  date: Date;
};

const useChatbot = () => {
  const promptSchema = z.object({
    prompt: z
      .string()
      .min(2, { message: "Prompt must be between 2 and 255 characters long." })
      .max(255, {
        message: "Prompt must be between 2 and 255 characters long.",
      }),
  });

  const {
    errors,
    values,
    onChangeValue,
    onValidationErrors,
    onResetForm,
    onValidateForm,
  } = useForm({}, promptSchema);

  const [dialog, setDialog] = useState<ChatbotValues[]>([]);

  const { sendRequest, error, isLoading } = useHttp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onValidateForm();
    setDialog((prevState) => [
      ...prevState,
      { origin: "user", message: values.prompt as string, date: new Date() },
    ]);

    const applyData = async (data: string) => {
      // Solution plus robuste pour éviter les sauts de ligne
      const processedText = data;

      setDialog((prevState) => [
        ...prevState,
        { origin: "bot", message: processedText, date: new Date() },
      ]);
      onResetForm();
    };

    sendRequest(
      {
        path: "/chatbot/prompt",
        method: "post",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
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
            "ALAA ne peut pas vous répondre pour l'instant, réessayez un peu plus tard.",
          date: new Date(),
        },
      ]);
    }
  }, [error]);

  return {
    isLoading,
    errors,
    values,
    onChangeValue,
    onValidationErrors,
    onResetForm,
    dialog,
    setDialog,
    handleSubmit,
  };
};

export default useChatbot;
