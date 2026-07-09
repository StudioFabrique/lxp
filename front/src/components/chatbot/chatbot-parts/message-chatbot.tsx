import { AuthContext } from "../../../../src/store/AuthProvider";
import { ChatbotValues } from "../hooks/use-chatbot";
import AvatarChatbot from "./avatar-chatbot";
import { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "../../../utils/helpers/style-helpers";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

type Props = {
  message: ChatbotValues;
  isLastMessage: boolean;
  isLoading: boolean;
  messageLoader?: React.ReactNode;
  onCloseChatbot: () => void;
};

export default function MessageChatbot({
  message,
  isLastMessage,
  isLoading,
  messageLoader,
  onCloseChatbot,
}: Props) {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];
  const { user } = useContext(AuthContext);

  // Fermé par défaut (false)
  const [expandTextSelection, setExpandTextSelection] =
    useState<boolean>(false);

  const isUser = message.origin === "user";
  const isGeneralKnowledge =
    !isUser && message.mode && message.mode !== "course_content";
  const hasSources = !isUser && message.sources && message.sources.length > 0;
  const shouldAnimate = isLastMessage;

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
          {/* Conteneur de sélection de texte étensible */}
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
                <div className="w-full wrap-break-word text-left overflow-hidden">
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
            <ReactMarkdown
              components={{
                a: ({ children, ...props }) => {
                  if (props.href?.includes("http")) {
                    props.target = "_blank";
                    props.rel = "noopener noreferrer";
                  }
                  return <a {...props}>{children}</a>;
                },
              }}
            >
              {message.message}
            </ReactMarkdown>
            {isGeneralKnowledge && (
              <span className="text-xs italic font-light text-neutral/70">
                Cette réponse utilise des connaissances générales externes au
                cours.
              </span>
            )}
          </motion.div>

          {hasSources && (
            <div className="mt-2 pt-2 border-t border-base-content/10 text-xs">
              <span className="font-semibold mb-1.5 opacity-70 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Contenus de cours associés :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.sources?.map((src) => (
                  <Link
                    key={src.activity}
                    to={`/${currentRoute[0]}/parcours/module/${src.moduleId}`}
                    onClick={onCloseChatbot}
                    state={{
                      lessonId: src.lessonId,
                    }}
                    className="badge badge-sm badge-outline hover:badge-primary transition-all duration-200 py-2.5 px-2 flex items-center gap-1 group no-underline"
                  >
                    <span className="truncate max-w-35 font-medium text-base-content">
                      {src.heading_path || src.section}
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && isLastMessage && messageLoader}
    </>
  );
}
