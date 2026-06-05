type Props = {
  isValid: boolean;
  onValidate: () => void;
  onReport: () => void;
};

const QuizModalButtons = ({ isValid, onValidate, onReport }: Props) => {
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
      <button
        className="btn btn-secondary"
        onClick={onValidate}
        disabled={!isValid}
      >
        Valider ma réponse
      </button>
    </div>
  );
};

export default QuizModalButtons;
