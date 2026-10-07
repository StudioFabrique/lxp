import type { IntroLevel } from "./intro-levels";

type Props = {
  level: IntroLevel;
};

/**
 * Explication d'un niveau, affichée en haut à la place du titre. Toutes les
 * explications occupent la même cellule de grille et la scène fait apparaître
 * celle du niveau courant ; elles sont masquées aux lecteurs d'écran, la scène
 * annonce le niveau actif dans une région live.
 */
const IntroExplanationCard = ({ level }: Props) => (
  <article
    aria-hidden="true"
    className="intro-explanation col-start-1 row-start-1 flex max-w-xl flex-col items-center gap-1 text-center opacity-0"
  >
    <h2 className="text-2xl font-bold">{level.label}</h2>
    <p className="text-base">{level.explanation}</p>
  </article>
);

export default IntroExplanationCard;
