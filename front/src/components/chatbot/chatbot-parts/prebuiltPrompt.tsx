import { useContext } from "react";
import { ChatbotContext } from "../../../store/chatbotContext";

export default function PrebuiltPrompt() {
  const { currentActivityName } = useContext(ChatbotContext);

  return <div>{currentActivityName}</div>;
}
