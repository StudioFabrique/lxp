import { QuizAttempt } from "../../interfaces/quiz";
import AttemptCardAccordion from "./attempt-card-accordion";

export interface DetailsAccordionProps {
  attempts: QuizAttempt[];
}

const DetailsAccordion = ({ attempts }: DetailsAccordionProps) => {
  return (
    <div className="p-4">
      <div className="font-semibold mb-2">Détail des réponses</div>
      <div className="flex flex-col gap-3">
        {attempts.map((attempt, i) => (
          <AttemptCardAccordion key={i} attempt={attempt} index={i} />
        ))}
      </div>
    </div>
  );
};

export default DetailsAccordion;
