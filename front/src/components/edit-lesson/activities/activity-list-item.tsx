// Import des icônes et composants nécessaires
import { GripVertical, Pen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Activity } from "../../../utils/interfaces/activity";
import BookIcon from "../../UI/svg/book-icon";
import Can from "../../UI/can/can.component";
import { useDispatch } from "react-redux";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import { useMemo } from "react";
import { displayDate } from "../../../helpers/dispaly-dates";

// Définition des props du composant
type Props = {
  activity: Activity; // L'activité à afficher
  index: number; // L'index de l'activité dans la liste
  onDeleteActivity: (activity: Activity) => void; // Callback de suppression
};

// Composant qui affiche une activité dans la liste avec les options de modification/suppression
export default function ActivityListItem({
  activity,
  index,
  onDeleteActivity,
}: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mémoisation de la date formatée pour éviter des re-rendus inutiles
  const date = useMemo(
    () => displayDate(activity.createdAt, activity.updatedAt),
    [activity.createdAt, activity.updatedAt]
  );

  // Gestion de la navigation vers la page de prévisualisation de l'activité
  const handleGoToActivity = () => {
    dispatch(lessonActions.setActivity(activity));
    navigate(`preview/${activity.id}`);
  };

  return (
    <article className="flex justify-between items-center">
      {/* Partie gauche: icône de drag, icône de livre et informations de l'activité */}
      <div className="flex items-center gap-x-4">
        <GripVertical className="w-10 h-10 text-primary/50" />
        <div className="w-10 h-10 text-primary">
          <BookIcon />
        </div>
        <span className="flex flex-col justify-center items-start">
          <p className="text-base-content/50 text-xs">
            Activité n°{index + 1} -{" "}
            {activity.type === "text"
              ? "blog"
              : activity.type === "resource"
              ? "ressource(s)"
              : activity.type}
          </p>
          <span className="flex gap-x-2">
            <p className="font-bold">{activity.title}</p>
          </span>
        </span>
      </div>
      {/* Partie droite: date et boutons d'action */}
      <span className="flex items-center gap-x-4">
        <p className="text-base-content/50 text-xs italic">{date}</p>
        {/* Bouton de modification - visible selon les permissions */}
        <Can action="update" object="lesson">
          <button
            onClick={handleGoToActivity}
            className="hover:text-primary-focus transition-colors"
          >
            <Pen className="w-6 h-6 text-primary" />
          </button>
        </Can>
        {/* Bouton de suppression - visible selon les permissions */}
        <Can action="delete" object="lesson">
          <button
            onClick={() => onDeleteActivity(activity)}
            className="hover:text-error-focus transition-colors"
          >
            <Trash2 className="w-6 h-6 text-error" />
          </button>
        </Can>
      </span>
    </article>
  );
}
