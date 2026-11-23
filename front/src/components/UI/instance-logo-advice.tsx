import QuestionMarkTooltip from "./question-mark-tooltip/question-mark-tooltip";

type Props = {
  /** Permet de relier le conseil au champ d'import (`aria-describedby`). */
  id?: string;
  /** Contraintes de format du fichier, en tête des conseils. */
  formatHint: string;
};

/**
 * Conseils pour que le logo de l'organisme s'intègre bien à l'application,
 * dans une infobulle à placer à côté du titre « Logo ». Le texte reste aussi
 * dans la page, masqué visuellement, pour les technologies d'assistance :
 * l'infobulle ne s'ouvre qu'au survol.
 */
export default function InstanceLogoAdvice({ id, formatHint }: Props) {
  const advice = `${formatHint}. PNG à fond transparent de préférence. Format horizontal, environ 128 × 50 px.`;

  return (
    <span className="inline-flex items-center">
      <QuestionMarkTooltip tooltipValue={advice} tooltipPosition="bottom" />
      <span id={id} className="sr-only">
        {advice}
      </span>
    </span>
  );
}
