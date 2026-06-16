import { Context } from "../../../store/context.store";
import { cn } from "../../../utils";
import { ChatbotValues } from "../hooks/use-chatbot";
import AvatarChatbot from "./avatar-chatbot";
import { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, ExternalLink } from "lucide-react";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

type Props = {
  message: ChatbotValues;
  isLastMessage: boolean;
  isLoading: boolean;
  messageLoader?: React.ReactNode;
};

export default function MessageChatbot({
  message,
  isLastMessage,
  isLoading,
  messageLoader,
}: Props) {
  const { user } = useContext(Context);

  const [expandTextSelection, setExpandTextSelection] =
    useState<boolean>(false);

  const isUser = message.origin === "user";

  const isGeneralKnowledge =
    !isUser && message.mode && message.mode !== "course_content";
  const hasSources = !isUser && message.sources && message.sources.length > 0;

  return (
    <>
      <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
          <AvatarChatbot message={message} user={user} />
        </div>
        <div className="chat-header text-xs z-1 opacity-50 mb-1 flex items-center gap-1">
          {isUser ? "Vous" : "Assistant"}

          {isGeneralKnowledge && (
            <QuestionMarkTooltip tooltipValue="Cette réponse utilise des connaissances générales externes au cours." />
          )}
        </div>

        <div
          className={cn(
            "chat-bubble text-sm shadow-sm flex flex-col gap-3",
            isUser && "chat-bubble-primary text-primary-content",
            !isUser &&
              message.type === "warning" &&
              "chat-bubble-warning text-warning-content",
            !isUser &&
              message.type === "error" &&
              "chat-bubble-error text-error-content",
            !isUser &&
              (!message.type || message.type === "normal") &&
              "chat-bubble-base-100 bg-base-100 text-base-content border border-base-300",
          )}
        >
          {isUser && message.textSelection && (
            <div className="p-2.5 border-l-4 border-primary bg-base-300/40 text-xs italic text-primary-content/90 rounded-r-md opacity-9ation-90 max-w-full">
              {message.textSelection}
            </div>
          )}

          <div className="prose prose-sm max-w-none text-inherit *:flex-col! [&>ol]:flex! [&>ul]:flex!">
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>

          {hasSources && (
            <div className="mt-2 pt-2 border-t border-base-content/10 text-xs">
              <span className="font-semibold mb-1.5 opacity-70 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Contenus de cours associés :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.sources?.map((src, idx) => {
                  const targetUrl = `/courses/${src.course}/activities/${src.activity}`;

                  return (
                    <a
                      key={idx}
                      href={targetUrl}
                      target="_blank"
                      className="badge badge-sm badge-outline hover:badge-primary transition-all duration-200 py-2.5 px-2 flex items-center gap-1 group no-underline"
                    >
                      <span className="truncate max-w-35 font-medium text-base-content">
                        {src.heading_path || src.section}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && isLastMessage && messageLoader}
    </>
  );
}
