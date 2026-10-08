import type { ChatbotHelp } from "../auth/components/AuthChatbotHostContext";

/** Messages du chatbot au palier d'introduction, avant la découverte des niveaux. */
export const OVERVIEW_DIALOGUE: readonly string[] = [
  "Bonjour ! Je vais vous montrer comment ANDRIA organise vos contenus.",
  "Tout est emboîté : un organisme contient des formations, qui contiennent des parcours, et ainsi de suite jusqu'aux activités.",
  "Faites défiler vers le haut pour découvrir chaque niveau, un par un.",
];

/** Réponses aux questions que l'utilisateur peut poser au chatbot. */
export const INTRO_HELP: ChatbotHelp = {
  action:
    "Faites défiler vers le haut, ou utilisez les flèches à droite, pour découvrir les niveaux un par un.",
  next: "Une fois arrivé aux activités, cliquez sur « Commencer à explorer », disponible dès le premier niveau.",
  back: "Faites défiler vers le bas, utilisez la flèche du bas, ou cliquez sur un niveau à gauche, pour revenir en arrière.",
};

/**
 * Le chatbot n'est monté qu'après l'ouverture animée de la pyramide et de
 * l'arborescence : son placement parcourt tout le DOM et bloquerait le fil
 * principal en plein mouvement, d'où des images sautées. Il se place ensuite
 * FIRST_PLACEMENT_MS plus tard, quand les lignes de l'arborescence ont fini.
 */
export const OPENING_ANIMATION_MS = 2400;

/** Le chatbot se place après ce délai la première fois, puis après le second. */
export const FIRST_PLACEMENT_MS = 1300;
export const NEXT_PLACEMENT_MS = 350;
/** Temps de lecture d'un message avant le suivant. */
export const READ_MS = 2800;

/** Points d'attente entre deux niveaux : brefs, pour ne pas ralentir la découverte. */
export const LEVEL_TYPING_MS = 250;

const MIN_TYPING_MS = 900;
const MAX_TYPING_MS = 2200;
const TYPING_MS_PER_CHARACTER = 12;

/** Les points d'attente durent plus longtemps pour un message plus long. */
export const typingDuration = (message: string): number =>
  Math.min(
    MAX_TYPING_MS,
    MIN_TYPING_MS + message.length * TYPING_MS_PER_CHARACTER,
  );

/**
 * Instant d'apparition de chaque message, depuis l'ouverture : placement du
 * chatbot, points d'attente, lecture, puis le message suivant.
 */
export const dialogueSchedule = (messages: readonly string[]): number[] => {
  const starts: number[] = [];
  let elapsed = 0;
  messages.forEach((message, index) => {
    starts.push(elapsed);
    elapsed +=
      (index === 0 ? FIRST_PLACEMENT_MS : NEXT_PLACEMENT_MS) +
      typingDuration(message) +
      READ_MS;
  });
  return starts;
};
