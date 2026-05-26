import { Context } from "../../../store/context.store";
import { cn } from "../../../utils";
import { ChatbotValues } from "../hooks/useChatbot";
import AvatarChatbot from "./avatarChatbot";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  message: ChatbotValues;
  isLastMessage: boolean;
  isLoading: boolean;
  messageLoader: React.ReactNode;
};

export default function MessageChatbot({
  message,
  isLastMessage,
  isLoading,
  messageLoader,
}: Props) {
  const { user } = useContext(Context);

  const isUser = message.origin === "user";

  return (
    <>
      <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
          <AvatarChatbot message={message} user={user} />
        </div>
        <div className="chat-header text-xs opacity-50 mb-1">
          {isUser ? "Vous" : "Assistant"}
        </div>
        <div
          className={cn(
            "chat-bubble text-sm shadow-sm",
            isUser && "chat-bubble-primary text-primary-content",
            !isUser &&
              "chat-bubble-base-200 bg-base-100 text-base-content border border-base-300",
          )}
        >
          <div className="prose prose-sm max-w-none text-inherit *:flex-col! [&>ol]:flex! [&>ul]:flex!">
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && isLastMessage && messageLoader}
    </>
  );
}
