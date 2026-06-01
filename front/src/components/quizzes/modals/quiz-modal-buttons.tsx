type Props = {
  onValidate: () => void;
  onReport: () => void;
  isAnswered: boolean;
};

const QuizModalButtons = ({ onValidate, onReport, isAnswered }: Props) => {
  return (
    <div className="flex justify-between">
      <button className="btn" onClick={onReport}>
        Signaler un problème
      </button>
      <button
        className="btn btn-secondary self-end"
        onClick={onValidate}
        disabled={isAnswered}
      >
        Valider ma réponse
      </button>
    </div>
  );
};

export default QuizModalButtons;
