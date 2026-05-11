import { useState } from "react";
import { QuizAttempt } from "../../../utils/interfaces/quiz";
import AttemptCard from "./attempt-card";

export interface DetailsAccordionProps {
  attempts: QuizAttempt[];
}

const DetailsAccordion = ({ attempts }: DetailsAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
      <input
        type="checkbox"
        checked={isOpen}
        onChange={() => setIsOpen((prev) => !prev)}
      />
      <div
        className="collapse-title font-semibold cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Détail des réponses
      </div>
      <div className="collapse-content flex flex-col gap-3">
        {attempts.map((attempt, i) => (
          <AttemptCard key={i} attempt={attempt} index={i} />
        ))}
      </div>
    </div>
  );
};

export default DetailsAccordion;
