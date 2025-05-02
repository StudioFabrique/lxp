type SaveButtonProps = {
  onSave: () => void;
};

const SaveButton = ({ onSave }: SaveButtonProps) => {
  return (
    <button
      className="btn fixed bottom-0 right-0 m-10"
      type="button"
      onClick={onSave}
    >
      Sauvegarder
    </button>
  );
};

export default SaveButton;
