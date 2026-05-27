import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

type ChatbotContextType = {
  currentCourseName: string;
  setCurrentCourseName: React.Dispatch<React.SetStateAction<string>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  // Récupérer le chemin actuel de l'URL dans le hook react router
  const { pathname } = useLocation();

  const [currentCourseName, setCurrentCourseName] = useState<string>(pathname);

  useEffect(() => {
    if (!pathname.includes("/parcours/module/")) {
      setCurrentCourseName("");
    }
  }, [pathname]);

  return (
    <ChatbotContext.Provider
      value={{ currentCourseName, setCurrentCourseName }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext, ChatbotProvider };
