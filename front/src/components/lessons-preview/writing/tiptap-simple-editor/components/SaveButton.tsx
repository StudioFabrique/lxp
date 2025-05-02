type SaveButtonProps = {
  onSave: () => void;
};

const SaveButton = ({ onSave }: SaveButtonProps) => {
  return (
    <button
      className="btn btn-primary text-base-100 fixed bottom-0 right-0 my-5 mx-20 z-10"
      type="button"
      onClick={onSave}
    >
      Sauvegarder l'activité
    </button>
  );
};

export default SaveButton;
