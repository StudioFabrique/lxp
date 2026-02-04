import { Send } from "lucide-react";
import chatbot from "../../assets/images/chatbot.png";
import useChatbot from "./hooks/useChatbot";
import ReactMarkdown from "react-markdown";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../../store/context.store";
import AvatarChatbot from "./AvatarChatbot";

type Props = {
  setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerChatbot({ setShowChatbot }: Props) {
  const { dialog, handleSubmit, isLoading, prompt, setPrompt } = useChatbot();

  const { user } = useContext(Context);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, dialog]);

  return (
    <>
      <div className="fixed bottom-4 right-4 w-96 max-w-full top-[35%] bg-base-200 z-50 rounded-2xl shadow-lg p-2 border border-primary/10 flex flex-col justify-between">
        <div className="relative">
          <span className="flex items-center justify-between absolute left-2 right-2 pr-2 top-2 w-full">
            <h2 className="flex items-end text-xl font-bold text-primary">
              CHATBOT{" "}
              <p className="text-xs text-info p-1">powered by Cyril.AI</p>
            </h2>
            <button
              className="btn btn-circle btn-sm btn-secondary"
              onClick={() => setShowChatbot(false)}
            >
              x
            </button>
          </span>
        </div>
        <div className="divider mt-12" />

        {/* Zone de chat avec scroll */}
        <div className="flex-1 flex flex-col mt-4 justify-between">
          <div className="flex-1 overflow-y-auto max-h-[25rem] mb-48">
            <div className="space-y-2">
              {/* Chat messages */}
              {dialog.map((message, index) => (
                <div
                  ref={index === dialog.length - 1 ? ref : null}
                  key={index}
                  className={`chat ${
                    message.origin === "user" ? "chat-start" : "chat-end"
                  } max-w-[40rem]`}
                >
                  <p className="chat-header">
                    {message.origin === "user"
                      ? "Votre question :"
                      : "ALAA a répondu :"}
                  </p>
                  <div className="chat-image avatar">
                    <AvatarChatbot message={message} user={user} />
                  </div>

                  <div
                    className={`chat-bubble ${message.origin === "user" ? "chat-bubble-secondary" : "chat-bubble-primary"} text-base-200 max-w-[40rem]`}
                  >
                    <div className="prose prose-sm !max-w-none [&>*]:!flex-col [&>ol]:!flex [&>ol]:!flex-col [&>ul]:!flex [&>ul]:!flex-col">
                      <ReactMarkdown
                        components={{
                          ol: ({ children, ...props }) => (
                            <ol {...props} className="flex flex-col">
                              {children}
                            </ol>
                          ),
                          ul: ({ children, ...props }) => (
                            <ul {...props} className="flex flex-col">
                              {children}
                            </ul>
                          ),
                          li: ({ children, ...props }) => (
                            <li {...props} className="block">
                              {children}
                            </li>
                          ),
                        }}
                      >
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isLoading && (
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={chatbot}
                    />
                  </div>
                </div>

                <div className="chat-bubble text-xs">
                  ALAA est en train de vous répondre...
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 absolute bottom-2 left-4 right-4 bg-base-200">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <textarea
                  className="w-full textarea focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60 pr-12"
                  name="prompt"
                  placeholder="Posez votre question au chatbot..."
                  rows={3}
                  onChange={(e) => setPrompt(e.currentTarget.value)}
                  value={prompt}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  className="w-8 h-8 btn btn-primary absolute right-2 bottom-2 flex items-center justify-center p-0"
                  type="submit"
                  aria-label="soumettre le prompt à l'api"
                  disabled={isLoading}
                >
                  <Send className="x-4 h-4 text-base-content-200" />
                </button>
              </div>
              <p className="text-xs text-info text-right mt-2 mr-1">
                Crédits : 0/1000
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
