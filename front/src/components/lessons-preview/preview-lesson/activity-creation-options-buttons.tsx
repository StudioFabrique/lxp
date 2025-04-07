import { LucidePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Lesson from "../../../utils/interfaces/lesson";
interface AddActivityButtonProps {
  selectedLesson: Lesson;
  // handleClickShowTipTapEditor: () => void;
}

const ActivityCreationOptionsButtons = ({
  selectedLesson,
  // handleClickShowTipTapEditor,
}: AddActivityButtonProps) => {
  return (
    <div className="bg-secondary/5 p-10 rounded-lg flex justify-center">
      <div className="flex flex-col items-center group w-fit">
        <div className="btn btn-primary text-base-100 group-hover:opacity-0">
          <LucidePlus />
          Ajouter une activité
        </div>
        <div className="absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* <button
            className="btn btn-primary text-base-100"
            onClick={handleClickShowTipTapEditor}
          >
            Texte avec l'éditeur de code intégré (expérimental)
          </button> */}
          <Link
            to={`/admin/lesson/edit/${selectedLesson.id}?type=text`}
            className="btn btn-primary text-base-100"
          >
            Texte
          </Link>
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
      </div>
    </div>
  );
};

export default ActivityCreationOptionsButtons;
