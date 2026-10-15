import { useEffect } from "react";
import { useIsMobile } from "./useMediaQuery";
import { useMobileHeaderActions } from "./useMobileHeaderActions";

/**
 * Sur mobile, propose un panneau plein écran depuis un bouton dédié de la barre du haut.
 * `label` nomme le bouton et le panneau ; `null` désactive la fonction (rien n'est alors affiché
 * dans la barre). La page dépose son contenu dans `container` (portail) tant que le panneau est ouvert,
 * et `close` le referme (ex. après le choix d'un élément).
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
    close: () => setIsNavigationOpen?.(false),
  };
};
