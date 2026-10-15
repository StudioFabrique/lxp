import { useEffect } from "react";
import { useIsMobile } from "./useMediaQuery";
import { useMobileHeaderActions } from "./useMobileHeaderActions";

/**
 * Sur mobile, propose à la page un panneau plein écran, que la page ouvre elle-même (`open`, depuis le bouton
 * de son choix) et referme (`close`, ex. après le choix d'un élément). `label` nomme le panneau ;
 * `null` désactive la fonction. La page dépose son contenu dans `container` (portail) tant que le panneau est ouvert.
 * `active` est faux hors mobile et hors de la mise en page de l'application : la page garde alors son affichage normal.
 */
export const useMobileNavigationPanel = (label: string | null) => {
  const actions = useMobileHeaderActions();
  const isMobile = useIsMobile();
  const active = actions !== null && isMobile && label !== null;
  const setNavigation = actions?.setNavigation;
  const setIsNavigationOpen = actions?.setIsNavigationOpen;

  useEffect(() => {
    if (!active || !label || !setNavigation || !setIsNavigationOpen) return;
    setNavigation({ label });
    return () => {
      setNavigation(null);
      setIsNavigationOpen(false);
    };
  }, [active, label, setNavigation, setIsNavigationOpen]);

  return {
    active,
    container: active ? (actions?.navigationContainer ?? null) : null,
    open: () => setIsNavigationOpen?.(true),
    close: () => setIsNavigationOpen?.(false),
  };
};
