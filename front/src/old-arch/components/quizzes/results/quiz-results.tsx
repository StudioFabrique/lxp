import { cn } from "../../../utils";
import { QuizAttempt } from "../../../utils/interfaces/quiz";
import DetailsAccordion from "./details-accordion";

interface QuizResultsProps {
  score: number;
  attempts: QuizAttempt[];
  onContinue: () => void;
  continueLabel?: string;
}

const QuizResults = ({
  score,
  attempts,
  onContinue,
  continueLabel = "Continuer",
}: QuizResultsProps) => {
  const total = attempts.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const scoreColor = cn(
    percentage >= 60
      ? "text-success"
      : percentage >= 40
        ? "text-warning"
        : "text-error",
  );

  const progressColor = cn(
    percentage >= 60
      ? "progress-success"
      : percentage >= 40
        ? "progress-warning"
        : "progress-error",
  );

  const message =
    percentage >= 80
      ? "Excellente performance !"
      : percentage >= 60
        ? "Bien joué !"
        : percentage >= 40
          ? "Acquis partiels. Un travail de consolidation est nécessaire sur les concepts non validés."
          : "Résultat insuffisant. Une réévaluation ultérieure est conseillée.";

  return (
    <div className="flex flex-col gap-8 mt-2">
      {/* Score global */}
      <div className="flex flex-col items-center gap-2 p-6 bg-base-200 rounded-box">
        <div className={cn("text-5xl font-bold", scoreColor)}>
          {score}/{total}
        </div>
        <p className="text-lg font-medium">{message}</p>
        <progress
          className={cn("progress w-full mt-3", progressColor)}
          value={percentage}
          max={100}
        />
        <p className="text-sm text-base-content/60">{percentage}%</p>
      </div>

      {/* Détail des réponses */}
      <DetailsAccordion attempts={attempts} />

      {/* Bouton continuer */}
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={onContinue}>
          {continueLabel}
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
