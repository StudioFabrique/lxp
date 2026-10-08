import type { PropsWithChildren } from "react";

import IntroPresentation from "./IntroPresentation";
import IntroRoleReveal from "./IntroRoleReveal";
import { useIntroPresentation } from "./useIntroPresentation";

/**
 * Affiche la présentation à la place de la page courante, dans la zone de
 * contenu du layout : la barre latérale reste visible et utilisable. Une fois
 * le choix enregistré, la découverte du rôle prend le relais.
 */
const IntroPresentationGate = ({ children }: PropsWithChildren) => {
  const { isOpen, isSaving, isRoleRevealOpen, skip, complete, closeRoleReveal } =
    useIntroPresentation();

  return isOpen ? (
    <IntroPresentation
      isSaving={isSaving}
      onSkip={skip}
      onComplete={complete}
    />
  ) : isRoleRevealOpen ? (
    <IntroRoleReveal onDone={closeRoleReveal} />
  ) : (
    children
  );
};

export default IntroPresentationGate;
