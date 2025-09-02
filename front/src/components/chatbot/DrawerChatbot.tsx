import { Send } from "lucide-react";
import chatbot from "../../assets/images/chatbot.png";
import FieldArea from "../UI/forms/field-area";
import useChatbot from "./hooks/useChatbot";

export default function DrawerChatbot() {
  const {
    errors,
    values,
    onChangeValue,
    onValidationErrors,
    onResetForm,
    dialog,
    setDialog,
    handleSubmit,
  } = useChatbot();

  const data = { values, errors, onChangeValue };

  return (
    <>
      <div className="drawer drawer-end z-1000">
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

          <div className="menu bg-base-200 text-base-content min-h-full w-[30rem] flex flex-col justify-between items-center p-4">
            <div className="text-center">
              {/* Sidebar content here */}
              <h2 className="text-4xl font-bold">Une question ?</h2>
              <div>
                <img src={chatbot} alt="Chatbot" width={300} />
              </div>
              <h3 className="text-2xl font-bold">A.L.A.A. répond</h3>
              <p className="text-xs mt-2">
                (Advanced Learning Automated Answer)
              </p>
            </div>
            <div className="w-full">
              <ul>
                {dialog.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
              <form onSubmit={handleSubmit}>
                <FieldArea
                  label="Votre question :"
                  placeholder="Posez votre question ici..."
                  name="prompt"
                  data={data}
                />
                <div className="text-right p-4">
                  <button
                    className="w-8 h-8 btn btn-circle btn-primary"
                    type="submit"
                    aria-label="soumettre le prompt à l'api"
                  >
                    <Send className="text-base-content-200" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
