import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router";

type Activity = {
  courseId: number;
  readTimeMs?: number;
  content?: string;
};

type ChatbotContextType = {
  /**
   * Merge en passant un objet activité qui regroupe courseId et le temps de lecture
   * calculé dans une fonction utilitaire
   */
  currentActivity?: Activity;
  setCurrentActivity: Dispatch<SetStateAction<Activity | undefined>>;
  activityTextSelection: string;
  setActivityTextSelection: Dispatch<SetStateAction<string>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  // Récupérer le chemin actuel de l'URL dans le hook react router
  const { pathname } = useLocation();

  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [activityTextSelection, setActivityTextSelection] =
    useState<string>("");

  useEffect(() => {
    if (!pathname.includes("/parcours/module/")) {
      setCurrentActivity(undefined);
    }
  }, [pathname]);

  return (
    <ChatbotContext.Provider
      value={{
        currentActivity,
        setCurrentActivity,
        activityTextSelection,
        setActivityTextSelection,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext, ChatbotProvider };
