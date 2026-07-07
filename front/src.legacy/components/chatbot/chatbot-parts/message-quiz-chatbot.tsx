import { motion } from "framer-motion";
import { AuthContext } from "../../../../src/store/AuthProvider";
import { cn } from "../../../utils";
import AvatarChatbot from "./avatar-chatbot";
import { useContext } from "react";

type Props = { onTriggerQuiz: () => void };

export default function MessageQuizChatbot({ onTriggerQuiz }: Props) {
  const { user } = useContext(AuthContext);

  return (
    <motion.div
      className="chat chat-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="chat-image avatar">
        <AvatarChatbot
          message={{ origin: "bot", message: "Vous êtes bloqué ?" }}
          user={user}
        />
      </div>
      <div className="chat-header text-xs opacity-50 mb-1">Assistant</div>

      <div
        className={cn(
          "chat-bubble text-sm shadow-sm",
          "chat-bubble-base-200 bg-base-100 text-base-content border border-base-300",
          "flex flex-col gap-2",
        )}
      >
        <div>
          Vous êtes bloqué ? Vous pouvez générer un quizz pour vous aider.
        </div>
        <button
          className="btn btn-primary self-end btn-xs w-fit"
          onClick={onTriggerQuiz}
        >
          Générer un quizz
        </button>
      </div>
    </motion.div>
  );
}
