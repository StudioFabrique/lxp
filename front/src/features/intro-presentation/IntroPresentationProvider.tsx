import { useContext, useState, type PropsWithChildren } from "react";
import { useLocation } from "react-router";
import toast from "react-hot-toast";

import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import { IntroPresentationContext } from "./IntroPresentationContext";
import {
  isIntroStillPending,
  shouldAutoOpenIntro,
} from "./intro-presentation-status";

type Props = {
  /** Faux tant que le compte n'est pas prêt, par exemple pendant le questionnaire apprenant. */
  isEligible?: boolean;
};

/**
 * Décide quand la présentation s'ouvre (sur le dashboard après l'onboarding, ou
 * à la demande depuis la barre latérale) ; `IntroPresentationGate` l'affiche.
 *
 * Le choix (ignorée ou terminée) est enregistré sur le compte et la fenêtre ne
 * se ferme qu'après confirmation du serveur. Une présentation rouverte après
 * coup ne modifie rien. En démonstration le compte est partagé : elle ne
 * s'ouvre jamais seule et rien n'est enregistré.
 */
export const IntroPresentationProvider = ({
  isEligible = true,
  children,
}: PropsWithChildren<Props>) => {
  const { user, updateOnboarding } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const { pathname } = useLocation();
  const [isReopened, setIsReopened] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChatbotHidden, setChatbotHidden] = useState(false);

  // Sans état enregistré, l'ancien compte est traité comme jamais présenté.
  const status = user?.onboarding?.status ?? "pending";
  const isOpen =
    Boolean(user) &&
    (isReopened ||
      shouldAutoOpenIntro({ status, pathname, isEligible, demoMode }));

  const close = async (choice: "skipped" | "completed") => {
    if (isSaving) return;
    if (demoMode || !isIntroStillPending(status)) {
      setIsReopened(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateOnboarding(choice);
      setIsReopened(false);
    } catch {
      toast.error("Impossible d'enregistrer votre choix. Réessayez.");
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    isOpen,
    isSaving,
    isChatbotHidden: isOpen && isChatbotHidden,
    setChatbotHidden,
    open: () => setIsReopened(true),
    skip: () => void close("skipped"),
    complete: () => void close("completed"),
  };

  return (
    <IntroPresentationContext value={value}>
      {children}
    </IntroPresentationContext>
  );
};
