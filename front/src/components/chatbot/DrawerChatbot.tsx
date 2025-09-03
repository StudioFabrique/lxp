import { Send } from "lucide-react";
import chatbot from "../../assets/images/chatbot.png";
import FieldArea from "../UI/forms/field-area";
import useChatbot from "./hooks/useChatbot";
import ReactMarkdown from "react-markdown";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../../store/context.store";
import AvatarChatbot from "./AvatarChatbot";

export default function DrawerChatbot() {
  const { errors, values, onChangeValue, dialog, handleSubmit, isLoading } =
    useChatbot();

  const data = { values, errors, onChangeValue };
  const { user } = useContext(Context);
  const ref = useRef<HTMLDivElement>(null);

  console.log({ dialog });

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, dialog]);

  return (
    <>
      <div className="drawer drawer-end z-1000 max-w-screen p-4">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4">
            <div
              style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                width: "64px",
                height: "64px",
                background: "white",
                borderRadius: "50%",
                padding: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#4CAF50"
              >
                <path d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              </svg>
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <div className="bg-base-200 text-base-content w-[40rem] min-h-full flex flex-col p-4">
            {/* Header fixe */}
            <div className="flex-shrink-0 text-center">
              <h2 className="text-2xl font-bold">Une question ?</h2>
              <div className="flex justify-center">
                <img src={chatbot} alt="Chatbot" width={200} />
              </div>
              <h3 className="text-xl font-bold">A.L.A.A. répond</h3>
              <p className="text-xs mt-2">
                (Advanced Learning Automated Answer)
              </p>
            </div>

            {/* Zone de chat avec scroll */}
            <div className="flex-1 flex flex-col mt-4 justify-between">
              <div className="flex-1 overflow-y-auto max-h-[31rem]">
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

                      <div className="chat-bubble chat-bubble-secondary text-base-200 max-w-[40rem]">
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

              <div className="flex-shrink-0 pt-4 my-4">
                <form onSubmit={handleSubmit}>
                  <FieldArea
                    placeholder="Posez votre question ici..."
                    name="prompt"
                    data={data}
                  />
                  <div className="text-right p-4">
                    <button
                      className="w-8 h-8 btn btn-circle btn-primary"
                      type="submit"
                      aria-label="soumettre le prompt à l'api"
                      disabled={isLoading}
                    >
                      <Send className="text-base-content-200" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
