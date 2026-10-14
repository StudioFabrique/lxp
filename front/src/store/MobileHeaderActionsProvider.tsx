import { createContext, useState, type PropsWithChildren } from "react";

/** Titre qu'une page demande d'afficher dans la barre mobile à la place du nom de sa section. */
export type TopBarTitle = { text: string; className?: string };

export type MobileHeaderActions = {
  /** Zone du tiroir d'actions de la barre mobile : les en-têtes de page y déposent leurs actions. */
  container: HTMLElement | null;
  setContainer: (element: HTMLElement | null) => void;
  topBarTitle: TopBarTitle | null;
  setTopBarTitle: (title: TopBarTitle | null) => void;
};

/** Vaut `null` hors de la mise en page de l'application : les en-têtes gardent alors leur affichage normal. */
export const MobileHeaderActionsContext = createContext<MobileHeaderActions | null>(null);

export function MobileHeaderActionsProvider({ children }: PropsWithChildren) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [topBarTitle, setTopBarTitle] = useState<TopBarTitle | null>(null);

  return (
    <MobileHeaderActionsContext value={{ container, setContainer, topBarTitle, setTopBarTitle }}>
      {children}
    </MobileHeaderActionsContext>
  );
}
