import { LucidePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Lesson from "../../../utils/interfaces/lesson";
import { useState } from "react";
interface AddActivityButtonProps {
  selectedLesson: Lesson;
  onClickShowTipTapEditor: () => void;
}

const ActivityCreationOptionsButtons = ({
  selectedLesson,
  onClickShowTipTapEditor,
}: AddActivityButtonProps) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleShowButtons = () => {
    setShowButtons(true);
  };

  return (
    <div className="bg-secondary/5 p-10 rounded-lg flex justify-center">
      <div className="flex flex-col items-center w-fit">
        {!showButtons ? (
          <div
            onClick={handleShowButtons}
            className="btn btn-primary text-base-100"
          >
            <LucidePlus />
            Ajouter une activité
          </div>
        ) : (
          <div className="flex gap-2 transition-opacity">
            <button
              className="btn btn-primary text-base-100"
              onClick={onClickShowTipTapEditor}
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
              className="btn btn-primary text-base-100"
            >
              Vidéo
            </Link>
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}?type=image`}
              className="btn btn-primary text-base-100"
            >
              Image
            </Link>
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}?type=resource`}
              className="btn btn-primary text-base-100"
            >
              Fichier
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCreationOptionsButtons;
