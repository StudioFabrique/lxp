import { TriangleAlert } from "lucide-react";

type Props = {
  progress: number;
  isSolved: boolean;
  error: string;
  onRetry: () => void;
};

/**
 * Rend visible la vérification anti-robot qui tourne en tâche de fond.
 *
 * Il n'y a rien à faire pour le visiteur : le navigateur résout une petite
 * énigme de calcul pendant qu'il lit la page. C'est ce qui empêche un robot
 * d'ouvrir des sessions en série et de faire travailler la base pour rien.
 */
const DemoCaptcha = ({ progress, isSolved, error, onRetry }: Props) => {
  if (error) {
    return (
      <output className="block alert alert-warning">
        <TriangleAlert className="h-5 w-5 shrink-0" />
        <span className="text-sm">{error}</span>
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          Réessayer
        </button>
      </output>
    );
  }

  if (!isSolved)
    return (
      <output className="flex flex-col items-center gap-2">
        <progress
          className="progress progress-primary w-64"
          value={Math.round(progress * 100)}
          max={100}
          aria-label="Avancement de la vérification anti-robot"
        />
      </output>
    );
};

export default DemoCaptcha;
