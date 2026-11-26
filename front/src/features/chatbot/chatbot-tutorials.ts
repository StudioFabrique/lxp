import { matchPath } from "react-router";
import guideData from "../../config/chatbot/chatbot-guide.json";
import { chatbotGuideSchema, type ChatbotGuide, type ChatbotGuideQuestion, type ChatbotGuideStep } from "./chatbot-guide.schema";

/** Étape d'un tutoriel : l'assistant virtuel se place près de l'élément désigné par `selector` et lit `message`. */
export type ChatbotTutorialStep = { selector: string; message: string };

/**
 * Entrée de l'éventail issue du guide : un tutoriel (`steps`) ou une réponse préenregistrée (`answer`,
 * sans étape). Les deux s'affichent sans appel à l'IA.
 */
export type ChatbotTutorial = {
  id: string;
  /** Question posée par l'utilisateur dans l'éventail de l'assistant virtuel. */
  label: string;
  steps: ChatbotTutorialStep[];
  answer?: string;
};

/**
 * Point de départ du tableau de bord vide : le bouton de l'étape mise en avant de la checklist « Bien démarrer »
 * (`onboarding-current-step`) ou, sans checklist, le bouton « Créer ma première formation » de `LastParcoursItem`.
 */
export const FIRST_FORMATION_SELECTOR =
  '[data-chatbot-target="onboarding-current-step"], [data-chatbot-target="first-formation"]';

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
      message: "Commencez ici : suivez les étapes de mise en route, de haut en bas. Chaque étape débloque la suivante.",
    },
  ],
};

/** Premier bouton de l'espace apprenant : « Accéder au parcours » du tableau de bord. */
export const FIRST_PARCOURS_SELECTOR = '[data-chatbot-target="first-parcours"]';

/** Guide de la première visite d'un apprenant : il mène au parcours, première étape de son apprentissage. */
export const FIRST_PARCOURS_TUTORIAL: ChatbotTutorial = {
  id: "first-parcours",
  label: "Accéder à mon parcours",
  steps: [
    {
      selector: FIRST_PARCOURS_SELECTOR,
      message: "Bienvenue dans votre espace ! Commencez ici : ouvrez votre parcours pour découvrir ses modules.",
    },
  ],
};

/** Bouton « Démarrer » de l'aperçu du parcours, à l'écran suivant. */
export const START_PARCOURS_SELECTOR = '[data-chatbot-target="start-parcours"]';

/** Suite du guide apprenant : sur l'aperçu du parcours, l'assistant virtuel désigne « Démarrer ». */
export const START_PARCOURS_TUTORIAL: ChatbotTutorial = {
  id: "start-parcours",
  label: "Démarrer mon parcours",
  steps: [
    {
      selector: START_PARCOURS_SELECTOR,
      message: "Voici votre parcours. Cliquez sur « Démarrer » pour commencer votre premier module.",
    },
  ],
};

/** Le fichier est une donnée de contenu : il est contrôlé au chargement pour qu'une faute de frappe échoue en test et non chez l'utilisateur. */
export const chatbotGuide: ChatbotGuide = chatbotGuideSchema.parse(guideData);

const getLayout = (pathname: string): "admin" | "student" | null => {
  const [layout] = pathname.split("/").filter(Boolean);
  return layout === "admin" || layout === "student" ? layout : null;
};

/** Sélecteur CSS d'un repère `data-chatbot-target` ; les valeurs du guide sont des identifiants simples, sans guillemet. */
export const chatbotTargetSelector = (target: string): string => `[data-chatbot-target="${target}"]`;

const toStep = (step: ChatbotGuideStep): ChatbotTutorialStep => ({
  selector: step.target === undefined ? (step.selector ?? "") : chatbotTargetSelector(step.target),
  message: step.message,
});

const toTutorial = (scope: string, question: ChatbotGuideQuestion): ChatbotTutorial => ({
  id: `${scope}:${question.id}`,
  label: question.label,
  steps: question.steps?.map(toStep) ?? [],
  answer: question.answer,
});

/**
 * Questions proposées sur la page courante, sans IA : la première de la page (« À quoi sert cette page ? »),
 * celles de son interface (menus), puis les autres questions de la page. Les tutoriels reposent sur les éléments
 * réellement affichés : une étape dont l'élément est absent (droits, rôle, écran étroit) est ignorée au lancement.
 * Pour en ajouter, éditer `config/chatbot/chatbot-guide.json`.
 */
export const getChatbotTutorials = (pathname: string, guide: ChatbotGuide = chatbotGuide): ChatbotTutorial[] => {
  const layout = getLayout(pathname);
  if (!layout) return [];
  const page = guide.pages.find((entry) => entry.routes.some((route) => matchPath({ path: route, end: true }, pathname)));
  const [overview, ...pageQuestions] = page?.questions.map((question) => toTutorial(page.id, question)) ?? [];
  const layoutQuestions = guide.layouts[layout].questions.map((question) => toTutorial(layout, question));
  return [...(overview ? [overview] : []), ...layoutQuestions, ...pageQuestions];
};
