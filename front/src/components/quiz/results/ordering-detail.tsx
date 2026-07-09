import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import { cn } from "../../../utils/helpers/style-helpers";

export interface OrderingDetailProps {
  quiz: Extract<Quiz, { type: "ordering" }>;
  userAnswer: Extract<UserAnswer, { type: "ordering" }>;
}

const OrderingDetail = ({ quiz, userAnswer }: OrderingDetailProps) => {
  const { items: userItems } = userAnswer;

  const correctOrder = quiz?.data?.order ?? [];
  const correctItems = correctOrder.map(
    (i) => quiz?.data?.items?.[i] ?? "Élément inconnu",
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
          Votre ordre
        </p>
        {userItems.map((item, i) => {
          // 2. Safe verification logic
          const isCorrect =
            correctOrder.length > 0 && item.originalIndex === correctOrder[i];

          return (
            <div
              key={i}
              className={cn(
                "p-2 rounded-lg text-sm",
                isCorrect
                  ? "bg-success/15 text-success"
                  : "bg-error/15 text-error",
              )}
            >
              <span className="font-medium mr-1 opacity-60">{i + 1}.</span>
              {item.text}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
          Ordre correct
        </p>
        {correctOrder.length > 0 ? (
          correctItems.map((text, i) => (
            <div
              key={i}
              className="p-2 rounded-lg text-sm bg-success/15 text-success"
            >
              <span className="font-medium mr-1 opacity-60">{i + 1}.</span>
              {text}
            </div>
          ))
        ) : (
          <div className="p-2 text-sm italic text-base-content/50 bg-base-200 rounded-lg">
            Indisponible
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderingDetail;
