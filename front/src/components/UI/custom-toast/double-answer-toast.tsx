import toast from "react-hot-toast";

/**
 * Lorsqu'elle est appelé, permet d'invoquer
 * un toast à double réponse.
 */
export const invokeDoubleAnswerToast = (
  leftAnswer: string,
  rightAnswer: string,
  onClickLeftAnswer: () => void,
  onClickRightAnswer: () => void
) =>
  toast("Êtes-vous sûr ?", {
    position: "bottom-right",
    className: "flex flex-row-reverse gap-x-5",
    icon: (
      <div className="flex gap-x-2">
        <button className="btn btn-primary" onClick={onClickLeftAnswer}>
          {leftAnswer}
        </button>
        <button className="btn" onClick={onClickRightAnswer}>
          {rightAnswer}
        </button>
      </div>
    ),
  });
