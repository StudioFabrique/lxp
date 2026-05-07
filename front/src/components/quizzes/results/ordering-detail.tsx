import clsx from "clsx";
import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";

export interface OrderingDetailProps {
  quiz: Extract<Quiz, { type: "ordering" }>;
  userAnswer: Extract<UserAnswer, { type: "ordering" }>;
}

const OrderingDetail = ({ quiz, userAnswer }: OrderingDetailProps) => {
  const { items: userItems } = userAnswer;
  const correctItems = quiz.data.order.map((i) => quiz.data.items[i]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
          Votre ordre
        </p>
        {userItems.map((item, i) => (
          <div
            key={i}
            className={clsx(
              "p-2 rounded-lg text-sm",
              item.originalIndex === quiz.data.order[i]
                ? "bg-success/15 text-success"
                : "bg-error/15 text-error",
            )}
          >
            <span className="font-medium mr-1 opacity-60">{i + 1}.</span>
            {item.text}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
          Ordre correct
        </p>
        {correctItems.map((text, i) => (
          <div
            key={i}
            className="p-2 rounded-lg text-sm bg-success/15 text-success"
          >
            <span className="font-medium mr-1 opacity-60">{i + 1}.</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderingDetail;
