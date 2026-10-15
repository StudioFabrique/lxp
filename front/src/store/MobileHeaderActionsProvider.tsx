import { createContext, useState, type PropsWithChildren } from "react";

/** Titre qu'une page demande d'afficher dans la barre mobile à la place du nom de sa section. */
export type TopBarTitle = { text: string; className?: string };

/** Panneau plein écran qu'une page propose depuis un bouton dédié de la barre mobile (ex. navigation des activités). */
export type TopBarNavigation = { label: string };

export type MobileHeaderActions = {
  /** Zone du tiroir d'actions de la barre mobile : les en-têtes de page y déposent leurs actions. */
  container: HTMLElement | null;
  setContainer: (element: HTMLElement | null) => void;
  topBarTitle: TopBarTitle | null;
  setTopBarTitle: (title: TopBarTitle | null) => void;
  /** Vaut `null` tant qu'aucune page ne propose de panneau : la barre n'affiche alors pas le bouton. */
  navigation: TopBarNavigation | null;
  setNavigation: (navigation: TopBarNavigation | null) => void;
  isNavigationOpen: boolean;
  setIsNavigationOpen: (open: boolean) => void;
  /** Zone du panneau plein écran : la page y dépose son contenu tant que le panneau est ouvert. */
  navigationContainer: HTMLElement | null;
  setNavigationContainer: (element: HTMLElement | null) => void;
};

/** Vaut `null` hors de la mise en page de l'application : les en-têtes gardent alors leur affichage normal. */
export const MobileHeaderActionsContext = createContext<MobileHeaderActions | null>(null);

export function MobileHeaderActionsProvider({ children }: PropsWithChildren) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [topBarTitle, setTopBarTitle] = useState<TopBarTitle | null>(null);
  const [navigation, setNavigation] = useState<TopBarNavigation | null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [navigationContainer, setNavigationContainer] = useState<HTMLElement | null>(null);

  return (
    <MobileHeaderActionsContext
      value={{
        container,
        setContainer,
        topBarTitle,
        setTopBarTitle,
        navigation,
        setNavigation,
        isNavigationOpen,
        setIsNavigationOpen,
        navigationContainer,
        setNavigationContainer,
      }}
    >
      {children}
    </MobileHeaderActionsContext>
  );
}
