import z from "zod";
import useForm from "../../UI/forms/hooks/use-form";
import { useState } from "react";
import useHttp from "../../../hooks/use-http";

type ChatbotValues = {
  origin: "user" | "bot";
  message: string;
  date: Date;
};

const useChatbot = () => {
  const promptSchema = z
    .string()
    .min(2, { message: "Prompt must be between 2 and 255 characters long." })
    .max(255, { message: "Prompt must be between 2 and 255 characters long." });

  const {
    errors,
    values,
    onChangeValue,
    onValidationErrors,
    onResetForm,
    onValidateForm,
  } = useForm({}, promptSchema);

  const [dialog, setDialog] = useState<ChatbotValues[]>([]);

  const { sendRequest, isLoading } = useHttp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onValidateForm();
    setDialog((prevState) => [
      ...prevState,
      { origin: "user", message: values.prompt, date: new Date() },
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
      applyData
    );
  };

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
