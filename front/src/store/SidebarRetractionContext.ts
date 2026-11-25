import { createContext } from "react";

/** Permet à une page de faire reculer la barre latérale pendant qu'un contenu plein écran est affiché. */
export type SidebarRetraction = {
  /** Enregistre une demande de recul et renvoie la fonction qui la retire. */
  retain: () => () => void;
};

export const SidebarRetractionContext = createContext<SidebarRetraction>({
  retain: () => () => undefined,
});
