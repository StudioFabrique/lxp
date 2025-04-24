import { LucidePlus } from "lucide-react";
import { Link } from "react-router-dom";
import type Lesson from "../../../utils/interfaces/lesson";
import { useState } from "react";
interface AddActivityButtonProps {
  selectedLesson: Lesson;
  onClickShowTipTapEditor: () => void;
  isDisabled?: boolean;
}

const ActivityCreationOptionsButtons = ({
  selectedLesson,
  onClickShowTipTapEditor,
  isDisabled = false,
}: AddActivityButtonProps) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleShowButtons = () => {
    if (isDisabled) return;
    setShowButtons(true);
  };

  return (
    <div className="bg-secondary/5 p-10 rounded-lg flex justify-center">
      <div className="flex flex-col items-center w-fit">
        {!showButtons ? (
          <button
            onClick={handleShowButtons}
            onKeyDown={handleShowButtons}
            className={`btn ${isDisabled ? "cursor-not-allowed tooltip" : "btn-primary text-base-100"}`}
            type="button"
            data-tip="Une activité est déja en cours d'édition"
          >
            <LucidePlus />
            Ajouter une activité
          </button>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <p>Créer une activité de type :</p>
            <div className="flex gap-2 transition-opacity">
              <button
                className="btn btn-primary text-base-100"
                onClick={onClickShowTipTapEditor}
                onKeyDown={onClickShowTipTapEditor}
                type="button"
              >
                Texte
              </button>
              {/* <Link
            to={`/admin/lesson/edit/${selectedLesson.id}?type=text`}
            className="btn btn-primary text-base-100"
          >
            Texte (Ancienne version)
          </Link> */}
              <Link
                to={`/admin/lesson/edit/${selectedLesson.id}?type=video`}
                className={`btn ${isDisabled ? "btn-disabled" : "btn-primary text-base-100"}`}
              >
                Vidéo
              </Link>
              <Link
                to={`/admin/lesson/edit/${selectedLesson.id}?type=image`}
                className={`btn ${isDisabled ? "btn-disabled" : "btn-primary text-base-100"}`}
              >
                Image
              </Link>
              <Link
                to={`/admin/lesson/edit/${selectedLesson.id}?type=resource`}
                className={`btn ${isDisabled ? "btn-disabled" : "btn-primary text-base-100"}`}
              >
                Fichier
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCreationOptionsButtons;
