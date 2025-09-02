import z from "zod";
import useForm from "../../UI/forms/hooks/use-form";
import { useState } from "react";
import useHttp from "../../../hooks/use-http";

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

  const [dialog, setDialog] = useState<string[]>([]);

  const { sendRequest, isLoading } = useHttp();

  const handleSubmit = async (e: React.FormEvent) => {
    setDialog((prevState) => [...prevState, values.prompt]);
    e.preventDefault();
    onValidateForm();

    const applyData = (data: string) => {
      console.log({ data });
      setDialog((prevState) => [...prevState, data]);
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
