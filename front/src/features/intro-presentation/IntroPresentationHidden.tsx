import type { PropsWithChildren } from "react";

import { useIntroPresentation } from "./useIntroPresentation";

/** Masque son contenu quand la présentation a son propre chatbot : celui, flottant, de l'application. */
const IntroPresentationHidden = ({ children }: PropsWithChildren) => {
  const { isChatbotHidden } = useIntroPresentation();

  return isChatbotHidden ? null : children;
};

export default IntroPresentationHidden;
