import { createContext, useContext } from "react";

type SidebarDisplay = {
  /** Libellés toujours visibles (tiroir mobile) au lieu de la barre compacte des écrans moyens. */
  expanded: boolean;
};

export const SidebarDisplayContext = createContext<SidebarDisplay>({
  expanded: false,
});

export const useSidebarDisplay = (): SidebarDisplay =>
  useContext(SidebarDisplayContext);
