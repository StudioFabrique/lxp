interface PredictionButtonProps {
  onAnalyze: () => void;
  isPending: boolean;
  /** `true` tant que les indicateurs de la période ne sont pas chargés. */
  disabled?: boolean;
  /** `true` une fois une première analyse obtenue. */
  hasResult: boolean;
}

/**
 * Déclencheur de l'analyse, posé dans l'en-tête de la fiche.
 *
 * L'analyse n'est jamais lancée au chargement de la page : chaque appel
 * mobilise le service IA, et un pronostic affiché d'office prendrait la place
 * des indicateurs mesurés.
 */
export default function PredictionButton({
  onAnalyze,
  isPending,
  disabled = false,
  hasResult,
}: PredictionButtonProps) {
  return (
    <button
      type="button"
      className="btn btn-primary normal-case"
      onClick={onAnalyze}
      disabled={isPending || disabled}
    >
      {isPending ? (
        <>
          <span className="loading loading-spinner" />
          Analyse en cours…
        </>
      ) : hasResult ? (
        "Relancer l'analyse"
      ) : (
        "Analyser le risque de décrochage"
      )}
    </button>
  );
}
