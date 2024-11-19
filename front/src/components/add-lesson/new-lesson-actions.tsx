import SubmitButton from "../UI/submit-button";

type Props = {
  isLoading: boolean;
  handleResetForm: () => void;
  handleStep: (value: boolean) => void;
};

export default function NewLessonActions(props: Props) {
  return (
    <div className="flex justify-between items-center">
      <button
        className="btn btn-primary btn-outline"
        type="button"
        onClick={props.handleResetForm}
      >
        Réinitialiser
      </button>
      <span className="flex gap-x-4 justify-end">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => props.handleStep(false)}
        >
          Retour
        </button>
        <SubmitButton
          label="Enregistrer"
          loadingLabel="Enregistrement..."
          isLoading={props.isLoading}
        />
      </span>
    </div>
  );
}
