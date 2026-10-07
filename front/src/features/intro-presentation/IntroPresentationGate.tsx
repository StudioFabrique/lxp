import type { PropsWithChildren } from "react";

import IntroPresentation from "./IntroPresentation";
import { useIntroPresentation } from "./useIntroPresentation";

/**
 * Affiche la présentation à la place de la page courante, dans la zone de
 * contenu du layout : la barre latérale reste visible et utilisable.
 */
const IntroPresentationGate = ({ children }: PropsWithChildren) => {
  const { isOpen, isSaving, skip, complete } = useIntroPresentation();

  return isOpen ? (
    <IntroPresentation
      isSaving={isSaving}
      onSkip={skip}
      onComplete={complete}
    />
  ) : (
    children
  );
};

export default IntroPresentationGate;
