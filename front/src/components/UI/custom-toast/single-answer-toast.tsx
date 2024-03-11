import toast from "react-hot-toast";

/**
 * Lorsqu'elle est appelé, permet d'invoquer
 * un toast avec une réponse.
 */
export const invokeSingleAnswerToast = (
  question: string,
  answer: string,
  onClickAnswer: () => void
) =>
  toast(question, {
    position: "bottom-right",
    className: "flex flex-row-reverse gap-x-5",
    icon: (
      <div className="flex">
        <button className="btn btn-primary" onClick={onClickAnswer}>
          {answer}
        </button>
      </div>
    ),
  });
