import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

type ChatbotContextType = {
  currentCourseId: number | undefined;
  setCurrentCourseId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  // Récupérer le chemin actuel de l'URL dans le hook react router
  const { pathname } = useLocation();

  const [currentCourseId, setCurrentCourseId] = useState<number | undefined>();

  useEffect(() => {
    if (!pathname.includes("/parcours/module/")) {
      setCurrentCourseId(undefined);
    }
  }, [pathname]);

  return (
    <ChatbotContext.Provider value={{ currentCourseId, setCurrentCourseId }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext, ChatbotProvider };
