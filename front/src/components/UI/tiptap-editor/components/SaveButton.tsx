type SaveButtonProps = {
  onSave: () => void;
};

const SaveButton = ({ onSave }: SaveButtonProps) => {
  return (
    <div className="flex justify-center mt-4 pb-4">
      <button
        className="btn btn-primary text-base-100"
        type="button"
        onClick={onSave}
      >
        Sauvegarder l'activité
      </button>
    </div>
  );
};

export default SaveButton;
