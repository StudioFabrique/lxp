import { getSidebarItemForPath, sidebarItems, type SidebarLayout } from "../../config/sidebarItems";
import { getSidebarHelp } from "../intro-presentation/intro-sidebar-help";

/** Étape d'un tutoriel : l'assistant virtuel se place près de l'élément désigné par `selector` et lit `message`. */
export type ChatbotTutorialStep = { selector: string; message: string };

export type ChatbotTutorial = {
  id: string;
  /** Question posée par l'utilisateur dans l'éventail de l'assistant virtuel. */
  label: string;
  steps: ChatbotTutorialStep[];
};

/** Bouton « Créer ma première formation » du tableau de bord : repère posé par `LastParcoursItem`. */
export const FIRST_FORMATION_SELECTOR = '[data-chatbot-target="first-formation"]';

/**
 * Guide lancé seul par l'assistant virtuel quand le bouton est affiché : il n'apparaît pas dans l'éventail
 * et ne montre que ce bouton, point de départ de la création de contenu.
 */
export const FIRST_FORMATION_TUTORIAL: ChatbotTutorial = {
  id: "first-formation",
  label: "Créer ma première formation",
  steps: [
    {
      selector: FIRST_FORMATION_SELECTOR,
      message: "La première étape de la création de contenu démarre ici : créez votre première formation, puis ses parcours, modules et cours.",
    },
  ],
};

const MAIN_CONTAINER = "#main-scroll-container";

const getLayout = (pathname: string): SidebarLayout | null => {
  const [layout] = pathname.split("/").filter(Boolean);
  return layout === "admin" || layout === "student" ? layout : null;
};

const sidebarLinkSelector = (layout: SidebarLayout, path: string): string =>
  `aside a[href="/${layout}/${path}"]`;

/** Les entrées ou boutons absents du menu (droits, rôle, mode démonstration) sont ignorés au lancement du tutoriel. */
const controlSteps: ChatbotTutorialStep[] = [
  { selector: 'aside [data-tip="Consommation IA"]', message: "Suivez ici la consommation des fonctionnalités d'intelligence artificielle de votre organisme." },
  { selector: 'aside [data-tip="Revoir la présentation"]', message: "Revoyez à tout moment la présentation de la plateforme." },
  { selector: 'aside [data-tip="Mode clair / Mode sombre"]', message: "Basculez entre le mode clair et le mode sombre selon votre confort de lecture." },
  { selector: 'aside [data-tip="Déconnexion"]', message: "Quittez votre session en toute sécurité lorsque vous avez terminé." },
];

const menuTutorial = (layout: SidebarLayout): ChatbotTutorial => ({
  id: "menu",
  label: "À quoi servent les menus ?",
  steps: [
    {
      selector: "aside",
      message: "Ce menu donne accès à toutes les sections de la plateforme. Je vous les présente une par une.",
    },
    ...sidebarItems[layout].flatMap((item) => {
      const help = getSidebarHelp(layout, item);
      return help
        ? [{ selector: sidebarLinkSelector(layout, item.path), message: `${item.label}. ${help}` }]
        : [];
    }),
    ...controlSteps,
  ],
});

const pageTutorial = (layout: SidebarLayout, pathname: string): ChatbotTutorial | null => {
  const item = getSidebarItemForPath(pathname);
  if (!item) return null;
  return {
    id: "page",
    label: "À quoi sert cette page ?",
    steps: [
      {
        selector: sidebarLinkSelector(layout, item.path),
        message: `Vous êtes dans la section « ${item.label} ». ${getSidebarHelp(layout, item)}`.trim(),
      },
      {
        selector: `${MAIN_CONTAINER} .themed-page-header`,
        message: "Le titre de la page rappelle où vous vous trouvez.",
      },
      {
        selector: `${MAIN_CONTAINER} .header-actions-main > *`,
        message: "Les actions principales de la page se trouvent ici.",
      },
    ],
  };
};

/**
 * Tutoriels proposés sur la page courante, sans IA : ils reposent sur les éléments réellement affichés.
 * Pour en ajouter un, déclarer ses étapes ici ; une étape dont l'élément est absent est ignorée.
 */
export const getChatbotTutorials = (pathname: string): ChatbotTutorial[] => {
  const layout = getLayout(pathname);
  if (!layout) return [];
  const page = pageTutorial(layout, pathname);
  return [...(page ? [page] : []), menuTutorial(layout)];
};
