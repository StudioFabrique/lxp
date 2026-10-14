import type { PropsWithChildren } from "react";

import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";
import IntroPresentation from "./IntroPresentation";
import IntroRoleReveal from "./IntroRoleReveal";
import { useIntroPresentation } from "./useIntroPresentation";

/**
 * Affiche la présentation à la place de la page courante, dans la zone de
 * contenu du layout : la barre latérale reste visible et utilisable. Une fois
 * le choix enregistré, la découverte du rôle prend le relais.
 */
const IntroPresentationGate = ({ children }: PropsWithChildren) => {
  const {
    isOpen,
    isSaving,
    isRoleRevealOpen,
    hasJustRevealed,
    skip,
    complete,
    closeRoleReveal,
  } = useIntroPresentation();
  const { animations } = useVisualPreferences();

  return isOpen ? (
    <IntroPresentation
      isSaving={isSaving}
      onSkip={skip}
      onComplete={complete}
    />
  ) : isRoleRevealOpen ? (
    <IntroRoleReveal onDone={closeRoleReveal} />
  ) : (
    // À la sortie de la séquence la page se monte à neuf : elle apparaît en fondu, comme à la connexion.
    <div
      className={cn(
        hasJustRevealed && animations && "animate-[app-fade-in_0.8s_ease-out]",
      )}
    >
      {children}
    </div>
  );
};

export default IntroPresentationGate;
