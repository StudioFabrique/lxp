import { useState, useEffect } from "react";
import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import { ArrowDown, ArrowUp } from "lucide-react";

interface Props {
  quiz: Extract<Quiz, { type: "ordering" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  isAnswered: boolean;
}

const QuizOrdering = ({ quiz, onAnswer, isAnswered }: Props) => {
  // On garde les items et leur index d'origine pour vérifier à la fin
  const [items, setItems] = useState<{ text: string; originalIndex: number }[]>(
    [],
  );

  useEffect(() => {
    setItems(
      quiz.data.items.map((text: string, i: number) => ({
        text,
        originalIndex: i,
      })),
    );
  }, [quiz]);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (isAnswered) return;
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];
    setItems(newItems);
  };

  const handleValidate = () => {
    // On extrait l'ordre actuel basé sur l'index d'origine
    const currentOrder = items.map((item) => item.originalIndex);
    // On compare avec quiz.data.order
    const isCorrect =
      JSON.stringify(currentOrder) === JSON.stringify(quiz.data.order);
    onAnswer(isCorrect, { type: "ordering", items });
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={item.originalIndex}
            className="flex items-center gap-3 p-3 bg-base-200 rounded-box border border-base-300"
          >
            <div className="flex flex-col gap-1">
              <button
                className="btn btn-xs btn-circle btn-ghost"
                disabled={index === 0 || isAnswered}
                onClick={() => moveItem(index, "up")}
              >
                <ArrowUp size={14} />
              </button>
              <button
                className="btn btn-xs btn-circle btn-ghost"
                disabled={index === items.length - 1 || isAnswered}
                onClick={() => moveItem(index, "down")}
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <span className="font-medium text-lg flex-1">{item.text}</span>
            <span className="badge badge-primary badge-outline">
              {index + 1}
            </span>
          </li>
        ))}
      </ul>
      {!isAnswered && (
        <button
          className="btn btn-secondary self-end mt-4"
          onClick={handleValidate}
        >
          Valider ma réponse
        </button>
      )}
    </div>
  );
};

export default QuizOrdering;
