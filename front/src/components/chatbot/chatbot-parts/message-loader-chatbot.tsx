import chatbot from "../../../assets/images/chatbot.png";

export default function MessageLoaderChatbot() {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 h-10 bg-white rounded-full p-1 shadow-sm">
          <img
            alt="Bot loading"
            src={chatbot}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="chat-bubble chat-bubble-base-200 bg-base-100 text-base-content border border-base-300 shadow-sm flex items-center h-10">
        <span className="loading loading-dots loading-sm text-primary"></span>
      </div>
    </div>
  );
}
