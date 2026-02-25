type Props = {
  isOpen: boolean;
  onDeclineQuiz: () => void;
  onAcceptQuiz: () => void;
};

const QuizRequestModal = ({ isOpen, onAcceptQuiz, onDeclineQuiz }: Props) => {
  return isOpen ? (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          💡 Je t'ai préparé un quiz rapide !
        </h3>
        <p className="py-4">
          On dirait que tu as parcouru cette ressource à ton rythme. Veux-tu
          vérifier rapidement tes acquis avant de passer à la suite ?
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onDeclineQuiz}>
            Non merci, continuer
          </button>
          <button
            className="btn btn-primary text-base-100"
            onClick={onAcceptQuiz}
          >
            Faire le quiz
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default QuizRequestModal;
