type Props = {
  /** Permet de relier le conseil au champ d'import (`aria-describedby`). */
  id?: string;
  /** Contraintes de format du fichier, affichées en tête de liste. */
  formatHint: string;
};

/** Conseils pour que le logo de l'organisme s'intègre bien à l'application. */
export default function InstanceLogoAdvice({ id, formatHint }: Props) {
  return (
    <ul
      id={id}
      className="list-inside list-disc text-left text-xs text-base-content/60"
    >
      <li>{formatHint}</li>
      <li>PNG à fond transparent de préférence</li>
      <li>Format horizontal, environ 128 × 50 px</li>
    </ul>
  );
}
