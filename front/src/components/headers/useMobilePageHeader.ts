import { useEffect } from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useMobileHeaderActions } from "../../hooks/useMobileHeaderActions";

/**
 * Sur mobile, la barre du haut rappelle déjà la section : l'en-tête de page n'est pas affiché
 * et ses actions passent dans le tiroir de droite de la barre (`container`).
 * `enabled` écarte les en-têtes qui ne sont pas un titre de page (sous-en-têtes, états, lignes cliquables).
 * `topBarTitle` remplace le nom de la section dans la barre (ex. « Bonjour Martin ! » de l'accueil).
 */
export const useMobilePageHeader = (enabled: boolean, topBarTitle?: { text: string; className?: string }) => {
  const actions = useMobileHeaderActions();
  const isMobile = useIsMobile();
  const collapsed = enabled && isMobile && actions !== null;
  const setTopBarTitle = actions?.setTopBarTitle;
  const text = topBarTitle?.text;
  const className = topBarTitle?.className;

  useEffect(() => {
    if (!collapsed || !setTopBarTitle || !text) return;
    setTopBarTitle({ text, className });
    return () => setTopBarTitle(null);
  }, [collapsed, setTopBarTitle, text, className]);

  return {
    collapsed,
    container: actions?.container ?? null,
  };
};
