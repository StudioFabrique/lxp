type Props = {
  onValidate: () => void;
  onReport: () => void;
};

const QuizModalButtons = ({ onValidate, onReport }: Props) => {
  return (
    <div className="flex justify-between mt-">
      <div className="self-end flex items-center">
        <button
          className="btn btn-sm hover:btn-warning btn-link"
          onClick={onReport}
        >
          Signaler un problème
        </button>
      </div>
      <button className="btn btn-secondary" onClick={onValidate}>
        Valider ma réponse
      </button>
    </div>
  );
};

export default QuizModalButtons;
