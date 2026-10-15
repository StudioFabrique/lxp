import { AuthContext } from "../../../../store/AuthProvider";
import { ChatbotValues } from "../../hooks/use-chatbot";
import AvatarChatbot from "./avatar-chatbot";
import ChatbotMarkdown from "./chatbot-markdown";
import ChatbotSources from "./chatbot-sources";
import { useContext, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  RotateCw,
} from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "../../../../utils/cn";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";

type Props = {
  message: ChatbotValues;
  isLastMessage: boolean;
  isLoading: boolean;
  messageLoader?: React.ReactNode;
  onCloseChatbot: () => void;
  onRetry?: () => void;
};

export default function MessageChatbot({
  message,
  isLastMessage,
  isLoading,
  messageLoader,
  onCloseChatbot,
  onRetry,
}: Props) {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];
  const { user } = useContext(AuthContext);

  const [expandTextSelection, setExpandTextSelection] =
    useState<boolean>(false);

  const isUser = message.origin === "user";
  const isGeneralKnowledge =
    !isUser && message.mode && message.mode !== "course_content";
  const hasSources = !isUser && message.sources && message.sources.length > 0;
  const shouldAnimate = isLastMessage;

  return (
    <>
      <div className={cn("chat", isUser ? "chat-end" : "chat-start")}>
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
            <motion.div
              initial={
                shouldAnimate ? { opacity: 0, scale: 0.9, y: 10 } : false
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l-4 border-primary bg-base-300/40 text-xs italic text-primary-content/90 max-w-full cursor-pointer hover:bg-base-300/60 transition-colors select-none overflow-hidden"
              onClick={() => setExpandTextSelection(!expandTextSelection)}
            >
              <div className="flex gap-2 items-start p-2.5">
                <div className="w-full flex items-end gap-2 wrap-break-word text-left overflow-hidden">
                  <CornerDownRight className="w-4 h-4" />
                  <motion.span
                    animate={{
                      maxHeight: expandTextSelection ? "1000px" : "20px",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className={cn(
                      "block w-full transition-all duration-300",
                      !expandTextSelection && "line-clamp-1",
                    )}
                  >
                    "{message.textSelection}"
                  </motion.span>
                </div>

                <div className="flex justify-end gap-2 font-semibold not-italic text-[10px] uppercase tracking-wider opacity-70 mt-0.5 shrink-0">
                  {expandTextSelection ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={
              isUser && shouldAnimate
                ? { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }
                : { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }
            }
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="prose prose-sm max-w-none text-inherit *:flex-col! [&>ol]:flex! [&>ul]:flex!"
          >
            <ChatbotMarkdown>{message.message}</ChatbotMarkdown>
            {isGeneralKnowledge && (
              <span className="text-xs italic font-light text-base-content/80">
                Cette réponse utilise des connaissances générales externes au
                cours.
              </span>
            )}
          </motion.div>

          {hasSources && message.sources && (
            <ChatbotSources
              sources={message.sources}
              routeRoot={currentRoute[0]}
              onNavigate={onCloseChatbot}
            />
          )}
        </div>
        {!isUser && onRetry && (
          <div className="chat-footer mt-2">
            <button
              type="button"
              onClick={onRetry}
              disabled={isLoading}
              className="btn btn-sm btn-outline gap-1"
            >
              <RotateCw className="w-3 h-3" />
              Réessayer
            </button>
          </div>
        )}
      </div>

      {isLoading && isLastMessage && messageLoader}
    </>
  );
}
