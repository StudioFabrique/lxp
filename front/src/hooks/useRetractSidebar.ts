import { useContext, useEffect } from "react";
import { SidebarRetractionContext } from "../store/SidebarRetractionContext";

/** Fait glisser la barre latérale hors de l'écran tant que `active` vaut `true` (ex. aperçu plein écran). */
export function useRetractSidebar(active: boolean) {
  const { retain } = useContext(SidebarRetractionContext);

  useEffect(() => {
    if (!active) return;
    return retain();
  }, [active, retain]);
}
