import { Save } from "lucide-react";
import Loader from "../../loader";

type SaveButtonProps = {
  pending?: boolean;
  onSave: () => void;
};

const SaveButton = ({ pending, onSave }: SaveButtonProps) => {
  return (
    <button
      className="self-center btn btn-sm btn-primary text-neutral-content"
      type="button"
      onClick={onSave}
      disabled={pending}
    >
      {pending ? (
        <span>
          <Loader />
        </span>
      ) : (
        <Save />
      )}
      Sauvegarder l'activité
    </button>
  );
};

export default SaveButton;
