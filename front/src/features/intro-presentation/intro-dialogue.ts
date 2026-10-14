import type { ChatbotHelp } from "../auth/components/AuthChatbotHostContext";

/** Messages de l’assistant virtuel au palier d'introduction, avant la découverte des niveaux. */
export const OVERVIEW_DIALOGUE: readonly string[] = [
  "Bonjour ! Je vais vous montrer comment ANDRIA organise vos contenus.",
  "Tout est emboîté : un organisme contient des formations, qui contiennent des parcours, et ainsi de suite jusqu'aux activités.",
  "Faites défiler vers le bas pour découvrir chaque niveau, un par un.",
];

/** Réponses aux questions que l'utilisateur peut poser à l’assistant virtuel. */
export const INTRO_HELP: ChatbotHelp = {
  action:
    "Faites défiler vers le bas, ou utilisez les flèches à droite, pour découvrir les niveaux un par un.",
  next: "Lisez mes explications avec « Suivant », puis cliquez sur « Continuer », ou faites défiler vers le bas, pour passer au niveau suivant. Au dernier niveau, « Continuer » termine la présentation.",
  back: "Faites défiler vers le haut, utilisez la flèche du haut, cliquez sur un niveau à gauche, ou sur « Précédent » dans ma bulle, pour revenir en arrière.",
};

/**
 * L’assistant virtuel est monté pendant l'ouverture animée de la pyramide et de
 * l'arborescence, mais son placement, qui parcourt tout le DOM et bloque le
 * fil principal, a lieu FIRST_PLACEMENT_MS plus tard : il doit tomber à la fin
 * de l'ouverture (environ 2,3 s) pour ne pas saccader les lignes.
 */
export const OPENING_ANIMATION_MS = 1000;

/** L’assistant virtuel se place après ce délai la première fois, puis après le second. */
export const FIRST_PLACEMENT_MS = 1300;
export const NEXT_PLACEMENT_MS = 350;
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
