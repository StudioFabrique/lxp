import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

type ChatbotContextType = {
  currentActivityName: string;
  setCurrentActivityName: React.Dispatch<React.SetStateAction<string>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  // Récupérer le chemin actuel de l'URL dans le hook react router
  const { pathname } = useLocation();

  const [currentActivityName, setCurrentActivityName] =
    useState<string>(pathname);

  useEffect(() => {
    if (!pathname.includes("/parcours/module/")) {
      setCurrentActivityName("");
    }
  }, [pathname]);

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
