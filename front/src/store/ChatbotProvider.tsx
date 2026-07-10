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
  forceHideChatbot: boolean;
  setForceHideChatbot: Dispatch<SetStateAction<boolean>>;
  /**
   * Indique si le serveur IA est considéré comme indisponible (erreur réseau
   * ou réponse >= 500). Partagé entre le chatbot et les quiz afin d'éviter
   * d'enchaîner des requêtes vouées à l'échec et de polluer l'interface.
   */
  aiUnavailable: boolean;
  setAiUnavailable: Dispatch<SetStateAction<boolean>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  // Récupérer le chemin actuel de l'URL dans le hook react router
  const { pathname } = useLocation();

  const [forceHideChatbot, setForceHideChatbot] = useState<boolean>(false);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [activityTextSelection, setActivityTextSelection] =
    useState<string>("");
  const [aiUnavailable, setAiUnavailable] = useState<boolean>(false);

  useEffect(() => {
    if (!pathname.includes("/parcours/module/")) {
      setCurrentActivity(undefined);
    }
  }, [pathname]);

  return (
    <ChatbotContext
      value={{
        currentActivity,
        setCurrentActivity,
        activityTextSelection,
        setActivityTextSelection,
        forceHideChatbot,
        setForceHideChatbot,
        aiUnavailable,
        setAiUnavailable,
      }}
    >
      {children}
    </ChatbotContext>
  );
};

export { ChatbotContext, ChatbotProvider };
