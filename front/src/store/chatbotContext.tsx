import React, { useState } from "react";

type ChatbotContextType = {
  currentActivityName: string;
  setCurrentActivityName: React.Dispatch<React.SetStateAction<string>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  const [currentActivityName, setCurrentActivityName] = useState<string>("");

  return (
    <ChatbotContext.Provider
      value={
        { currentActivityName, setCurrentActivityName } as ChatbotContextType
      }
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext, ChatbotProvider };
