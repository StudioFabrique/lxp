import { LucidePlus } from "lucide-react";
import { Link } from "react-router-dom";
import type Lesson from "../../../utils/interfaces/lesson";
import { useState } from "react";
import Resource from "../../../utils/interfaces/resource";
interface AddActivityButtonProps {
  variant?: "no-activity" | "with-activity";
  selectedLesson: Lesson | Resource;
  onClickShowTipTapEditor: () => void;
  isDisabled?: boolean;
  parent?: "lesson" | "resource";
}

const ActivityCreationOptionsButtons = ({
  variant = "with-activity",
  selectedLesson,
  onClickShowTipTapEditor,
  isDisabled = false,
  parent = "lesson",
}: AddActivityButtonProps) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleShowButtons = () => {
    if (isDisabled) return;
    setShowButtons(true);
  };

  return (
    <div
      className={`${
        variant === "no-activity" ? "" : "p-10 "
      }rounded-lg flex justify-center items-center`}
    >
      <div className="flex flex-col gap-5 items-center w-fit">
        {!showButtons ? (
          <>
            {variant === "no-activity" && (
              <p className="font-bold text-primary">Aucune activité</p>
            )}
            <button
              onClick={handleShowButtons}
              onKeyDown={handleShowButtons}
              className={`btn ${
                isDisabled
                  ? "cursor-not-allowed tooltip"
                  : "btn-primary text-base-100"
              }`}
              type="button"
              data-tip="Une activité est déja en cours d'édition"
            >
              <LucidePlus />
              Ajouter une activité
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-5 items-center">
            <p className="font-bold text-primary">
              Créer une activité de type :
            </p>
            <div className="flex gap-2 transition-opacity">
              <button
                className={`btn ${
                  isDisabled ? "btn-disabled" : "btn-primary text-base-100"
                }`}
                onClick={onClickShowTipTapEditor}
                onKeyDown={onClickShowTipTapEditor}
                type="button"
              >
                Texte
              </button>
              <Link
                to={`/admin/lesson/edit/${selectedLesson.id}?type=video&parent=${parent}`}
                className={`btn ${
                  isDisabled ? "btn-disabled" : "btn-primary text-base-100"
                }`}
              >
                Vidéo
              </Link>
              <Link
                to={`/admin/lesson/edit/${selectedLesson.id}?type=image`}
                className={`btn ${
                  isDisabled ? "btn-disabled" : "btn-primary text-base-100"
                }`}
              >
                Image
              </Link>
              <Link
                to={`/admin/lesson/edit/${selectedLesson.id}?type=resource`}
                className={`btn ${
                  isDisabled ? "btn-disabled" : "btn-primary text-base-100"
                }`}
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
